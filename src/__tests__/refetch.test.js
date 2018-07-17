import { SVELTE_OBSERVABLE } from 'svelte-observable';
import refetch from '../refetch';

it('should call refetch on ObservableQuery', () => {
  const query = { refetch: jest.fn() };
  const value = { [SVELTE_OBSERVABLE]: query };

  refetch(value);

  expect(query.refetch).toHaveBeenCalled();
});
