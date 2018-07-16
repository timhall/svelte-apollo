import { SVELTE_APOLLO, deferred, assign, nonenumerable } from './utils';

export default function subscription(graphql, options = {}) {
  const wrapped = deferred();
  nonenumerable(wrapped, SVELTE_APOLLO, client =>
    client.subscribe(assign({ query: graphql }, options))
  );

  return wrapped;
}
