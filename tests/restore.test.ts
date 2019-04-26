import { restore } from '../src';
import { restoring } from '../src/restore';
import { MockClient } from './helpers';

it('should export restore', () => {
  expect(typeof restore).toBe('function');
});

it('should pass query and data to client', () => {
  const client = new MockClient();
  const query: any = {};
  const data = {};

  restore(client, query, data);

  expect(mock(client.writeQuery)).toBeCalled();
  expect(mock(client.writeQuery).mock.calls[0][0].query).toBe(query);
  expect(mock(client.writeQuery).mock.calls[0][0].data).toBe(data);
});

it('should mark client as restoring', () => {
  const client = new MockClient();
  const query: any = {};
  const data = {};

  restore(client, query, data);

  expect(restoring.has(client));
});

function mock(value: any): any {
  return value;
}
