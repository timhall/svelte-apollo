import { createClient, isDeferred } from './helpers';
import { SVELTE_APOLLO } from '../utils';
import subscription from '../subscription';

it('should return deferred', () => {
  const value = subscription('...');
  expect(isDeferred(value)).toEqual(true);
});

it('should return subscription on call', () => {
  const client = createClient();
  const value = subscription('...');

  value[SVELTE_APOLLO](client);

  expect(client.subscribe).toHaveBeenCalled();
  expect(client.subscribe.mock.calls[0][0]).toEqual({ query: '...' });
});
