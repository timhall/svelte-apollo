import { isEqual } from 'apollo-utilities';
import { readable } from 'svelte/store';
import { observe } from 'svelte-observable';
import { restoring } from './restore';
import ApolloClient, {
  ObservableQuery,
  WatchQueryOptions,
  ApolloQueryResult
} from 'apollo-client';
import { Deferred, Next, Unsubscribe } from './types';

export interface QueryStore<TData = any> {
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

export default function query<TData = any, TCache = any, TVariables = any>(
  client: ApolloClient<TCache>,
  options: WatchQueryOptions<TVariables>
): QueryStore<TData> {
  type Value = ApolloQueryResult<TData>;

  let subscribed = false;
  let initial_value: Value | undefined;

  // If client is restoring (e.g. from SSR)
  // attempt synchronous readQuery first (to prevent loading in {#await})

  if (restoring.has(client)) {
    try {
      // undefined = skip initial value (not in cache)
      initial_value = client.readQuery(options) || undefined;
    } catch (err) {
      // Ignore preload errors
    }
  }

  const observable_query = client.watchQuery<TData>(options);
  const { subscribe: subscribe_to_query } = observe<Value>(
    observable_query,
    initial_value
  );

  const { subscribe } = readable<Deferred<Value>>(set => {
    subscribed = true;

    const skip_duplicate = initial_value !== undefined;
    let initialized = false;
    let skipped = false;

    const unsubscribe = subscribe_to_query(value => {
      if (skip_duplicate && initialized && !skipped) {
        skipped = true;
      } else {
        if (!initialized) initialized = true;
        set(value);
      }
    });

    return unsubscribe;
  });

  return {
    subscribe,
    refetch: variables => {
      // If variables have not changed and not subscribed, skip refetch
      if (!subscribed && isEqual(variables, observable_query.variables))
        return observable_query.result();

      return observable_query.refetch(variables);
    },
    result: () => observable_query.result(),
    fetchMore: options => observable_query.fetchMore(options),
    setOptions: options => observable_query.setOptions(options),
    updateQuery: map => observable_query.updateQuery(map),
    startPolling: interval => observable_query.startPolling(interval),
    stopPolling: () => observable_query.stopPolling(),
    subscribeToMore: options => observable_query.subscribeToMore(options)
  };
}
