import { mutate } from '../src';
import { MockClient } from './helpers';

it('should export mutate', () => {
  expect(typeof mutate).toBe('function');
});

it('should call client mutate', async () => {
  const client = new MockClient({
    async mutate() {
      return 42;
    }
  });
  const options = { mutation: {} };
  const result = await mutate(client, options as any);

  expect(mock(client.mutate)).toBeCalled();
  expect(mock(client.mutate)).lastCalledWith(options);
  expect(result).toEqual(42);
});

function mock(value: any): any {
  return value;
}
