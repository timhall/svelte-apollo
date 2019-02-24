import ApolloClient, { MutationOptions } from 'apollo-client';

export default function mutate<T = any, TCache = any, TVariables = any>(
  client: ApolloClient<TCache>,
  options: MutationOptions<T, TVariables>
) {
  return client.mutate(options);
}
