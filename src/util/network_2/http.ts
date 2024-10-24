import qs from 'qs';
import { openPathInOldPru } from '@common/hooks/navigation';
import i18n from '@/util/i18n';
import { getLBU, getLocation } from '@/util/env';
import { isEmpty, getDataType } from '../util/base';
import { PolicyCode } from '../constants/policy';

enum RequestMethod {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT'
}

type MethodType = `${RequestMethod}`;

interface RequestOption extends RequestInit {
  needToast?: boolean;
  successCodes?: (string | undefined)[];
  timeout?: number;
  contentType?: string;
  autoRedirect?: boolean;
  loadingKey?: string;
}

interface Response {
  data?: any;
  error?: any;
}

interface ErrorObj {
  status?: number;
  statusText?: string;
  message?: string;
  code?: string;
}

type CommonFC = (...args: any[]) => any;

class HttpRequest {
  private commonConfig: RequestOption = {
    timeout: 60000,
    needToast: true
  };

  private reqInterceptors: CommonFC[] = [];
  private resInterceptors: CommonFC[] = [];
  private preResInterceptors: CommonFC[] = [];
  private errorResInterceptors: CommonFC[] = [];
  public isRefreshingToken: boolean = false;

  constructor(config?: RequestOption) {
    this.commonConfig = {
      ...this.commonConfig,
      ...(config || {})
    };
  }

  public addReqInterceptor(fn: CommonFC) {
    if (typeof fn === 'function') {
      this.reqInterceptors.push(fn);
    }
  }

  public addPreResInterceptor(fn: CommonFC) {
    if (typeof fn === 'function') {
      this.preResInterceptors.push(fn);
    }
  }

  public addResInterceptor(fn: CommonFC) {
    if (typeof fn === 'function') {
      this.resInterceptors.push(fn);
    }
  }

  public addResErrorInterceptor(fn: CommonFC) {
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
  public request(
    url: string,
    data?: any,
    method?: MethodType,
    option?: RequestOption
  ): Promise<Response> {
    data = data ?? {};
    const controller = new AbortController();
    const apiHost = process.env.API_HOST || '';
    const isFull = /^https?:\/\//.test(url) || url.startsWith(apiHost);
    let newOption = {
      ...this.commonConfig,
      ...(option || {})
    };
    url = isFull ? url : apiHost + url;

    this.reqInterceptors.forEach((fn) => {
      newOption = fn(newOption, url, data, method, option);
    });
    if (newOption instanceof Promise) {
      return newOption;
    }
    const { timeout, needToast, ...restOption } = newOption;
    const contentType = restOption.contentType || 'application/json; charset=utf-8';

    const methodName = method || RequestMethod.GET;
    const defaultOption: RequestInit = {
      method: methodName,
      mode: 'cors',
      credentials: 'include'
    };
    // TODO use real value
    const apimKey = url.includes('/services/pulse/')
      ? (process.env.CORE_APIM_SUBSCRIPTION_KEY as string)
      : (process.env.APIM_SUBSCRIPTION_KEY as string);

    restOption.headers = new Headers({
      'content-type': contentType,
      'PRU-TENANT': getLocation(),
      'Ocp-Apim-Subscription-Key': apimKey,
      'accept-language': `${i18n.language}-${getLocation()}`,
      'pru-client': 'web',
      'pru-lbu': getLBU(),
      ...(restOption.headers || {})
    });

    if (([RequestMethod.GET, RequestMethod.HEAD] as MethodType[]).includes(methodName)) {
      if (!isEmpty(data)) {
        url += `${url.includes('?') ? '&' : '?'}${qs.stringify(data)}`;
      }
    } else {
      const type = getDataType(data);
      if (type === 'object') {
        defaultOption.body = JSON.stringify(data);
      } else {
        defaultOption.body = data;
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
        if (needToast) console.log(err);
      };

      fetch(url, { ...defaultOption, ...restOption })
        .then(async (res) => {
          for (let i = 0; i < this.preResInterceptors.length; i++) {
            const fn = this.preResInterceptors[i];
            res = await fn(res, url, data, method, {
              ...option,
              autoRedirect: option?.autoRedirect ?? true
            });
          }
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
            res = fn(res, option);
          });
          return res;
        })
        .then((res) => {
          resolve(res);
          clearTimer();
        })
        .catch((err = {}) => {
          console.log('err', err);
          const errCode = err.data?.status?.code || err.code || err.status;
          const errMsg = err.data?.status?.message || err.message;
          const newErr: ErrorObj = {
            ...error,
            code: errCode,
            message: errMsg
          };
          this.errorResInterceptors.forEach((fn) => {
            err = fn(newErr);
          });
          if (errCode === PolicyCode.NOT_LINKED || errCode === PolicyCode.PRU_NOT_IDENTIFIED) {
            openPathInOldPru('');
          }
          handleErr(err);
          clearTimer();
        });

      timer = setTimeout(() => {
        handleErr(new Error('Failed to fetch, timeout'));
        controller.abort();
      }, timeout);
    });
  }

  public get(url: string, data?: any, option?: RequestOption) {
    return this.request(url, data, RequestMethod.GET, option);
  }

  public post(url: string, data?: any, option?: RequestOption) {
    return this.request(url, data, RequestMethod.POST, option);
  }

  public put(url: string, data?: any, option?: RequestOption) {
    return this.request(url, data, RequestMethod.PUT, option);
  }
}

export default HttpRequest;

Object.freeze(HttpRequest.prototype);
