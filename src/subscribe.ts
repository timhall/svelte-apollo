import { observe } from 'svelte-observable';
import ApolloClient, { SubscriptionOptions } from 'apollo-client';
import { Deferred, Next, Unsubscribe } from './types';

export interface ReadableStore<T> {
  subscribe(next: Next<T>): Unsubscribe;
}

export default function subscribe<TCache = any, TVariables = any, T = any>(
  client: ApolloClient<TCache>,
  options: SubscriptionOptions<TVariables>
): ReadableStore<Deferred<T>> {
  const observable = client.subscribe(options);
  return observe<T>(observable);
}
