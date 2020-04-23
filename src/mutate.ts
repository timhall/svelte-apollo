import { MutationOptions } from 'apollo-client';
import { FetchResult } from 'apollo-link';
import { getClient } from './context';

export default function mutate<T = any, TVariables = any>(
  options: MutationOptions<T, TVariables>
): Promise<FetchResult<T>> {
  const client = getClient();
  return client.mutate(options);
}
