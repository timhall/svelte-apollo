import { observe } from 'svelte-observable';
import ApolloClient, { SubscriptionOptions } from 'apollo-client';

export default function subscribe<TCache, TVariables>(
  client: ApolloClient<TCache>,
  options: SubscriptionOptions<TVariables>
) {
  const observable = client.subscribe(options);
  return observe(observable);
}
