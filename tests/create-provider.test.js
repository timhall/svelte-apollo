import { SVELTE_APOLLO } from '../src/utils';
import createProvider from '../src/create-provider';

it('should create attach client on "internal" key', () => {
  const client = {};
  const provider = createProvider(client);

  expect(provider[SVELTE_APOLLO]).toBe(client);
  expect(provider.propertyIsEnumerable(SVELTE_APOLLO)).toEqual(false);
});
