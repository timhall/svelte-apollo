// Will likely be a Symbol in the future,
// but currently has issues with devalue in sapper
export const SVELTE_APOLLO = 'svelte-apollo';

export { deferred, nonenumerable } from 'svelte-observable';

export function consumer(context) {
  const store = context && context.store;
  if (!store) {
    throw new Error('Could not find store on provided consumer context');
  }

  const { graphql } = store.get();
  const consumer = graphql && graphql[SVELTE_APOLLO];

  if (!consumer) {
    throw new Error('Could not find graphql provider in store');
  }

  return consumer;
}

export function assign(target, values) {
  for (const key in values) {
    target[key] = values[key];
  }
  return target;
}
