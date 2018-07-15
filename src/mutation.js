import { consumer, assign } from './utils';

export default function mutation(graphql, options) {
  return function(...args) {
    const client = consumer(this);
    const mutate = options =>
      client.mutate(assign({ mutation: graphql }, options));

    if (typeof options === 'function') {
      return options(mutate)(...args);
    } else {
      return mutate(options);
    }
  };
}
