export function addUnique<T>(existing: T[], value: T): T[] {
  return existing.includes(value) ? existing : [...existing, value];
}
