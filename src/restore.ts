import { onMount } from 'svelte';
import ApolloClient, { OperationVariables } from 'apollo-client';
import { DataProxy } from 'apollo-cache';

export type Restoring<TCache> =
  | WeakSet<ApolloClient<TCache>>
  | Set<ApolloClient<TCache>>;

export const restoring: Restoring<any> =
  typeof WeakSet !== 'undefined' ? new WeakSet() : new Set();

export default function restore<TCache = any, TData = any, TVariables = OperationVariables>(
  client: ApolloClient<TCache>,
  options: DataProxy.WriteQueryOptions<TData, TVariables>,
): void {
  restoring.add(client);
  afterHydrate(() => {
    restoring.delete(client);
  });

  client.writeQuery(options);
}

function afterHydrate(callback: () => void): void {
  // Attempt to wait for onMount (hydration of current component is complete),
  // but if that fails (e.g. outside of component initialization)
  // wait for next event loop for hydrate to complete

  try {
    onMount(callback);
  } catch (_error) {
    setTimeout(callback, 1);
  }
}
