import { observe } from 'svelte-observable';
import { restoring } from './restore';

export default function query(client, options) {
  // If client is restoring (e.g. from SSR)
  // attempt synchronous readQuery first (to prevent loading in {#await})
  let initial_value;
  if (restoring.has(client)) {
    try {
      // undefined = skip initial value (not in cache)
      initial_value = client.readQuery(options) || undefined;
    } catch (err) {
      // Ignore preload errors
    }
  }

  const observable_query = client.watchQuery(options);
  const store = observe(observable_query, initial_value);

  // Most likely extension from ObservableQuery needed
  store.refetch = variables => observable_query.refetch(variables);

  // Rest included for completeness
  store.fetchMore = options => observable_query.fetchMore(options);
  store.setOptions = options => observable_query.setOptions(options);
  // store.setVariables -> excluded, internal use only
  store.updateQuery = map => observable_query.updateQuery(map);
  store.startPolling = interval => observable_query.startPolling(interval);
  store.stopPolling = () => observable_query.stopPolling();
  store.subscribeToMore = options => observable_query.subscribeToMore(options);

  return store;
}
