import { SVELTE_APOLLO, assign, deferred, nonenumerable } from './utils';

export default function query(graphql, options = {}) {
  const wrapped = deferred();
  nonenumerable(wrapped, SVELTE_APOLLO, client =>
    client.watchQuery(assign({ query: graphql }, options))
  );

  return wrapped;
}
