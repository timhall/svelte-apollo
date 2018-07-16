import { SVELTE_OBSERVABLE } from 'svelte-observable';
import connect from '../connect';
import { SVELTE_APOLLO } from '../utils';

const changed = { a: 1 };

it('should convert graphql to observable', () => {
  const { component, client } = createComponent();
  const { query, observable, subscription } = createQuery();

  connect.call(component, { changed, current: { a: query } });

  expect(query[SVELTE_APOLLO]).toHaveBeenCalledWith(client);
  expect(query[SVELTE_OBSERVABLE]).toBe(observable);
  expect(observable.subscribe).toHaveBeenCalled();
});

export function createStore(values) {
  return {
    get: jest.fn(() => values),
    set: jest.fn()
  };
}

export function createComponent() {
  const client = {};
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
