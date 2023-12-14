import qs from 'qs';
import { isEmpty } from '../base';

enum RequestMethod {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
}

interface RequestOption extends RequestInit {
  timeout?: number;
}

class HttpRequest {
  constructor() {}

  request(url: string, data?: any, method?: RequestMethod, option?: RequestOption) {
    const controller = new AbortController();

    const { headers, timeout = 2000, ...restOption } = option || {};
    const methodName = method || RequestMethod.GET;
    const defaultOption: RequestInit = {
      method: methodName,
      mode: 'cors',
      headers: {
        'content-type': 'application/json',
        ...headers,
      },
      credentials: 'include',
    };
    if ([RequestMethod.GET, RequestMethod.HEAD].includes(methodName)) {
      if (!isEmpty(data)) {
        url += `${url.includes('?') ? '&' : '?'}${qs.stringify(data)}`;
      }
    } else {
      defaultOption.body = data || {};
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
        .then(
          (res) => res.json(),
          (err) => {
            resolve({
              error: err,
            });
            clearTimer();
          },
        )
        .then((res) => {
          resolve({
            data: res,
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
