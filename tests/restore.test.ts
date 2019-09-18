import { restore } from '../src';
import { restoring } from '../src/restore';
import { MockClient } from './helpers';

it('should export restore', () => {
  expect(typeof restore).toBe('function');
});

it('should add client to restoring set', () => {
  const client = new MockClient();
  const options = { query: {}, data: {} };
  restore(client, options);

  expect(restoring.has(client)).toEqual(true);
})

it('should call client writeQuery', () => {
  const client = new MockClient({
    writeQuery() {}
  });
  const options = { query: {}, data: {} };
  restore(client, options);

  expect(mock(client.writeQuery)).toBeCalled();
  expect(mock(client.writeQuery)).lastCalledWith(options);
});

function mock(value: any): any {
  return value;
}
