export async function imageUrlToBase64(imageUrl: string) {
    try {
        // 使用 fetch API 从 URL 下载图片
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`图片请求失败: ${response.status}`);
        }

        // 将 Response 对象转化为 Blob
        const blob = await response.blob();

        // 创建一个 FileReader 用于读取 Blob 数据
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            // 当读取完成时，将 Blob 转换为 base64 编码的字符串
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('转换图片为Base64时发生错误:', error);
        throw error;
    }
}

export async function transformFilesDataFromUrlToBase64(initData: any) {
    const filesObj = initData.files;
    const fileKeys = Object.keys(initData.files);

    const newFilesObj: any = {};
    for (let key of fileKeys) {
        let item = filesObj[key];
        if(item) {
            item.dataURL = await imageUrlToBase64(item.dataURL)
            newFilesObj[key] = item;
        }
        
    }

    initData.files = newFilesObj;
    return initData;

}


export function getValueFromMetaData(metadata: any, key: string) {
    let data = []
    try {
        if (key === 'styleList') {
            data = metadata['params'][1]['options'] || [];
        }
        if(key === 'inspirationList') {
            data = metadata['inspirations'] || [];
        }
        if(key === 'payload') {
            data = metadata['payload'] || {};
        }
        if(key === 'inspiration_prompt_map') {
            data = metadata['inspiration_prompt_map'] || {};
        }
    } catch (e) {

    }

    return data;
}

/**
 * @description 通用防抖函数
 * @param func 要执行的函数
 * @param wait 延迟时间（毫秒）
 * @param immediate 是否立即执行，默认为 false
 * @returns 返回防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate: boolean = false
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
    return function (...args: Parameters<T>): void {
      const context:any = this;
      const later = function () {
        timeoutId = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
  
      const callNow = immediate && !timeoutId;
      clearTimeout(timeoutId!);
      timeoutId = setTimeout(later, wait);
  
      if (callNow) {
        func.apply(context, args);
      }
    };
  }