export type Deferred<T> = T | Promise<T>;
export type Next<T> = (value: T) => void;
export type Unsubscribe = () => void;
