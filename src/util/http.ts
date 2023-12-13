import qs from 'qs';

type MethodType = 'GET' | 'POST' | 'PUT';

export const request = (url: string, data?: any, method?: MethodType, option?: RequestInit) => {
  const { headers, ...restOption } = option || {};
  const defaultOption: RequestInit = {
    method: method || 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  };

  return fetch(url, {
    body: data || {},
    ...defaultOption,
    ...restOption,
  }).then((res) => res.json());
};

export const get = (url: string, data?: any, option?: RequestInit) => {
  return request(url, data, 'GET', option);
};

export const post = () => {};

export const put = () => {};
