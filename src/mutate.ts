import ApolloClient, { MutationOptions } from 'apollo-client';

export default function mutate<T, TCache, TVariables>(
  client: ApolloClient<TCache>,
  options: MutationOptions<T, TVariables>
) {
  return client.mutate(options);
}
