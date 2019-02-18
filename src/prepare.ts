import { readable } from 'svelte/store';
import query, { QueryStore } from './query';
import ApolloClient, { WatchQueryOptions } from 'apollo-client';
import { ApolloQueryResult } from 'apollo-client/core/types';

type Unsubscribe = () => void;
type Deferred<T> = T | Promise<T>;
type Next<T> = (value: Deferred<ApolloQueryResult<T>>) => void;

export default function prepare<TData, TCache, TVariables>(
  client: ApolloClient<TCache>,
  options: WatchQueryOptions<TVariables>
): QueryStore<TData> {
  let query_store: QueryStore<TData> | undefined;
  let query_store_unsubscribe: Unsubscribe | undefined;
  let set: Next<TData> | undefined;

  const query_store_subscribe = () => {
    if (query_store && set && !query_store_unsubscribe) {
      query_store_unsubscribe = query_store.subscribe(set);
    }
  };

  const { subscribe } = readable((_set: Next<TData>) => {
    set = _set;
    query_store_subscribe();

    return () => {
      if (query_store_unsubscribe) {
        query_store_unsubscribe();
        query_store_unsubscribe = undefined;
      }
    };
  });

  // Kick off query on initial fetch, then refetch normally
  const refetch = (variables?: TVariables) => {
    if (!query_store) {
      query_store = query(client, { variables, ...options });
      query_store_subscribe();

      return query_store.result();
    } else {
      return query_store.refetch(variables);
    }
  };

  return {
    subscribe,
    refetch,
    result: () => query_store!.result(),
    fetchMore: options => query_store!.fetchMore(options),
    setOptions: options => query_store!.setOptions(options),
    updateQuery: map => query_store!.updateQuery(map),
    startPolling: interval => query_store!.startPolling(interval),
    stopPolling: () => query_store!.stopPolling(),
    subscribeToMore: options => query_store!.subscribeToMore(options)
  };
}
