import HttpRequest from './http';

const httpInstance = new HttpRequest({
  showError: false
});

httpInstance.addReqInterceptor((option) => {
  option.headers = {
    ...(option.headers || {}),
    'customer-header': 'test-header'
  };
  return option;
});

httpInstance.addResInterceptor((res) => {
  if (res.code === 0) {
    return res;
  } else {
    throw new Error(res.message);
  }
});

export const request = httpInstance.request.bind(httpInstance);

export const get = httpInstance.get.bind(httpInstance);

export const post = httpInstance.post.bind(httpInstance);

export const put = httpInstance.put.bind(httpInstance);
