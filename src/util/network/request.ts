import HttpRequest from './http';

const httpInstance = new HttpRequest({
  showError: false
});

type ShortcutFC = typeof httpInstance.get;

let tokenPromise: Promise<any> = Promise.resolve();

httpInstance.addReqInterceptor((option, ...rest: [any]) => {
  if (httpInstance.isRefreshingToken && !rest[0]?.includes('/api/token')) {
    return tokenPromise.then(() => {
      return httpInstance.request(...rest);
    });
  }
  option.headers = {
    ...(option.headers || {}),
    'customer-header': 'test-header'
  };
  return option;
});

httpInstance.addPreResInterceptor((res, ...rest: [any]) => {
  if (res.status === 401 && !res.url.includes('/api/token')) {
    if (httpInstance.isRefreshingToken) {
      return tokenPromise.then(() => {
        return httpInstance.request(...rest);
      });
    } else {
      httpInstance.isRefreshingToken = true;
      tokenPromise = httpInstance.request('/api/token', {}, 'POST');
      return tokenPromise.then((tokenRes) => {
        httpInstance.isRefreshingToken = false;
        console.log(tokenRes, 'token--');
        return httpInstance.request(...rest);
      });
    }
  }
  return res;
});

httpInstance.addResInterceptor((res) => {
  if (res.code === 0) {
    return res;
  } else {
    throw new Error(res.message);
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
