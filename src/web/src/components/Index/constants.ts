
export const DEFAULT_STYLE = 'Chinese style comics';
export const DEFAULT_PROMPT = '熊';
export const DEFAULT_INSPIRATION_VALUE = '熊';
export const DEFAULT_INSPIRATION_PICTURE = 'https://img.alicdn.com/imgextra/i1/O1CN01qPoB0s1RPDulmVoc3_!!6000000002103-0-tps-1024-1024.jpg';
export const DEFAULT_IMAGE_WIDTH = 512;
export const DEFAULT_IMAGE_HEIGHT = 512;
export const RATIO_OPTOPNS = [{
    label: '512 * 512',
    value: '512 * 512'
}, {
    label: '768 * 768',
    value: '768 * 768'
}, {
    label: '1024 * 1024',
    value: '1024 * 1024'
}]


export const EXCALIDRAW_IMAGE_TEMPLAGE = {
    type: 'image',
    fileId: 'inspirationValue',
    status: 'saved',
    isDeleted: false,
    fillStyle: "hachure",
    strokeWidth: 1,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    angle: 0,
    x: 0,
    y: 0,
    strokeColor: "#c92a2a",
    backgroundColor: "transparent",
    width: DEFAULT_IMAGE_WIDTH ,
    height: DEFAULT_IMAGE_HEIGHT,
    seed: 1968410350,
    groupIds: [],
    boundElements: null,
    locked: true,
    link: null,
    updated: 1,
    text: {
        color: '#ff0000'
    },
    roundness: {
        type: 3,
        value: 32,
    },
}
export const EXCALIDRAW_INIT_DATA = {
    type: 'excalidraw',
    version: 2,
    elements: [
    ],
    appState: {
        viewBackgroundColor: '#ffffff',
        currentItemStrokeColor: '#000000',
        activeTool: {
            lastActiveTool: {
                type: 'freedraw',
                customType: null,
            },
            type: 'freedraw',
            customType: null,
        },
    },
    scrollToContent: false,
    files: {
        猫: {
            mimeType: 'image/jpg',
            id: '猫',
            dataURL:
                'https://img.alicdn.com/imgextra/i3/O1CN01WkQ1s11UpjgmHp2ZU_!!6000000002567-0-tps-1024-1024.jpg',
        },
        兔子: {
            mimeType: 'image/jpg',
            id: '兔子',
            dataURL:
                'https://img.alicdn.com/imgextra/i4/O1CN01iuddVc1PmvAvfTOn1_!!6000000001884-0-tps-1024-1024.jpg',
        },
        小熊: {
            mimeType: 'image/jpg',
            id: '小熊',
            dataURL:
                'https://img.alicdn.com/imgextra/i1/O1CN01qPoB0s1RPDulmVoc3_!!6000000002103-0-tps-1024-1024.jpg',
        },
        向日葵: {
            mimeType: 'image/jpg',
            id: '向日葵',
            dataURL: 'https://img.alicdn.com/imgextra/i1/O1CN01kKgoRV1zgLf5LQf80_!!6000000006743-0-tps-1024-1024.jpg'
        },
        风景画1: {
            mimeType: 'image/jpg',
            id: '风景画1',
            dataURL:
                'https://img.alicdn.com/imgextra/i2/O1CN01DhgYDg1x9FoDRGGT5_!!6000000006400-0-tps-1024-1024.jpg',
        },
        风景画2: {
            mimeType: 'image/jpg',
            id: '风景画2',
            dataURL:
                'https://img.alicdn.com/imgextra/i4/O1CN011TM7fe29MmtzwLOKn_!!6000000008054-0-tps-1024-1024.jpg',
        },
    },
};
export const DEFAULT_ENDPOINT_HASH = 'c410d179b056797269a4a2188bdf8a48'; // 用来方便在混淆后替换环境变量的值


export const SEED_LIST = [
    648227800398822, 648227800398823, 648227800398824, 648227800398826,
];

