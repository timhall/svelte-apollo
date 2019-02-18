import { readable } from 'svelte/store';
import query, { QueryStore } from './query';
import ApolloClient, { WatchQueryOptions } from 'apollo-client';
import { ApolloQueryResult } from 'apollo-client/core/types';

export default function prepare<TData, TCache, TVariables>(
  client: ApolloClient<TCache>,
  options: WatchQueryOptions<TVariables>
): QueryStore<TData> {
  let query_store: QueryStore<TData> | undefined;
  let query_store_unsubscribe: () => void | undefined;
  let set: (value: ApolloQueryResult<TData>) => void | undefined;

  const query_store_subscribe = () => {
    if (query_store && set && !query_store_unsubscribe) {
      query_store_unsubscribe = query_store.subscribe(set);
    }
  };

  const { subscribe } = readable<ApolloQueryResult<TData>>(_set => {
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

  const result = () => query_store.result();
  const fetchMore = options => query_store.fetchMore(options);
  const setOptions = options => query_store.setOptions(options);
  const updateQuery = map => query_store.updateQuery(map);
  const startPolling = interval => query_store.startPolling(interval);
  const stopPolling = () => query_store.stopPolling();
  const subscribeToMore = options => query_store.subscribeToMore(options);

  return {
    subscribe,
    refetch,
    result,
    fetchMore,
    setOptions,
    updateQuery,
    startPolling,
    stopPolling,
    subscribeToMore
  };
}
