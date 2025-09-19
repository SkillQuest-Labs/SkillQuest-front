export type XpTimeSeriesPoint = {
  label: string;
  tooltipLabel: string;
  xp: number;
};

export type TimePeriod = "days" | "weeks" | "months" | "years";

export const periodLabels: Record<TimePeriod, string> = {
  days: "Jours",
  weeks: "Semaines",
  months: "Mois",
  years: "Années",
};
