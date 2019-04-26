import { subscribe } from '../src';
import { MockClient, read } from './helpers';
import { Observable } from 'apollo-link';

it('should export subscribe', () => {
  expect(typeof subscribe).toBe('function');
});

it('should observe subscription', async () => {
  const client = new MockClient({
    subscribe() {
      return Observable.of(1, 2, 3);
    }
  });
  const options = { query: {} };
  const store = subscribe(client, options as any);

  expect(mock(client.subscribe)).toBeCalled();
  expect(mock(client.subscribe)).lastCalledWith(options);

  const values = await read(store, 3);
  expect(typeof (values[0] as any).then).toEqual('function');
  expect(await Promise.all(values)).toEqual([1, 2, 3]);
});

function mock(value: any): any {
  return value;
}
