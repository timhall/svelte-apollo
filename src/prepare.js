import { readable } from 'svelte/store';
import query from './query';
import { assign } from './utils';

export default function prepare(client, options) {
  let query_store, query_store_unsubscribe, set;
  let query_store_subscribe = () => {
    if (query_store && set && !query_store_unsubscribe) {
      query_store_unsubscribe = query_store.subscribe(set);
    }
  };

  const store = readable(_set => {
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
  store.refetch = variables => {
    if (!query_store) {
      query_store = query(client, assign({ variables }, options));
      query_store_subscribe();
    } else {
      query_store.refetch(variables);
    }
  };

  store.fetchMore = options => query_store.fetchMore(options);
  store.setOptions = options => query_store.setOptions(options);
  store.updateQuery = map => query_store.updateQuery(map);
  store.startPolling = interval => query_store.startPolling(interval);
  store.stopPolling = () => query_store.stopPolling();
  store.subscribeToMore = options => query_store.subscribeToMore(options);

  return store;
}
