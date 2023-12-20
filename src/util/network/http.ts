import qs from 'qs';
import { isEmpty, getDataType } from '../base';

enum RequestMethod {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT'
}

type MethodType = `${RequestMethod}`;

interface RequestOption extends RequestInit {
  timeout?: number;
  showError?: boolean;
}

interface Response {
  data?: any;
  error?: any;
}

interface ErrorObj {
  status?: number;
  statusText?: string;
  message?: string;
}

type CommonFC = (...args: any[]) => any;

class HttpRequest {
  private commonConfig: RequestOption = {
    timeout: 60000,
    showError: true
  };

  private reqInterceptors: CommonFC[] = [];
  private resInterceptors: CommonFC[] = [];
  private preResInterceptors: CommonFC[] = [];
  private errorResInterceptors: CommonFC[] = [];
  public isRefreshingToken: boolean = false;

  constructor (config?: RequestOption) {
    this.commonConfig = {
      ...this.commonConfig,
      ...(config || {})
    };
  }

  public addReqInterceptor (fn: CommonFC) {
    if (typeof fn === 'function') {
      this.reqInterceptors.push(fn);
    }
  }

  public addPreResInterceptor (fn: CommonFC) {
    if (typeof fn === 'function') {
      this.preResInterceptors.push(fn);
    }
  }

  public addResInterceptor (fn: CommonFC) {
    if (typeof fn === 'function') {
      this.resInterceptors.push(fn);
    }
  }

  public addResErrorInterceptor (fn: CommonFC) {
    if (typeof fn === 'function') {
      this.errorResInterceptors.push(fn);
    }
  }

  /**
   * encapsulate request method base on fetch
   * @param url
   * @param data
   * @param method
   * @param option
   * @returns
   */
  public request (url: string, data?: any, method?: MethodType, option?: RequestOption): Promise<Response> {
    const controller = new AbortController();

    let newOption = {
      ...this.commonConfig,
      ...(option || {})
    };
    this.reqInterceptors.forEach((fn) => {
      newOption = fn(newOption, url, data, method, option);
    });

    if (newOption instanceof Promise) {
      return newOption;
    }

    const { timeout, showError, ...restOption } = newOption;

    const methodName = method || RequestMethod.GET;
    const defaultOption: RequestInit = {
      method: methodName,
      mode: 'cors',
      credentials: 'include'
    };
    restOption.headers = new Headers({
      'content-type': 'application/json; charset=utf-8',
      ...(restOption.headers || {})
    });

    if (([RequestMethod.GET, RequestMethod.HEAD] as MethodType[]).includes(methodName)) {
      if (!isEmpty(data)) {
        url += `${url.includes('?') ? '&' : '?'}${qs.stringify(data)}`;
      }
    } else {
      if (data !== undefined) {
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

    return new Promise((resolve, reject) => {
      let timer: NodeJS.Timeout | null = null;
      let error: ErrorObj = {};

      const clearTimer = () => {
        if (timer) clearTimeout(timer);
      };

      const handleErr = (err: any) => {
        reject(err);
        if (showError) console.log(err);
      };

      fetch(url, { ...defaultOption, ...restOption })
        .then((res) => {
          this.preResInterceptors.forEach((fn) => {
            res = fn(res, url, data, method, option);
          });
          return res;
        })
        .then((res) => {
          const { status, statusText } = res;
          if (status < 200 || status >= 400) {
            error = { status, statusText };
          }
          return typeof res.json === 'function' ? res.json() : res;
        })
        .then((res) => {
          this.resInterceptors.forEach((fn) => {
            res = fn(res);
          });
          return res;
        })
        .then((res) => {
          resolve(res);
          clearTimer();
        })
        .catch((err) => {
          const newErr: ErrorObj = {
            ...error,
            message: err?.message
          };
          this.errorResInterceptors.forEach((fn) => {
            err = fn(newErr);
          });
          handleErr(err);
          clearTimer();
        });

      timer = setTimeout(() => {
        handleErr(new Error('Failed to fetch, timeout'));
        controller.abort();
      }, timeout);
    });
  }

  public get (url: string, data?: any, option?: RequestOption) {
    return this.request(url, data, RequestMethod.GET, option);
  }

  public post (url: string, data?: any, option?: RequestOption) {
    return this.request(url, data, RequestMethod.POST, option);
  }

  public put (url: string, data?: any, option?: RequestOption) {
    return this.request(url, data, RequestMethod.PUT, option);
  }
}

export default HttpRequest;

Object.freeze(HttpRequest.prototype);
