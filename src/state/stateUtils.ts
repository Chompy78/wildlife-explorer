export function addUnique<T>(existing: T[], value: T): T[] {
  return existing.includes(value) ? existing : [...existing, value];
}

export function bumpCount<K extends string>(counts: Partial<Record<K, number>>, key: K): Partial<Record<K, number>> {
  return { ...counts, [key]: (counts[key] ?? 0) + 1 };
}
