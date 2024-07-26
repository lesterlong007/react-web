import {
  parseSearch,
  getQueryParam,
  getCookie,
  getRandomStr,
  getDataType,
  isEmpty,
  deepClone,
  isObjEqual,
  transferObjectToMap,
  transferMapToObject,
  sleep,
  debounce,
  throttle,
  getUUID
} from '../base';

describe('Your Module', () => {
  describe('parseSearch', () => {
    it('should parse search parameters to object', () => {
      const searchStr = '?foo=bar&baz=qux';
      const params = parseSearch(searchStr);
      expect(params).toEqual({ foo: 'bar', baz: 'qux' });
    });

    it('should return an empty object when searchStr is not provided', () => {
      const params = parseSearch();
      expect(params).toEqual({});
    });
  });

  describe('getQueryParam', () => {
    it('should get query parameters from window.location', () => {
      // Mock window.location
      delete window.location;
      window.location = {
        search: '?foo=bar&baz=qux',
        hash: ''
      };

      const param = getQueryParam();
      expect(param).toEqual({ foo: 'bar', baz: 'qux' });
    });

    it('should return the value of a specific key', () => {
      // Mock window.location
      delete window.location;
      window.location = {
        search: '',
        hash: '?foo=bar&baz=qux'
      };

      const param = getQueryParam('foo');
      expect(param).toBe('bar');
    });

    it('should return null when the key is not found', () => {
      // Mock window.location
      delete window.location;
      window.location = {
        search: '?foo=bar&baz=qux',
        hash: ''
      };

      const param = getQueryParam('nonexistent');
      expect(param).toBeNull();
    });
  });

  describe('getCookie', () => {
    it('should get the cookie value for a specific key', () => {
      // Mock document.cookie
      Object.defineProperty(document, 'cookie', {
        value: 'key1=value1; key2=value2',
        writable: true
      });

      const value = getCookie('key1');
      expect(value).toBe('value1');
    });

    it('should return an empty string when document.cookie is empty', () => {
      // Mock document.cookie
      Object.defineProperty(document, 'cookie', {
        value: '',
        writable: true
      });

      const value = getCookie('key');
      expect(value).toBe('');
    });

    it('should return an empty string when get an inexistent key', () => {
      Object.defineProperty(document, 'cookie', {
        value: 'key1=value1',
        writable: true
      });
      const value = getCookie('key');
      expect(value).toBe('');
    });
  });

  describe('getRandomStr', () => {
    it('should generate a random string with a prefix', () => {
      const prefix = 'test_';
      const randomStr = getRandomStr(prefix);
      expect(randomStr.startsWith(prefix)).toBe(true);
      expect(typeof randomStr).toBe('string');
    });

    it('should generate a random string without a prefix', () => {
      const randomStr = getRandomStr();
      expect(randomStr).not.toEqual('');
      expect(typeof randomStr).toBe('string');
    });
  });

  describe('getDataType', () => {
    it('should return the correct data type', () => {
      expect(getDataType('')).toBe('string');
      expect(getDataType(123)).toBe('number');
      expect(getDataType(true)).toBe('boolean');
      expect(getDataType({})).toBe('object');
      expect(getDataType([])).toBe('array');
      expect(getDataType(null)).toBe('null');
      expect(getDataType(undefined)).toBe('undefined');
      expect(getDataType(new Date())).toBe('date');
      expect(getDataType(/regex/)).toBe('regexp');
      expect(getDataType(() => {})).toBe('function');
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty values', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty(0)).toBe(true);
      expect(isEmpty(false)).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(isEmpty('abc')).toBe(false);
      expect(isEmpty(123)).toBe(false);
      expect(isEmpty(true)).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty({ foo: 'bar' })).toBe(false);
    });
  });

  describe('deepClone', () => {
    it('should create a deep clone of an object', () => {
      const obj = { foo: 'bar', baz: { qux: 'quux' } };
      const clone = deepClone(obj);
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
      expect(clone.baz).not.toBe(obj.baz);
    });

    test('should handle circular references', () => {
      const obj = { name: 'John' };
      obj.self = obj;
      const clonedObj = deepClone(obj);
      expect(clonedObj).toEqual(obj);
      expect(clonedObj).not.toBe(obj);
      expect(clonedObj.self).toBe(clonedObj);
    });

    test('should handle none value', () => {
      expect(deepClone()).toBeUndefined();
      expect(deepClone(null)).toBeNull();
    });

    test('should handle cloning of built-in types', () => {
      const date = new Date();
      const regex = /test/g;
      const func = () => 42;
      const clonedDate = deepClone(date);
      const clonedRegex = deepClone(regex);
      const clonedFunc = deepClone(func);
  
      expect(clonedDate).toEqual(date);
      expect(clonedDate).not.toBe(date);
  
      expect(clonedRegex).toEqual(regex);
      expect(clonedRegex).not.toBe(regex);
  
      expect(typeof clonedFunc).toBe('function');
      expect(clonedFunc).not.toBe(func);
    });
  });

  describe('isObjEqual', () => {
    it('should return true for equal objects', () => {
      const obj1 = { foo: 'bar', baz: { qux: 'quux' } };
      const obj2 = { foo: 'bar', baz: { qux: 'quux' } };
      expect(isObjEqual(obj1, obj2)).toBe(true);
    });

    it('should return false for unequal objects', () => {
      const obj1 = { foo: 'bar', baz: { qux: 'quux' } };
      const obj2 = { foo: 'bar', baz: { qux: 'quuz' } };
      expect(isObjEqual(obj1, obj2)).toBe(false);
    });

    it('should return false for different data type', () => {
      const obj1 = 1;
      const obj2 = '1';
      expect(isObjEqual(obj1, obj2)).toBe(false);
    });

    it('should return false for different length of arrays', () => {
      const obj1 = [];
      const obj2 = [1];
      expect(isObjEqual(obj1, obj2)).toBe(false);
    });

    it('should return false for different quantity of keys for object', () => {
      const obj1 = { a: '1' };
      const obj2 = { a: '1', b: 2 };
      expect(isObjEqual(obj1, obj2)).toBe(false);
    });

    it('should return false for different keys for object', () => {
      const obj1 = { a: '1' };
      const obj2 = { b: 2 };
      expect(isObjEqual(obj1, obj2)).toBe(false);
    });

    it('should handle circular references', () => {
      const obj1 = { a: '1', b: 2 };
      obj1.self = obj1;
      const obj2 = { a: '1', b: 2 };
      obj2.self = obj2;
      expect(isObjEqual(obj1, obj2)).toBe(true);
    });
  });

  describe('transferObjectToMap', () => {
    it('should transfer an object to a Map', () => {
      const obj = { foo: 'bar', baz: 'qux' };
      const map = transferObjectToMap(obj);
      expect(map instanceof Map).toBe(true);
      expect([...map.entries()]).toEqual([
        ['foo', 'bar'],
        ['baz', 'qux']
      ]);
    });

    it('should return original value for non-object', () => {
      const obj = [];
      const res = transferObjectToMap(obj);
      expect(res).toBe(obj);
    });
  });

  describe('transferMapToObject', () => {
    it('should transfer a Map to an object', () => {
      const map = new Map([
        ['foo', 'bar'],
        ['baz', 'qux']
      ]);
      const obj = transferMapToObject(map);
      expect(obj).toEqual({ foo: 'bar', baz: 'qux' });
    });

    it('should return original value for non-map', () => {
      const obj = [];
      const res = transferMapToObject(obj);
      expect(res).toBe(obj);
    });
  });

  describe('sleep', () => {
    it('should sleep for the specified amount of time', async () => {
      const start = Date.now();
      await sleep(1000);
      const end = Date.now();
      const duration = end - start;
      expect(duration).toBeGreaterThanOrEqual(1000);
    });
  });

  describe('debounce', () => {
    it('should debounce a function', async () => {
      jest.useFakeTimers();

      const callback = jest.fn();
      const debouncedFn = debounce(callback, 1000);

      // Call the debounced function multiple times within the debounce interval
      debouncedFn();
      debouncedFn();
      debouncedFn();

      // Fast-forward time
      jest.advanceTimersByTime(500);

      // Call the debounced function again
      debouncedFn();

      // Fast-forward time
      jest.advanceTimersByTime(1000);

      // The callback should be called only once after the debounce interval
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('should throttle a function', async () => {
      jest.useFakeTimers();

      const callback = jest.fn();
      const throttledFn = throttle(callback, 1000);

      // Call the throttled function multiple times within the throttle interval
      throttledFn();
      throttledFn();
      throttledFn();

      // Fast-forward time
      jest.advanceTimersByTime(500);

      // Call the throttled function again
      throttledFn();

      // Fast-forward time
      jest.advanceTimersByTime(1000);

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUUID', () => {
    it('should generate a valid UUID', () => {
      const uuid = getUUID();
      expect(uuid).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i);
    });
  });
});
