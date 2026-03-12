function escapeHTML(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function escapeHtmlProperties(
  obj: Record<string, boolean | number | string>,
) {
  const escapedObj: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      escapedObj[key] = escapeHTML(value);
    } else {
      escapedObj[key] = String(value);
    }
  }

  return escapedObj;
}

export function removeScripts(input: string): string {
  return input.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function sanitizeValue(
  value: unknown,
  maxDepth: number = 5,
  currentDepth: number = 0,
  seen: WeakSet<object> = new WeakSet(),
): unknown {
  if (typeof value === "string") {
    return removeScripts(value);
  }

  if (value === null || value === undefined) {
    return value;
  }

  if (currentDepth >= maxDepth) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      sanitizeValue(item, maxDepth, currentDepth + 1, seen),
    );
  }

  if (!isPlainObject(value)) {
    return value;
  }

  if (seen.has(value)) {
    return value;
  }

  seen.add(value);

  const sanitizedObj: Record<string, unknown> = {};

  for (const [key, nestedValue] of Object.entries(value)) {
    sanitizedObj[key] = sanitizeValue(
      nestedValue,
      maxDepth,
      currentDepth + 1,
      seen,
    );
  }

  return sanitizedObj;
}

export function removeScriptsFromArray<T>(
  arr: T[],
  maxDepth: number = 5,
  currentDepth: number = 0,
): T[] {
  return sanitizeValue(arr, maxDepth, currentDepth) as T[];
}

export function removeScriptsFromObject<T extends Record<string, unknown>>(
  obj: T,
  maxDepth: number = 5,
  currentDepth: number = 0,
) {
  return sanitizeValue(obj, maxDepth, currentDepth) as T;
}
