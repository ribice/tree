import type { Locale } from "../i18n/ui";

export interface DateSpan {
  born?: string;
  died?: string;
}

function yearFrom(value: string | undefined): number | null {
  const match = value?.match(/\d{4}/);
  return match ? Number(match[0]) : null;
}

export function isLikelyLivingDateSpan(
  span: DateSpan,
  nowYear = new Date().getFullYear(),
): boolean {
  if (span.died || !span.born) return false;
  const born = yearFrom(span.born);
  // A birth value with no readable year cannot be shown to be historical.
  if (born === null) return true;
  return born >= nowYear - 105;
}

export function publicDate(value: string | undefined, living: boolean): string {
  if (!value) return "";
  if (!living) return value;
  return value.match(/\d{4}/)?.[0] ?? "";
}

/** Lifespan for a raw date span, reduced to the birth year for living people. */
export function publicLifespanFor(span: DateSpan, locale: Locale = "bs"): string {
  return publicLifespan(span, isLikelyLivingDateSpan(span), locale);
}

export function publicLifespan(
  span: DateSpan,
  living: boolean,
  locale: Locale = "bs",
): string {
  const born = publicDate(span.born, living);
  const died = publicDate(span.died, false);
  const bornPrefix = locale === "en" ? "b. " : "r. ";
  const diedPrefix = locale === "en" ? "d. " : "u. ";
  if (born && died) return `${born} – ${died}`;
  if (born) return `${bornPrefix}${born}`;
  if (died) return `${diedPrefix}${died}`;
  return "";
}
