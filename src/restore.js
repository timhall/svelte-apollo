export const restoring =
  typeof WeakSet !== 'undefined' ? new WeakSet() : { has: () => false };

export default function restore(client, values) {
  // TODO
  // restoring.add(client);
  // nextTick/onMount -> restoring.delete(client);
}
