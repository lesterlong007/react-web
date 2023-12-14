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

class HttpRequest {
  private interceptors: CommonFC[] = [];
  private errorInterceptors: CommonFC[] = [];
  private commonConfig: CommonConfig = {
    timeout: 60000,
    showError: true,
  };

  constructor(config: CommonConfig) {
    this.commonConfig = {
      ...this.commonConfig,
      ...config,
    };
  }

  addInterceptor(fn: CommonFC) {
    if (typeof fn === 'function') {
      this.interceptors.push(fn);
    }
  }

  addErrorInterceptor(fn: CommonFC) {
    if (typeof fn === 'function') {
      this.errorInterceptors.push(fn);
    }
  }

  request(url: string, data?: any, method?: MethodType, option?: RequestOption) {
    const controller = new AbortController();
    const {
      headers,
      timeout = this.commonConfig.timeout,
      showError = this.commonConfig.showError,
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
          this.interceptors.forEach((fn) => {
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
          this.errorInterceptors.forEach((fn) => {
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

  get(url: string, data?: any, option?: RequestOption) {
    return this.request(url, data, RequestMethod.GET, option);
  }

  post(url: string, data?: any, option?: RequestOption) {
    return this.request(url, data, RequestMethod.POST, option);
  }

  put(url: string, data?: any, option?: RequestOption) {
    return this.request(url, data, RequestMethod.PUT, option);
  }
}

export default HttpRequest;
