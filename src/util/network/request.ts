import qs from 'qs';
import { isEmpty, getDataType } from '../base';

enum RequestMethod {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
}

type MethodType = `${RequestMethod}`;

interface CommonConfig {
  timeout?: number;
  showError?: boolean;
}

type RequestOption = CommonConfig & RequestInit;

type CommonFC = (...args: any[]) => any;

const interceptors: CommonFC[] = [];
const errorInterceptors: CommonFC[] = [];
let commonConfig: CommonConfig = {
  timeout: 60000,
  showError: true,
};

export const addCommonConfig = (config: CommonConfig) =>{
  commonConfig = {
    ...commonConfig,
    ...config,
  };
}

export const addInterceptor = (fn: CommonFC) => {
  if (typeof fn === 'function') {
    interceptors.push(fn);
  }
}

export const addErrorInterceptor = (fn: CommonFC) => {
  if (typeof fn === 'function') {
    errorInterceptors.push(fn);
  }
}

export const request = (url: string, data?: any, method?: MethodType, option?: RequestOption) => {
  const controller = new AbortController();
  const {
    headers,
    timeout = commonConfig.timeout,
    showError = commonConfig.showError,
    ...restOption
  } = option || {};
  const methodName = method || RequestMethod.GET;
  const defaultOption: RequestInit = {
    method: methodName,
    mode: 'cors',
    credentials: 'include',
  };
  const reqHeaders = new Headers({
    'content-type': 'application/json; charset=utf-8',
    ...headers,
  });
  defaultOption.headers = reqHeaders;
  if (([RequestMethod.GET, RequestMethod.HEAD] as MethodType[]).includes(methodName)) {
    if (!isEmpty(data)) {
      url += `${url.includes('?') ? '&' : '?'}${qs.stringify(data)}`;
    }
  } else {
    if (void 0 !== data) {
      const type = getDataType(data);
      if (type === 'object') {
        defaultOption.body = JSON.stringify(data);
      } else {
        defaultOption.body = data;
      }
    }
  }

  if (restOption.signal) {
    const signal = restOption.signal;
    signal.addEventListener('abort', () => {
      controller.abort();
    });
  }
  restOption.signal = controller.signal;

  return new Promise((resolve) => {
    let timer: NodeJS.Timeout;
    const clearTimer = () => {
      if (timer) clearTimeout(timer);
    };

    fetch(url, { ...defaultOption, ...restOption })
      .then((res) => {
        interceptors.forEach((fn) => {
          res = fn(res);
        });
        return res;
      })
      .then((res) => res.json())
      .then((res) => {
        resolve({
          data: res,
        });
        clearTimer();
      })
      .catch((err) => {
        errorInterceptors.forEach((fn) => {
          err = fn(err);
        });
        resolve({
          error: err,
        });
        clearTimer();
      });

    timer = setTimeout(() => {
      resolve({
        error: new Error('Failed to fetch, timeout'),
      });
      controller.abort();
    }, timeout);
  });
}

export const get = (url: string, data?: any, option?: RequestOption) => {
  return request(url, data, RequestMethod.GET, option);
}

export const post = (url: string, data?: any, option?: RequestOption) => {
  return request(url, data, RequestMethod.POST, option);
}

export const put = (url: string, data?: any, option?: RequestOption) => {
  return request(url, data, RequestMethod.PUT, option);
}