import {
  AppState,
  Excalidraw,
  ExcalidrawElement,
  MainMenu,
} from '@excalidraw/excalidraw';
import { Button, Image, Spin } from 'antd';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

import { getMetaData, imgeToImage, PainerRequestParams } from '@/utils/api';
import {
  debounce,
  getValueFromMetaData,
  transformFilesDataFromUrlToBase64,
} from '@/utils/common';

import aborts from '../../utils/abortObjs';
import Header from '../Header/Index';
import {
  DEFAULT_IMAGE_HEIGHT,
  DEFAULT_IMAGE_WIDTH,
  DEFAULT_INSPIRATION_PICTURE,
  EXCALIDRAW_IMAGE_TEMPLAGE,
  EXCALIDRAW_INIT_DATA,
  SEED_LIST,
} from './constants';
import Inspiration from './Inspiration';
import Prompt from './Prompt';
import Ratio from './Ratio';
import styles from './style.scss';
import Styles from './Styles';

let isPointerDown = false;
const imgPrefix = 'data:image/png;base64,';
const fallbackImg =
  'data:image/png;base64,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';

const remoteMetaData: any = await getMetaData(); //获取远端初始化数据

const debouncePromptChange = debounce((drawImage: any, prompt: string) => {
  if (drawImage) drawImage({ prompt });
}, 2000);

const debounceDrawFunction = debounce((callback: any) => {
  callback && callback();
}, 500);

// 定义一个函数来获取原始图像中指定位置的像素颜色
function getPixelColor(x: number, y: number, imageData: any) {
  x = Math.min(Math.max(x, 0), imageData.width - 1);
  y = Math.min(Math.max(y, 0), imageData.height - 1);
  let index = (y * imageData.width + x) * 4;
  return {
    r: imageData.data[index],
    g: imageData.data[index + 1],
    b: imageData.data[index + 2],
    a: imageData.data[index + 3],
  };
}
function bilinearInterpolate(
  x: number,
  y: number,
  imageData: ImageData
): [number, number, number, number] {
  // 获取周围四个像素的颜色
  let p1 = getPixelColor(x, y, imageData);
  let p2 = getPixelColor(x + 1, y, imageData);
  let p3 = getPixelColor(x, y + 1, imageData);
  let p4 = getPixelColor(x + 1, y + 1, imageData);
  // 计算权重
  let weightX = x % 1;
  let weightY = y % 1;

  // 计算加权平均颜色
  let color = {
    r:
      (1 - weightX) * (1 - weightY) * p1.r +
      weightX * (1 - weightY) * p2.r +
      (1 - weightX) * weightY * p3.r +
      weightX * weightY * p4.r,
    g:
      (1 - weightX) * (1 - weightY) * p1.g +
      weightX * (1 - weightY) * p2.g +
      (1 - weightX) * weightY * p3.g +
      weightX * weightY * p4.g,
    b:
      (1 - weightX) * (1 - weightY) * p1.b +
      weightX * (1 - weightY) * p2.b +
      (1 - weightX) * weightY * p3.b +
      weightX * weightY * p4.b,
    a:
      (1 - weightX) * (1 - weightY) * p1.a +
      weightX * (1 - weightY) * p2.a +
      (1 - weightX) * weightY * p3.a +
      weightX * weightY * p4.a,
  };
  return [color.r, color.g, color.b, color.a];
}

async function transformFilesDataFromMetadata(metaData: any) {
  let _excalidrawInitData = EXCALIDRAW_INIT_DATA;
  try {
    let inspirations = metaData?.inspirations || []; // 获取服务端灵感数据
    const excalidrawFiles = inspirations.reduce(
      (preItem: any, nextItem: any) => {
        //将灵感数据进行Map转化，适配excalidrawFiles
        preItem[nextItem.label] = {
          mimeType: 'image/jpg',
          id: nextItem.label,
          dataURL: nextItem.value,
        };
        return preItem;
      },
      {}
    );
    if (Object.keys(excalidrawFiles).length > 0) {
      let _files = EXCALIDRAW_INIT_DATA.files;
      _files = Object.assign({}, _files, excalidrawFiles);
      const mergedExcalidrawInitData = Object.assign({}, EXCALIDRAW_INIT_DATA, {
        files: _files,
      }); // 跟初始数据合并
      _excalidrawInitData = await transformFilesDataFromUrlToBase64(
        mergedExcalidrawInitData
      );
    }
  } catch (e) {}
  return _excalidrawInitData;
}

const globalExcalidrawInitData = await transformFilesDataFromMetadata(
  remoteMetaData
); //

