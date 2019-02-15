import { createClient, isDeferred } from './helpers';
import { SVELTE_APOLLO } from '../src/utils';
import query from '../src/query';

it('should return deferred', () => {
  const value = query('...');
  expect(isDeferred(value)).toEqual(true);
});

it('should return watchQuery on call', () => {
  const client = createClient();
  const value = query('...');

  value[SVELTE_APOLLO](client);

  expect(client.watchQuery).toHaveBeenCalled();
  expect(client.watchQuery.mock.calls[0][0]).toEqual({ query: '...' });
});
