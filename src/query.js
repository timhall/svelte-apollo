import { deferred } from 'svelte-observable';
import { SVELTE_APOLLO, assign } from './utils';

export default function query(graphql, options = {}) {
  const wrapped = deferred();
  wrapped[SVELTE_APOLLO] = client =>
    client.watchQuery(assign({ query: graphql }, options));

  return wrapped;
}
