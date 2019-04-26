import ApolloClient, { MutationOptions } from 'apollo-client';
import { FetchResult } from 'apollo-link';

export default function mutate<T = any, TCache = any, TVariables = any>(
  client: ApolloClient<TCache>,
  options: MutationOptions<T, TVariables>
): Promise<FetchResult<T>> {
  return client.mutate(options);
}
