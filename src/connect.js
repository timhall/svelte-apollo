import { subscribe } from 'svelte-observable';

export default function connect(state) {
  const { changed, current } = state;

  // TODO convert queries and subscriptions into observables

  subscribe.call(this, state);
}
