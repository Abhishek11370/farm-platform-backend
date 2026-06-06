export function toStringValue(value: any): string {
  if (value === undefined || value === null) return '';
  return Array.isArray(value) ? String(value[0]) : String(value);
}

export function toStringValueOrUndefined(value: any): string | undefined {
  if (value === undefined || value === null) return undefined;
  return Array.isArray(value) ? String(value[0]) : String(value);
}
