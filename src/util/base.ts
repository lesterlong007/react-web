export const pxTransformToRem = (px: number) => `${px / 100}rem`;

export const getDataType = (data: any): string => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();

export const isEmpty = (data: any): boolean => {
  if (!data) {
    return true;
  }
  if (getDataType(data) === 'array') {
    return data.length === 0;
  }
  return Object.keys(data).length === 0;
};

export const deepClone = (obj: any, hash = new WeakMap()) => {
  if (!obj) return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (typeof obj === 'function') {
    // eslint-disable-next-line no-new-func
    return new Function('return ' + obj.toString())();
  }
  if (typeof obj !== 'object') return obj;
  if (hash.get(obj)) return hash.get(obj);
  const cloneObj = new obj.constructor();
  hash.set(obj, cloneObj);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  return cloneObj;
};

export const isObjEqual = (obj1: any, obj2: any, map = new Map()): boolean => {
  const type1 = getDataType(obj1);
  const type2 = getDataType(obj2);
  if (type1 !== type2 || !['object', 'array'].includes(type1)) {
    return obj1 === obj2;
  }
  if (type1 === 'array' && obj1.length !== obj2.length) {
    return false;
  }
  if (map.get(obj1) && map.get(obj2)) {
    return true;
  } else {
    map.set(obj1, true);
    map.set(obj2, true);
  }
  let flag = true;
  const key1 = Object.keys(obj1);
  const key2 = Object.keys(obj2);
  if (key1.length !== key2.length) {
    return false;
  }
  for (let i = 0; i < key1.length; i++) {
    const key = key1[i];
    if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
      return false;
    }
    const val1 = obj1[key];
    const val2 = obj2[key];
    const valType1 = getDataType(val1);
    const valType2 = getDataType(val2);
    if (valType1 === valType2 && ['object', 'array'].includes(valType1)) {
      flag = isObjEqual(val1, val2, map);
    } else if (val1 !== val2) {
      return false;
    }
  }
  return flag;
};
