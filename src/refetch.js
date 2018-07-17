import { SVELTE_OBSERVABLE } from 'svelte-observable';

export default function refetch(value) {
  const query = value && value[SVELTE_OBSERVABLE];
  if (!query || typeof query.refetch !== 'function') {
    throw new Error('Given value is not an ObservableQuery');
  }

  return query.refetch();
}
