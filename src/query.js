import { deferred } from 'svelte-observable';
import { SVELTE_APOLLO } from './utils';

export default function query(graphql, options) {
  const wrapped = deferred();
  wrapped[SVELTE_APOLLO] = provider => provider.query(graphql, options);

  return wrapped;
}
