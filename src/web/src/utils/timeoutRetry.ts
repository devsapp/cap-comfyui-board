import axios from 'axios';
// import aborts from './abortObjs';

/**
 * 请求超时后重新发送请求(POST)
 */
const abortControllerQueueMap: any = {
  'queue_0': [],
  'queue_1': [],
  'queue_2': [],
  'queue_3': []
}

const ais = axios.create({ timeout: 180000 });

function abortRqeuest(queue: any) {
  try {
    const controller = queue.shift();
    if (controller && typeof controller.abort === 'function') {
      controller.abort();
    }
    const newController = new AbortController();
    queue.unshift(newController);
  } catch (e) {

  }
  return queue;
}
const retry = async (url: string, data: any, queueKey: string) => {
  // 重发请求的次数
  let retry: number = 0;
  // 创建AbortController放入aborts数组中，用于取消对应的请求
  let queue = abortControllerQueueMap[queueKey];
  queue = abortRqeuest(queue);

  // 定义响应拦截器
  ais.interceptors.response.use(
    resp => resp,
    error => {
      const originalRequest = error.config;

      // 如果请求已经发出并且没有被取消，并且是由于超时导致的错误
      if (!axios.isCancel(error) && error.response === undefined && originalRequest && originalRequest.url) {
        ++retry;
        // 重发次数小于3次，重新发送请求
        if (retry < 3) {
          console.log(`请求超时${retry}次，正在重试...`);
          // 取消之前的请求
          queue = abortRqeuest(queue);
          // 注册新的响应拦截器
          ais.interceptors.response.use(
            resp => resp,
            innerError => {
              // 如果是其他错误，则返回失败状态的Promise
              return Promise.reject(innerError);
            }
          );

          return ais.post(url, data, { signal: queue[0].signal });
        }
      }
      // 如果是其他错误，则返回失败状态的Promise
      return Promise.reject(error);
    }
  );

  // 发送请求
  try {
    const response = await ais.post(url, data, { signal: queue[0].signal });
    return response.data;
  } catch (e) {
    throw e;
  }
};

export default retry;