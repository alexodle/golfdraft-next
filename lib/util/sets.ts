export function union<T>(
  s1: Set<T> | T[] | T | undefined | null,
  ...s2: (Set<T> | T[] | T | undefined | null)[]
): Set<T> {
  const set = new Set<T>();
  [s1, ...s2].forEach((arr) => {
    asArray(arr).forEach((v) => {
      set.add(v);
    });
  });
  return set;
}

export function difference<T>(s1: Set<T> | T[], s2: Set<T> | T[] | T | undefined | null) {
  const set = new Set<T>([...s1]);
  asArray(s2).forEach((v) => {
    set.delete(v);
  });
  return set;
}

function asArray<T>(v: Set<T> | T[] | T | undefined | null): T[] {
  if (Array.isArray(v)) {
    return v;
  }
  if (v instanceof Set) {
    return [...v];
  }
  return v ? [v] : [];
}

function asSet<T>(v: Set<T> | T[] | T | undefined | null): Set<T> {
  if (v instanceof Set) {
    return v;
  }
  if (Array.isArray(v)) {
    return new Set(v);
  }
  return new Set<T>(v ? [v] : undefined);
}
