import { observe } from 'svelte-observable';
import { SubscriptionOptions } from 'apollo-client';
import { Deferred, Next, Unsubscribe } from './types';
import { getClient } from './context';

export interface ReadableStore<T> {
  subscribe(next: Next<T>): Unsubscribe;
}

export default function subscribe<TVariables = any, T = any>(
  options: SubscriptionOptions<TVariables>
): ReadableStore<Deferred<T>> {
  const client = getClient();
  const observable = client.subscribe(options);
  return observe<T>(observable);
}
