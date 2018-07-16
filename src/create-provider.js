import { SVELTE_APOLLO, nonenumerable } from './utils';

export default function createProvider(client, options = {}) {
  if (!client) {
    throw new Error('"client" is required and should be an ApolloClient');
  }

  const provider = {};
  nonenumerable(provider, SVELTE_APOLLO, client);

  if (options.ssr) {
    // Extremely simplified version of apollo-cache-persist
    // (rough equivalent: trigger = 'write', debounce = false, serialize = false)
    const cache = client.cache;
    const write = cache.write;
    cache.write = (...args) => {
      write.apply(cache, args);

      provider.cache = cache.extract();
    };
  } else if (options.from && options.from.cache) {
    client.cache.restore(options.from.cache);
  }

  return provider;
}
