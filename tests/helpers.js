import { SVELTE_APOLLO } from '../src/utils';

export function createStore(values) {
  return {
    get: jest.fn(() => values),
    set: jest.fn()
  };
}

export function createClient() {
  return {
    query: jest.fn(),
    watchQuery: jest.fn(),
    subscribe: jest.fn(),
    mutate: jest.fn()
  };
}

export function createComponent() {
  const client = createClient();
  const store = createStore({ graphql: { [SVELTE_APOLLO]: client } });
  const component = {
    on: jest.fn(),
    set: jest.fn(),
    store
  };

  return { client, store, component };
}

export function createQuery() {
  const subscription = { unsubscribe: jest.fn() };
  const observable = { subscribe: jest.fn(() => subscription) };

  const query = {
    resolve: jest.fn(),
    reject: jest.fn(),
    [SVELTE_APOLLO]: jest.fn(() => observable)
  };

  return { query, observable, subscription };
}

export function isDeferred(value) {
  return (
    value &&
    typeof value.resolve === 'function' &&
    typeof value.reject === 'function'
  );
}
