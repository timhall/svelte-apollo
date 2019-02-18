import { getContext, setContext } from 'svelte';
import ApolloClient from 'apollo-client';

const CLIENT = typeof Symbol !== 'undefined' ? Symbol('client') : '__client__';

export function getClient<TCache>(): ApolloClient<TCache> | undefined {
  return getContext(CLIENT);
}

export function setClient<TCache>(client: ApolloClient<TCache>): void {
  setContext(CLIENT, client);
}
