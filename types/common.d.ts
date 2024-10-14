type RecordItem = Record<string, any>;

type FN = (...arg: any[]) => void;

interface Constructor<T extends object> {
  new (...args: any[]): T;
}
