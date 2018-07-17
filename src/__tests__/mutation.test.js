import { createComponent } from './helpers';
import mutation from '../mutation';

it('should call mutation with options', () => {
  const { client, component } = createComponent();

  const mutating = {};
  client.mutate.mockReturnValue(mutating);

  const graphql = '...';
  const options = {};
  const mutate = mutation(graphql, options);

  const result = mutate.call(component);

  expect(result).toBe(mutating);
  expect(client.mutate).toHaveBeenCalled();
  expect(client.mutate.mock.calls[0][0]).toEqual({ mutation: '...' });
});

it('should call mutation with function', () => {
  const { client, component } = createComponent();

  const mutating = {};
  client.mutate.mockReturnValue(mutating);

  const graphql = '...';

  const called = {};
  const options = jest.fn(
    fn =>
      function(...args) {
        called.context = this;
        called.args = args;

        return fn();
      }
  );
  const mutate = mutation(graphql, options);
  const result = mutate.call(component, 'a', 'b');

  expect(result).toBe(mutating);
  expect(options).toHaveBeenCalled();
  expect(client.mutate).toHaveBeenCalled();
  expect(client.mutate.mock.calls[0][0]).toEqual({ mutation: '...' });
  expect(called.context).toBe(component);
  expect(called.args).toEqual(['a', 'b']);
});
