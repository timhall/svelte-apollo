declare module 'svelte' {
  export function getContext<T>(key: any): T | undefined;
  export function setContext<T>(key: any, value: T): void;
}

declare module 'svelte/store' {
  type Next<T> = (value: T) => void;
  type Unsubscribe = () => void;
  type Start<T> = (set: Next<T>) => Unsubscribe | void;

  interface ReadableStore<T> {
    subscribe(subscription: Next<T>): Unsubscribe;
  }

  export function readable<T>(start: Start<T>, initial?: T): ReadableStore<T>;
}
