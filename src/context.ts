import { getContext, setContext } from 'svelte';
import ApolloClient from 'apollo-client';

const CLIENT = typeof Symbol !== 'undefined' ? Symbol('client') : '@@client';

export function getClient<TCache = any>(): ApolloClient<TCache> {
  return getContext(CLIENT);
}

export function setClient<TCache = any>(client: ApolloClient<TCache>): void {
  setContext(CLIENT, client);
}
