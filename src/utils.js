export const SVELTE_APOLLO = 'svelte-apollo';

export function consumer(context) {
  const { graphql } = context.store.get();
  return graphql[SVELTE_APOLLO];
}

export function assign(target, values) {
  for (const key in values) {
    target[key] = values[key];
  }
  return target;
}
