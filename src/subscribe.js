import { observe } from 'svelte-observable';

export default function subscribe(client, options) {
  const observable = client.subscribe(options);
  return observe(observable);
}
