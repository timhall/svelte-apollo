export const SVELTE_APOLLO =
  typeof Symbol === 'function' ? Symbol('svelte-apollo') : '@@svelte-apollo';

export function consumer(context) {
  const { graphql } = context.store.get();
  return graphql[SVELTE_APOLLO];
}

export function assign(target, values) {
  for (key in values) {
    target[key] = values[key];
  }
}
