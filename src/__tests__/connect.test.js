import { SVELTE_OBSERVABLE } from 'svelte-observable';
import { SVELTE_APOLLO } from '../utils';
import { createComponent, createQuery } from './helpers';
import connect from '../connect';

const changed = { a: 1 };

it('should convert graphql to observable', () => {
  const { component, client } = createComponent();
  const { query, observable, subscription } = createQuery();

  connect.call(component, { changed, current: { a: query } });

  expect(query[SVELTE_APOLLO]).toHaveBeenCalledWith(client);
  expect(query[SVELTE_OBSERVABLE]).toBe(observable);
  expect(observable.subscribe).toHaveBeenCalled();
});