export default function () {
  const excalidrawRef = useRef<HTMLDivElement>(null); // 更改为 HTMLDivElement
  const [excalidrawInitData, setExcalidrawInitData] = useState(
    globalExcalidrawInitData
  );
  const [comfyUiMetaData, setComfyUiMetaData] = useState(remoteMetaData);
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [inspirationValue, setInspirationValue] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    { width: DEFAULT_IMAGE_WIDTH, height: DEFAULT_IMAGE_HEIGHT }
  );

  const [img1, setImg1] = useState<string | null>('');
  const [img2, setImg2] = useState<string | null>('');
  const [img3, setImg3] = useState<string | null>('');
  const [img4, setImg4] = useState<string | null>('');

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);

  const [startApiDraw, setStartApiDraw] = useState(false);

  // 取消全部请求
  const abortAllDraw = () => {
    if (startApiDraw && aborts.length === 0) return;
    aborts.forEach((item) => {
      item.abort();
    });
    aborts.length = 0; // 最后清空aborts数组
    setStartApiDraw(false);
  };

  // 清空画板
  const resetCanvas: any = () => {
    abortAllDraw(); // 先取消所有请求
    const emptySceneData = {
      elements: [],
      appState: {
        activeTool: {
          lastActiveTool: {
            type: 'freedraw',
            customType: null,
          },
          type: 'freedraw',
          customType: null,
        },
      },
    };
    excalidrawAPI.updateScene(emptySceneData);
    setPrompt('');
    setInspirationValue('');
  };

  const onStyleChange = (value: string) => {
    setStyle(value);
    setTimeout(() => {
      drawImage({ style: value });
    }, 100);
  };

  const onInspirationChange = async (value: string) => {
    const inspirationValue: string = INSPIRATION_LIST_VALUE_MAP[value];
    setInspirationValue(inspirationValue);
    setPrompt(inspirationValue);
    if (excalidrawAPI) {
      const width_query_size = window.innerWidth;
      const imageElem = Object.assign({}, EXCALIDRAW_IMAGE_TEMPLAGE, {
        fileId: inspirationValue,
      });
      if (width_query_size < 768) {
        imageElem.width = width_query_size;
        imageElem.height = width_query_size;
      }
      const sceneData = {
        elements: [imageElem],
      };
      excalidrawAPI.updateScene(sceneData);
      setTimeout(() => {
        drawImage({ prompt: inspirationValue });
      }, 1000);
    }
  };

  const drawImage = (drawParams: PainerRequestParams) => {
    try {
      if (excalidrawRef.current) {
        setStartApiDraw(true);
        let canvasElement: any = excalidrawRef.current.querySelector('canvas');
        if (canvasElement) {
          try {
            let currentImgSize =
              drawParams?.imageSize?.width || imageSize.width;
            if (currentImgSize !== 512 && currentImgSize !== 768) {
              currentImgSize = canvasElement.width * 2; // 放大分辨率
              const scale = currentImgSize / DEFAULT_IMAGE_WIDTH;
              const originalCtx = canvasElement.getContext('2d');
              const imageData = originalCtx.getImageData(
                0,
                0,
                canvasElement.width,
                canvasElement.height
              );
              const newCanvas = document.createElement('canvas');
              const newCtx: any = newCanvas.getContext('2d');
              newCanvas.width = currentImgSize;
              newCanvas.height = currentImgSize;
              const newData = new Uint8ClampedArray(
                currentImgSize * currentImgSize * 4
              );
              const newImageData = new ImageData(
                newData,
                currentImgSize,
                currentImgSize
              );
              // 使用双线性插值填充新图像
              for (let y = 0; y < currentImgSize; y++) {
                for (let x = 0; x < currentImgSize; x++) {
                  const [r, g, b, a] = bilinearInterpolate(
                    Math.floor(x / 2),
                    Math.floor(y / 2),
                    imageData
                  );
                  const index = (y * currentImgSize + x) * 4;
                  newData[index] = r;
                  newData[index + 1] = g;
                  newData[index + 2] = b;
                  newData[index + 3] = a;
                }
              }
              newCtx.putImageData(newImageData, 0, 0);
              canvasElement = newCanvas;
            }
          } catch (e) {
            console.log(e);
          }
          const imageData = canvasElement.toDataURL();
          const customizedImageData = imageData.replace(imgPrefix, '');
          const handleImageFetch = (index: number) => {
            if (index === 0) setLoading1(true);
            if (index === 1) setLoading2(true);
            if (index === 2) setLoading3(true);
            if (index === 3) setLoading4(true);
            let drawRequestData = Object.assign(
              {},
              {
                image: customizedImageData,
                prompt,
                style,
                seed: SEED_LIST[index],
                imageSize,
              },
              drawParams
            );
            imgeToImage(drawRequestData, comfyUiMetaData, `queue_${index}`)
              .then((resp) => {
                let image = '';
                try {
                  image = imgPrefix + resp['9'].results[0];
                  previewImages.push(image);
                  if (index === 0) setImg1(image);
                  if (index === 1) setImg2(image);
                  if (index === 2) setImg3(image);
                  if (index === 3) setImg4(image);
                  setPreviewImages(previewImages);
                } catch (error: any) {
                  console.error('Error fetching image:', error);
                } finally {
                  setStartApiDraw(false);
                  if (index === 0) setLoading1(false);
                  if (index === 1) setLoading2(false);
                  if (index === 2) setLoading3(false);
                  if (index === 3) setLoading4(false);
                }
              })
              .catch((error: any) => {
                console.log(error);
                if (!axios.isCancel(error) && error.response === undefined) {
                  setStartApiDraw(false);
                }
              });
          };

          for (let i = 0; i < 4; i++) {
            handleImageFetch(i);
          }
        }
      }
    } catch (e) {
      console.log(e);
      setStartApiDraw(false); // 重置绘制
    }
  };

  useEffect(() => {
    if (!excalidrawAPI) {
      return;
    }
    (async () => {
      onInspirationChange(DEFAULT_INSPIRATION_PICTURE); // 小熊熊的图
    })();
  }, [excalidrawAPI]);

  const styleList = getValueFromMetaData(comfyUiMetaData, 'styleList');
  const inspirationList = getValueFromMetaData(
    comfyUiMetaData,
    'inspirationList'
  );
  const INSPIRATION_LIST_VALUE_MAP = inspirationList.reduce(
    (preItem: any, nextItem: any) => {
      preItem[nextItem.value] = nextItem.label;
      return preItem;
    },
    {}
  );

  return (
    <div
      style={{
        width: '100%',
        fontSize: '16px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
      className='cap-yunqi'
    >
      <div className={styles['draw-header']}>
        <Header />
      </div>
      <div className={styles['draw-main-body']}>
        <div direction='vertical' className={styles['draw-container']}>
          <div className={styles['topbar-params-container']}>
            <Styles onChange={onStyleChange} value={style} items={styleList} />

            <Prompt
              className={styles['prompt-input']}
              placeholder='请输入提示词，例如：a cat'
              value={prompt}
              style={{ width: 152 }}
              onChange={(e: any) => {
                const _prompt = e.target.value;
                setPrompt(_prompt);
                debouncePromptChange.call(this, drawImage, _prompt);
              }}
            />
            <Ratio
              value={imageSize?.width + '*' + imageSize?.height}
              onChange={(value: string) => {
                if (value) {
                  try {
                    const [imageWidth, imageHeight] = value.split('*');
                    const imageSize = {
                      width: parseInt(imageWidth),
                      height: parseInt(imageHeight),
                    };

                    setImageSize(imageSize);
                    setTimeout(() => {
                      drawImage({
                        imageSize,
                      });
                    }, 100);
                  } catch (e) {}
                }
              }}
            />
          </div>
          <div
            ref={excalidrawRef}
            className={styles['excalidraw-container']}
            onWheelCapture={(e) => {
              // Stop Excalidraw from hijacking scroll
              e.stopPropagation();
            }}
          >
            <Excalidraw
              UIOptions={{ dockedSidebarBreakpoint: 0 }}
              initialData={excalidrawInitData}
              excalidrawAPI={(api: any) => {
                setExcalidrawAPI(api);
              }}
              onPointerDown={() => {
                isPointerDown = true;
              }}
              onChange={(elements: ExcalidrawElement[], appState: AppState) => {
                if (elements.length > 0) {
                  debounceDrawFunction.call(this, () => {
                    if (isPointerDown && !startApiDraw) {
                      isPointerDown = false;
                      drawImage({});
                    }
                  });
                }
              }}
            >
              <Button className={styles['clean-canvas']} onClick={resetCanvas}>
                清空
              </Button>
              <div style={{ display: 'none' }}>
                <MainMenu.DefaultItems.ClearCanvas />
              </div>
            </Excalidraw>
          </div>
          <Inspiration items={inspirationList} onChange={onInspirationChange} />
        </div>
        <div className={styles['img-preview-container']}>
          {previewImages.length === 0 && !startApiDraw ? (
            <div className='img-preview-placeholder'>
              <p className={styles['img-preview-placeholder-word']}>
                请从左侧开始涂鸦
              </p>
            </div>
          ) : (
            <>
              <div className={styles['img-preview-row']}>
                <div
                  className={
                    loading2
                      ? styles['drawing-breathing']
                      : styles['drawing-preview']
                  }
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {loading1 ? (
                    <Spin size='large' />
                  ) : (
                    <Image src={img1} fallback={fallbackImg} />
                  )}
                </div>
                <div
                  className={
                    loading2
                      ? styles['drawing-breathing']
                      : styles['drawing-preview']
                  }
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {loading2 ? (
                    <Spin size='large' />
                  ) : (
                    <Image src={img2} fallback={fallbackImg} />
                  )}
                </div>
              </div>
              <div className={styles['img-preview-row']}>
                <div
                  className={
                    loading3
                      ? styles['drawing-breathing']
                      : styles['drawing-preview']
                  }
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {loading3 ? (
                    <Spin size='large' />
                  ) : (
                    <Image src={img3} fallback={fallbackImg} />
                  )}
                </div>
                <div
                  className={
                    loading4
                      ? styles['drawing-breathing']
                      : styles['drawing-preview']
                  }
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {loading4 ? (
                    <Spin size='large' />
                  ) : (
                    <Image src={img4} fallback={fallbackImg} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
