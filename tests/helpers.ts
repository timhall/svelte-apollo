import ApolloClient, { ApolloClientOptions } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { ReadableStore } from 'svelte/store';

export interface MockOptions {
  watchQuery?: (options: any) => any;
  readQuery?: (options: any, optimistic?: any) => any;
  writeQuery?: (options: any) => any;
  mutate?: (options: any) => any;
  subscribe?: (options: any) => any;
}

const noop = () => {};

export class MockClient<TCache> extends ApolloClient<TCache> {
  constructor(
    options: Partial<ApolloClientOptions<TCache>> & MockOptions = {}
  ) {
    const cache = options.cache || new InMemoryCache();
    const link =
      options.link ||
      ApolloLink.from([withClientState({ cache, resolvers: {} })]);

    const client_options: ApolloClientOptions<TCache> = Object.assign(options, {
      cache,
      link
    });

    super(client_options);

    const {
      watchQuery = noop,
      readQuery = noop,
      writeQuery = noop,
      mutate = noop,
      subscribe = noop
    } = options;

    this.watchQuery = jest.fn(watchQuery);
    this.readQuery = jest.fn(readQuery);
    this.writeQuery = jest.fn(writeQuery);
    this.mutate = jest.fn(mutate);
    this.subscribe = jest.fn(subscribe);
  }
}

type Next<T> = (value: T) => void;
export type Deferred<T> = T | Promise<T>;

export async function read<T>(
  store: ReadableStore<Deferred<T>>,
  take = 1
): Promise<T[]> {
  const values: Deferred<T>[] = [];
  let push: Next<Deferred<T>> | undefined;

  const done = new Promise(resolve => {
    push = (value: Deferred<T>) => {
      console.log('push', value);
      values.push(value);
      if (values.length >= take) resolve();
    };
  });

  const unsubscribe = store.subscribe(push!);
  await done;

  unsubscribe();
  return Promise.all(values);
}
