import { observe } from 'svelte-observable';
import { restoring } from './restore';
import ApolloClient, {
  ObservableQuery,
  WatchQueryOptions
} from 'apollo-client';
import { ApolloQueryResult } from 'apollo-client/core/types';

export type Deferred<T> = T | Promise<T>;
export type Next<T> = (value: T) => void;
export type Unsubscribe = () => void;

export interface QueryStore<TData> {
  subscribe: (
    subscription: Next<Deferred<ApolloQueryResult<TData>>>
  ) => Unsubscribe;

  // Most likely extension from ObservableQuery needed
  refetch: ObservableQuery['refetch'];

  // Rest included for completeness
  // (except for setVariables, marked internal use only)
  result: ObservableQuery['result'];
  fetchMore: ObservableQuery['fetchMore'];
  setOptions: ObservableQuery['setOptions'];
  updateQuery: ObservableQuery['updateQuery'];
  startPolling: ObservableQuery['startPolling'];
  stopPolling: ObservableQuery['stopPolling'];
  subscribeToMore: ObservableQuery['subscribeToMore'];
}

export default function query<TData, TCache, TVariables>(
  client: ApolloClient<TCache>,
  options: WatchQueryOptions<TVariables>
): QueryStore<TData> {
  // If client is restoring (e.g. from SSR)
  // attempt synchronous readQuery first (to prevent loading in {#await})
  let initial_value: ApolloQueryResult<TData> | undefined;
  if (restoring.has(client)) {
    try {
      // undefined = skip initial value (not in cache)
      initial_value = client.readQuery(options) || undefined;
    } catch (err) {
      // Ignore preload errors
    }
  }

  const observable_query = client.watchQuery<TData>(options);
  const { subscribe } = observe<ApolloQueryResult<TData>>(
    observable_query,
    initial_value
  );

  return {
    subscribe,
    refetch: variables => observable_query.refetch(variables),
    result: () => observable_query.result(),
    fetchMore: options => observable_query.fetchMore(options),
    setOptions: options => observable_query.setOptions(options),
    updateQuery: map => observable_query.updateQuery(map),
    startPolling: interval => observable_query.startPolling(interval),
    stopPolling: () => observable_query.stopPolling(),
    subscribeToMore: options => observable_query.subscribeToMore(options)
  };
}
