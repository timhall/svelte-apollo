import ApolloClient from 'apollo-client';

export type Restoring<TCache> =
  | WeakSet<ApolloClient<TCache>>
  | Set<ApolloClient<TCache>>;

export const restoring: Restoring<any> =
  typeof WeakSet !== 'undefined' ? new WeakSet() : new Set();

export default function restore<TCache>(
  client: ApolloClient<TCache>,
  values: any
): void {
  // TODO
  // restoring.add(client);
  // nextTick/onMount -> restoring.delete(client);
}
