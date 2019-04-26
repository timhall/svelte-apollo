import { query } from '../src';
import { restoring } from '../src/restore';
import { MockClient, read } from './helpers';
import { Observable } from 'apollo-link';

it('should export query', () => {
  expect(typeof query).toBe('function');
});

it('should call watchQuery with options', () => {
  const client = new MockClient();
  const options = { query: {} };
  const store = query(client, options);

  expect(mock(client.watchQuery)).toBeCalled();
  expect(mock(client.watchQuery)).lastCalledWith(options);
});

it('should expose ObservableQuery functions', () => {
  const client = new MockClient();
  const options = { query: {} };
  const store = query(client, options);

  expect(typeof store.refetch).toBe('function');
  expect(typeof store.result).toBe('function');
  expect(typeof store.fetchMore).toBe('function');
  expect(typeof store.setOptions).toBe('function');
  expect(typeof store.updateQuery).toBe('function');
  expect(typeof store.startPolling).toBe('function');
  expect(typeof store.stopPolling).toBe('function');
  expect(typeof store.subscribeToMore).toBe('function');
});

describe('restore', () => {
  it('should not attempt readQuery if not restoring', () => {
    const client = new MockClient();
    const options = { query: {} };
    const store = query(client, options);

    expect(mock(client.readQuery)).not.toBeCalled();
  });

  it('should attempt readQuery if restoring', () => {
    const client = new MockClient();
    restoring.add(client);

    const options = { query: {} };
    const store = query(client, options);

    expect(mock(client.readQuery)).toBeCalled();
    expect(mock(client.readQuery)).lastCalledWith(options);
  });

  it('should have initial synchronous value from readQuery', async () => {
    const result = {
      data: { name: 'Tim' }
    };
    const client = new MockClient({
      readQuery() {
        return result;
      },
      watchQuery() {
        return Observable.of(result);
      }
    });
    restoring.add(client);

    const options = { query: {} };
    const store = query(client, options);
    const values = await read(store);

    expect(values[0]).toEqual(result);
  });

  it('should not have duplicate value when using readQuery', async () => {
    const result = {
      data: { name: 'Tim' }
    };
    const client = new MockClient({
      readQuery() {
        return result;
      },
      watchQuery() {
        return Observable.of(result);
      }
    });
    restoring.add(client);

    const options = { query: {} };
    const store = query(client, options);
    const values = await read(store, 2);

    expect(values.length).toBe(1);
  });

  it('should swallow errors from readQuery', () => {
    const client = new MockClient({
      readQuery() {
        throw new Error('(swallowed)');
      }
    });
    restoring.add(client);

    const options = { query: {} };
    const store = query(client, options);

    expect(mock(client.readQuery)).toBeCalled();
    expect(mock(client.readQuery)).lastCalledWith(options);
  });
});

function mock(value: any): any {
  return value;
}
