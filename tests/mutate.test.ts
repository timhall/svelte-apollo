import { mutate } from '../src';

it('should export mutate', () => {
  expect(typeof mutate).toBe('function');
});
