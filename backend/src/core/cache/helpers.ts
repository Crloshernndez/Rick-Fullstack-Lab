export const serialize = (value: any): string => {
  if (typeof value === "string") return value;

  // Manejo de tipos especiales
  return JSON.stringify(value, (key, val) => {
    if (val instanceof Date) return val.toISOString();
    if (typeof val === "bigint") return val.toString();
    if (val instanceof Set) return Array.from(val);
    if (val instanceof Map) return Object.fromEntries(val);
    return val;
  });
};

export const deserialize = (value: string | null): any => {
  if (value === null) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const makeKey = (key: string, namespace?: string): string => {
  return namespace ? `${namespace}:${key}` : key;
};
