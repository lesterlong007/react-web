import apiConfig from '@/store/account-api/config.json';
import { toWebPage } from '@common/hooks/navigation';
import HttpRequest from './http';

const { refreshToken } = apiConfig;

const httpInstance = new HttpRequest({
  needToast: true
});

type ShortcutFC = typeof httpInstance.get;

let tokenPromise: Promise<any> = Promise.resolve();

httpInstance.addReqInterceptor((option, ...rest: [any]) => {
  if (httpInstance.isRefreshingToken && !rest[0]?.includes(refreshToken)) {
    return tokenPromise.then(() => {
      return httpInstance.request(...rest);
    });
  }
  option.headers = {
    ...(option.headers || {})
  };
  return option;
});

httpInstance.addPreResInterceptor(async (res, ...rest) => {
  const resText = await res.clone().text();
  if (res.status === 401 && resText === 'Unauthorized' && !res.url.includes(refreshToken)) {
    if (httpInstance.isRefreshingToken) {
      return tokenPromise.then(() => {
        return httpInstance.request(...(rest as [any]));
      });
    } else if (rest[3]?.autoRedirect) {
      httpInstance.isRefreshingToken = true;
      tokenPromise = httpInstance.post(refreshToken, {});
      return tokenPromise.then(
        (tokenRes) => {
          httpInstance.isRefreshingToken = false;
          console.log(tokenRes, 'token--');
          return httpInstance.request(...(rest as [any]));
        },
        () => {
          httpInstance.isRefreshingToken = false;
          toWebPage('/welcome');
        }
      );
    }
  }
  return res;
});

// @ts-ignore eslint-disable-next-line
httpInstance.addResInterceptor((res, option) => {
  const { successCodes = [] } = option || {};
  const code = res.status?.code ?? res.code;
  if ([...successCodes, 'PRU_200', 'POLICY_200_0000', 0, '0'].includes(code)) {
    return res;
  } else {
    throw res.status || res.message;
  }
});

httpInstance.addResErrorInterceptor((err) => {
  return err;
});

export const request: typeof httpInstance.request = (...args) => {
  return new Promise((resolve) => {
    httpInstance.request
      .bind(httpInstance)(...args)
      .then(
        (res) => {
          resolve({ data: res });
        },
        (err) => {
          resolve({ error: err });
        }
      );
  });
};

export const get: ShortcutFC = (...args) => {
  return new Promise((resolve) => {
    httpInstance.get
      .bind(httpInstance)(...args)
      .then(
        (res) => {
          resolve({ data: res });
        },
        (err) => {
          resolve({ error: err });
        }
      );
  });
};

export const post: ShortcutFC = (...args) => {
  return new Promise((resolve) => {
    httpInstance.post
      .bind(httpInstance)(...args)
      .then(
        (res) => {
          resolve({ data: res });
        },
        (err) => {
          resolve({ error: err });
        }
      );
  });
};

export const put: ShortcutFC = (...args) => {
  return new Promise((resolve) => {
    httpInstance.put
      .bind(httpInstance)(...args)
      .then(
        (res) => {
          resolve({ data: res });
        },
        (err) => {
          resolve({ error: err });
        }
      );
  });
};
