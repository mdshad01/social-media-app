export interface FormatOptions {
  showTodayLabel?: boolean;
  locale?: string;
}

export function formatActivityDate(
  isoString: string,
  options: FormatOptions = {}
): string {
  const { showTodayLabel = false, locale } = options;

  const d = new Date(isoString);
  const now = new Date();

  // midnight of date in local timezone
  const startOf = (dt: Date) =>
    new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());

  const daysDiff = Math.round(
    (startOf(now).getTime() - startOf(d).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Today → show time
  if (daysDiff === 0) {
    const time = d.toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "2-digit",
    });
    return showTodayLabel ? `Today, ${time}` : time;
  }

  // Yesterday
  if (daysDiff === 1) return "Yesterday";

  // Within last 7 days → weekday name
  if (daysDiff > 1 && daysDiff < 7) {
    return d.toLocaleDateString(locale, { weekday: "long" });
  }

  // Older → 20 Oct 2025
  return d.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
