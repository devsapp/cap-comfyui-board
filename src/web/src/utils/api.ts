import axios from 'axios';
import retry from '../utils/timeoutRetry'
import { DEFAULT_IMAGE_WIDTH, DEFAULT_IMAGE_HEIGHT,DEFAULT_ENDPOINT_HASH} from '../components/Index/constants';


export type ComfyUIPrompt = Record<string, ComfyUIPromptNode>;
export type ComfyUIPromptNode = {
  inputs: Record<string, any>;
  class_type: string;
  _meta: ComfyUIPromptMeta;
};
export type ComfyUIPromptMeta = {
  title: string;
  edit?: ComfyUIPromptEditPanel[];
};

export type ComfyUIPromptEditPanel = {
  type: 'image' | 'select' | 'number' | 'string' | 'group';
  id?: string;
  key: string;
  title: string;
  description?: string;
  options?: string[] | string;
  min?: number;
  max?: number;
  step?: number;
  hidden?: boolean;
  children?: ComfyUIPromptEditPanel[];
};

export type ComfyUINode = {
  output: string[];
  output_is_list: boolean[];
  output_name: string[];
  name: string;
  display_name: string;
  description: string;
  category: string;
  output_node: boolean;
  input: {
    required: Record<string, ComfyUINodeInput>;
    optional: Record<string, ComfyUINodeInput>;
  };
};
export type ComfyUINodeInput =
  | ['IMAGE', { default: number; min: number; max: number; step?: number }]
  | ['INT', { default: number; min: number; max: number; step?: number }]
  | ['FLOAT', { default: number; min: number; max: number; step?: number }]
  | [string[], Record<string, any>];

export type ComfyUIProgress = Record<string, ComfyUIProgressNode>;
export type ComfyUIProgressNode = {
  max: number;
  value: number;
  start: number;
  last_updated: number;
  images: ComfyUIProgressNodeImage[];
  results: string[];
};
export type ComfyUIProgressNodeImage = {
  filename: string;
  name?: string;
  subfolder: string;
  type: string;
};

export type PainerRequestParams = {
  image?: string,  // 图像 base64移除头部信息
  prompt?: string,  // 输入正常提示词
  imageSize?: {  // 图像大小
    width: number,
    height: number
  },
  seed?: number, //随机种子
  style?: string // 风格
}

function random() {
  return Math.floor(Math.random() * 10000000000000000);
}

export async function runPrompt(
  endpoint: string,
  prompt: ComfyUIPrompt,
  callback: (progress: ComfyUIProgress) => void,
  useAsync = true
) {
  // 处理下 seed 字段
  let prompt_with_seed = JSON.parse(JSON.stringify(prompt));
  for (const nodeid of Object.keys(prompt_with_seed)) {
    if (prompt_with_seed[nodeid]?.inputs?.seed === -1) {
      prompt_with_seed[nodeid].inputs.seed = random();
    }
  }

  return await new Promise<ComfyUIProgress>((resolve, reject) => {
    let progress = {} as ComfyUIProgress;

    try {
      const ws = new WebSocket(`${endpoint.replace('http', 'ws')}/api/run/ws`);
      ws.onopen = () => {
        ws.send(JSON.stringify(prompt_with_seed));
      };
      ws.onerror = (ev) => {
        reject(`websocket close on error, ${ev.toString()}`);
      };
      ws.onclose = () => {
        resolve(progress);
      };
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        switch (msg.type) {
          case 'error':
            reject(msg.data);
            break;

          case 'result':
          case 'progress':
            progress = msg.data;
            callback(progress as ComfyUIProgress);
            break;

          default:
            console.error(
              `known message type ${msg.type}\n${JSON.stringify(msg.data)}`
            );
            break;
        }
      };
    } catch (e) {
      reject(e);
    }
  });

}

/**
 * 获取 ComfyUI 存储的图片地址
 */
export async function getImage(
  endpoint: string,
  image: ComfyUIProgressNodeImage
) {
  return `${endpoint}/view?filename=${image.filename}&type=${image.type
    }&subfolder=${image.subfolder}&rand=${Math.random()}`;
}

/**
 * 上传图片
 */
export async function uploadImage(
  endpoint: string,
  image: Blob,
  overwrite?: boolean
): Promise<ComfyUIProgressNodeImage> {
  const formData = new FormData();
  formData.append('image', image);
  if (overwrite) formData.append('overwrite', '1');

  const resp = await axios.post(`${endpoint}/upload/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return resp.data;
}

/**
 * 判断图片是否存在
 */
export async function isImageExists(
  endpoint: string,
  image: ComfyUIProgressNodeImage
) {
  const url = await getImage(endpoint, image);
  try {
    const resp = await axios.head(url);
    return resp.status === 200;
  } catch {
    return false;
  }
}

/**
 * 获取节点信息
 */
export async function getObjectInfo(
  endpoint: string
): Promise<Record<string, ComfyUINode>> {
  const resp = await axios.get(`${endpoint}/object_info`);

  return resp?.data;
}

/**
 * 获取图片 Blob
 */
export async function getImageBlob(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('获取 Blob 时出错:', error);
    return new Blob();
  }
}

// 获取元数据
async function getJSON(url: string) {
  try {
    let response = await fetch(url);
    return await response.json();
  } catch (e) {
    console.error('请求失败！', e);
  }
  return {};
}

export async function getMetaData() {
  let metaData = await getJSON("https://serverless-tool-images.oss-cn-hangzhou.aliyuncs.com/aigc/json/cap-comfyui-board.json");
  return metaData;
}

export async function imgeToImage(requestData: any, comfyUiMetaData: any, queueKey: string) {
  const { image, prompt, style, seed, imageSize } = requestData;
  const formatData: any = { //将提示词和风格进行合并
    image,
    seed,
    value: style,
    text: prompt,
    width: imageSize?.width || DEFAULT_IMAGE_WIDTH,
    height: imageSize?.height || DEFAULT_IMAGE_HEIGHT,
    resolution: imageSize?.width || DEFAULT_IMAGE_WIDTH,
  }
  const payload = comfyUiMetaData.payload;
  const params = comfyUiMetaData.params;
  params.forEach((item: any) => {
    const { id, key, defaultValue } = item;
    if (payload[id]) {
      let inputs = payload[id]['inputs']
      if (inputs[key] !== undefined) {
        inputs[key] = formatData[key] || defaultValue || ''
      }
    }
  });

  return await retry(`${DEFAULT_ENDPOINT_HASH}/api/run`, payload, queueKey);
}






