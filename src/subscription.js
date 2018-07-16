import { deferred } from 'svelte-observable';
import { SVELTE_APOLLO, assign } from './utils';

export default function subscription(graphql, options = {}) {
  const wrapped = deferred();
  wrapped[SVELTE_APOLLO] = client =>
    client.subscribe(assign({ query: graphql }, options));

  return wrapped;
}
