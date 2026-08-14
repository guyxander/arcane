export const WAT_TIME_ZONE = "Africa/Lagos";

export function formatWAT(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  },
) {
  const formatted = new Intl.DateTimeFormat("en-NG", {
    ...options,
    timeZone: WAT_TIME_ZONE,
  }).format(new Date(value));
  return `${formatted} WAT (GMT+1)`;
}

export function toWATDateTimeLocal(value: string | Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: WAT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value || "";
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}

export function watLocalToTimestamp(value: unknown) {
  const local = String(value || "");
  if (!local || /(?:Z|[+-]\d{2}:\d{2})$/i.test(local)) return local;
  return `${local.length === 16 ? `${local}:00` : local}+01:00`;
}
