export default function mergeUnique<T>({
  first = [],
  second = [],
  asKey,
}: {
  first?: T[];
  second?: T[];
  asKey: (input: T) => string;
}): T[] {
  const result: T[] = [];
  const visited = new Set<string>();
  function append(input?: T[]) {
    if (!input) {
      return;
    }
    for (const each of input) {
      const key = asKey(each);
      if (visited.has(key)) {
        continue;
      }
      result.push(each);
      visited.add(key);
    }
  }
  append(first);
  append(second);
  return result;
}
