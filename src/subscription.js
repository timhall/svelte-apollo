import { deferred } from 'svelte-observable';
import { SVELTE_APOLLO } from './utils';

export default function subscription(graphql, options) {
  const wrapped = deferred();
  wrapped[SVELTE_APOLLO] = provider => provider.subscribe(graphql, options);

  return wrapped;
}
