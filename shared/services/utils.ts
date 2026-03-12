export function capitalizeFirstLetter(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function getFirstLetter(input: string) {
  const words = input.trim().split(/\s+/);

  return words?.[0]?.charAt(0).toUpperCase() ?? "";
}

export function getFirstWord(input: string) {
  const words = input.trim().split(/\s+/);

  return words?.[0] ?? "";
}

export function transformSingular(input: string, quantity: number) {
  if (quantity === 1) {
    if (input.endsWith("ões")) return input.replace(/ões$/, "ão");
    if (input.endsWith("ãos")) return input.replace(/ãos$/, "ão");
    if (input.endsWith("ens")) return input.replace(/ens$/, "em");
    if (input.endsWith("res")) return input.replace(/res$/, "r");
    if (input.endsWith("ão")) return input;
    if (input.endsWith("s")) return input.slice(0, -1);
  }

  return input;
}

export function feetToMeter(feet: number) {
  if (!Number.isFinite(feet)) return feet;
  const conversion = feet / 3.281;

  return Math.floor(conversion);
}

export function meterToFeet(meter: number) {
  if (!Number.isFinite(meter)) return meter;
  const conversion = meter * 3.281;

  return Math.ceil(conversion);
}

export function convertToMetricSystem(unit: string) {
  const normalizedUnit = unit.trim().toLowerCase();
  if (normalizedUnit === "pés") return "metros";
  if (normalizedUnit === "milhas") return "quilômetros";
  if (normalizedUnit === "milhas náuticas") return "quilômetros náuticos";

  return normalizedUnit;
}

export function sliceString(input: string, limit?: number) {
  if (!input) return "";

  const maxLength = limit ?? 150;
  if (input.length <= maxLength) return input;

  return input.slice(0, maxLength) + "...";
}

export function randomizeNumber(min: number, max: number) {
  const safeMin = Math.ceil(Math.min(min, max));
  const safeMax = Math.floor(Math.max(min, max));

  return Math.floor(Math.random() * (safeMax - safeMin + 1)) + safeMin;
}

export function generateRandomId(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

export function addPlus(value: number) {
  return value > 0 ? `+${value}` : `${value}`;
}

export function numberToWeight(value?: number) {
  if (!value) return "0 Kg";

  return `${value} Kg`;
}

export function removeFalseOrNullProperties<T extends Record<string, unknown>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) => value !== null && value !== false && value !== undefined,
    ),
  ) as Partial<T>;
}

export function parseObjectToQueryParams(
  obj: Record<string, boolean | number | string | undefined>,
) {
  const object = removeFalseOrNullProperties(obj);
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(object)) {
    searchParams.append(key, String(value));
  }

  const result = searchParams.toString();

  return result;
}
