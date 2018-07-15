import { subscribe, SVELTE_OBSERVABLE } from 'svelte-observable';
import { SVELTE_APOLLO, consumer } from './utils';

export default function connect(state) {
  const { changed, current } = state;
  const client = consumer(this);

  // Convert queries and subscriptions into observables
  for (const key in changed) {
    const value = current[key];
    const graphql = value && value[SVELTE_APOLLO];

    if (graphql) {
      value[SVELTE_OBSERVABLE] = graphql(client);
    }
  }

  subscribe.call(this, state);
}
