export function assign(target, values) {
  for (const key in values) {
    target[key] = values[key];
  }
  return target;
}