export const COMFY_UI_META_DATA = {
    payload: {
        '3': {
            inputs: {
                seed: '<seed>',
                steps: 5,
                cfg: 1.5,
                sampler_name: 'euler_ancestral',
                scheduler: 'ddim_uniform',
                denoise: 1,
                model: ['4', 0],
                positive: ['10', 0],
                negative: ['7', 0],
                latent_image: ['5', 0],
            },
            class_type: 'KSampler',
            _meta: {
                title: 'KSampler',
            },
        },
        '4': {
            inputs: {
                ckpt_name: 'sd_xl_turbo_1.0_fp16.safetensors',
            },
            class_type: 'CheckpointLoaderSimple',
            _meta: {
                title: 'Load Checkpoint',
            },
        },
        '5': {
            inputs: {
                width: '<width>',
                height: '<height>',
                batch_size: 1,
            },
            class_type: 'EmptyLatentImage',
            _meta: {
                title: 'Empty Latent Image',
            },
        },
        '6': {
            inputs: {
                text: ['30', 0],
                speak_and_recognation: true,
                clip: ['4', 1],
            },
            class_type: 'CLIPTextEncode',
            _meta: {
                title: 'CLIP Text Encode (Prompt)',
            },
        },
        '7': {
            inputs: {
                text: 'bad quality',
                speak_and_recognation: true,
                clip: ['4', 1],
            },
            class_type: 'CLIPTextEncode',
        },
        '8': {
            inputs: {
                samples: ['3', 0],
                vae: ['4', 2],
            },
            class_type: 'VAEDecode',
            _meta: {
                title: 'VAE Decode',
            },
        },
        '9': {
            inputs: {
                filename_prefix: 'ComfyUI',
                images: ['8', 0],
            },
            class_type: 'SaveImage',
            _meta: {
                title: 'Save Image',
            },
        },
        '10': {
            inputs: {
                strength: 0.8,
                conditioning: ['6', 0],
                control_net: ['11', 0],
                image: ['13', 0],
            },
            class_type: 'ControlNetApply',
            _meta: {
                title: 'Apply ControlNet',
            },
        },
        '11': {
            inputs: {
                control_net_name:
                    'controlnet-canny-scribble-integrated-sdxl-v2-fp16.safetensors',
            },
            class_type: 'ControlNetLoader',
            _meta: {
                title: 'Load ControlNet Model',
            },
        },
        '13': {
            inputs: {
                resolution: 512,
                image: ['14', 0],
            },
            class_type: 'ScribblePreprocessor',
            _meta: {
                title: 'Scribble Lines',
            },
        },
        '14': {
            inputs: {
                image: '<image>',
                update_node: true,
                'Clear Canvas': 'clear_painer',
            },
            class_type: 'LoadImage',
        },
        '27': {
            inputs: {
                from_translate: 'chinese simplified',
                to_translate: 'english',
                add_proxies: false,
                proxies: '',
                auth_data: '',
                service: 'MyMemoryTranslator [free]',
                text: '小猫吃草 0',
                'Show proxy': 'proxy_hide',
                'Show authorization': 'authorization_hide',
                speak_and_recognation: true,
            },
            class_type: 'DeepTranslatorTextNode',
            _meta: {
                title: 'Deep Translator Text Node',
            },
        },
        '30': {
            inputs: {
                prompt1: ['27', 0],
                prompt2: ['32', 0],
                separator: ', ',
            },
            class_type: 'easy promptConcat',
            _meta: {
                title: 'PromptConcat',
            },
        },
        '32': {
            inputs: {
                value: '',
            },
            class_type: 'easy string',
            _meta: {
                title: 'String',
            },
        },
    },
    params: [
        {
            type: 'image',
            id: '14',
            key: 'image',
            title: '画布图片',
            description: '画布图片',
        },
        {
            type: 'string',
            id: '32',
            key: 'value',
            title: '风格',
            description: '风格',
            options: [
                {
                    value: 'watercolor, smudge',
                    label: '水彩',
                },
                {
                    value: 'cyberpunk',
                    label: '赛博朋克',
                },
                {
                    value: 'cartoon',
                    label: '二次元',
                },
                {
                    value: 'Chinese style comics',
                    label: '中国风漫画',
                },
                {
                    value: 'Oil painting, Monet',
                    label: '油画',
                },
                {
                    value: 'photography',
                    label: '摄影',
                },
                {
                    value: `children's picture books`,
                    label: '儿童绘本'
                }
            ],
        },
        {
            type: 'string',
            id: '27',
            key: 'text',
            title: '提示词',
            description: '提示词',
        },
        {
            type: 'number',
            id: '3',
            key: 'seed',
            title: 'seed',
            description: 'seed',
            options: [
                648227800398822, 648227800398823, 648227800398824, 648227800398826,
            ],
        },
        {
            type: 'imgWidth',
            id: '13',
            key: 'resolution',
            title: '图片宽/高',
            description: '图片宽和高',
            defaultValue: 512,
        },
        {
            type: 'imgWidth',
            id: '5',
            key: 'width',
            title: '图片宽',
            description: '图片宽',
            defaultValue: 512,
        },
        {
            type: 'imgHeight',
            id: '5',
            key: 'height',
            title: '图片高',
            description: '图片高',
            defaultValue: 512,
        },
    ],
    inspirations: [
        {
            value:
                'https://img.alicdn.com/imgextra/i3/O1CN01WkQ1s11UpjgmHp2ZU_!!6000000002567-0-tps-1024-1024.jpg',
            label: '猫',
        },
        {
            value:
                'https://img.alicdn.com/imgextra/i4/O1CN01iuddVc1PmvAvfTOn1_!!6000000001884-0-tps-1024-1024.jpg',
            label: '兔子',
        },
        {
            value:
                'https://img.alicdn.com/imgextra/i1/O1CN01qPoB0s1RPDulmVoc3_!!6000000002103-0-tps-1024-1024.jpg',
            label: '小熊',
        },
        {
            value:
                'https://img.alicdn.com/imgextra/i2/O1CN01DhgYDg1x9FoDRGGT5_!!6000000006400-0-tps-1024-1024.jpg',
            label: '风景画1',
        },
        {
            value:
                'https://img.alicdn.com/imgextra/i4/O1CN011TM7fe29MmtzwLOKn_!!6000000008054-0-tps-1024-1024.jpg',
            label: '风景画2',
        },
    ],
};
