export type EventTarget<T> = {
  [P in keyof T]: {
    value: T[P];
  };
};
