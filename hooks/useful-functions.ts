export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function compactNumbers(number: number) {
  return number.toLocaleString("en-Us", {
    maximumFractionDigits: 2,
    notation: "compact",
    compactDisplay: "short",
  });
}

export function formatReleaseDate(date: Date, lang: string = "en"): string {
  const rltf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInSeconds = Math.round(diffInMs / 1000);

  const secondsElapsed = diffInSeconds;

  // Add time units and their thresholds in seconds
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  // Find appropriate unit.
  for (const [unit, secondsInUnit] of units) {
    if (Math.abs(secondsElapsed) >= secondsInUnit || unit === "second") {
      const value = Math.round(secondsElapsed / secondsInUnit);
      return rltf.format(value, unit);
    }
  }

  return rltf.format(diffInSeconds, "second");
}

export function getFirstTwoInitials(name: string): string {
  if (!name || typeof name !== "string") {
    return "";
  }

  // Split by spaces and filter out empty strings
  const nameParts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);

  // Get first two parts and extract their first characters
  const initials = nameParts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials;
}