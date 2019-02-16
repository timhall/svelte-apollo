import { getContext, setContext } from 'svelte';

const CLIENT = typeof Symbol !== 'undefined' ? Symbol('client') : '__client__';

export function getClient() {
  return getContext(CLIENT);
}

export function setClient(client) {
  return setContext(CLIENT, client);
}
