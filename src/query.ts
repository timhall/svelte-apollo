import { observe } from 'svelte-observable';
import { restoring } from './restore';
import ApolloClient, {
  ObservableQuery,
  WatchQueryOptions
} from 'apollo-client';
import { ApolloQueryResult } from 'apollo-client/core/types';

export interface QueryStore<TData> {
  subscribe: (
    subscription: (value: ApolloQueryResult<TData>) => void
  ) => () => void;

  refetch: ObservableQuery['refetch'];
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
  let initial_value: TData | undefined;
  if (restoring.has(client)) {
    try {
      // undefined = skip initial value (not in cache)
      initial_value = client.readQuery(options) || undefined;
    } catch (err) {
      // Ignore preload errors
    }
  }

  const observable_query = client.watchQuery<TData>(options);
  const { subscribe } = observe(observable_query, initial_value);

  // Most likely extension from ObservableQuery needed
  const refetch = variables => observable_query.refetch(variables);

  // Rest included for completeness
  // (except for setVariables, marked internal use only)

  const result = () => observable_query.result();
  const fetchMore = options => observable_query.fetchMore(options);
  const setOptions = options => observable_query.setOptions(options);
  const updateQuery = map => observable_query.updateQuery(map);
  const startPolling = interval => observable_query.startPolling(interval);
  const stopPolling = () => observable_query.stopPolling();
  const subscribeToMore = options => observable_query.subscribeToMore(options);

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
