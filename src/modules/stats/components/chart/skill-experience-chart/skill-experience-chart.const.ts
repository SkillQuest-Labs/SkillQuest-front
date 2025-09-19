import type { Session } from "@/shared/services/session/api-session.type";
import type { TimePeriod, XpTimeSeriesPoint } from "./type";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

export type TrendResult = {
  trend: "up" | "down" | "stable";
  percentage: number;
  label: string;
};

export const BUCKET_COUNT: Record<TimePeriod, number> = {
  days: 6,
  weeks: 6,
  months: 6,
  years: 5,
};

const startOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const startOfWeek = (date: Date) => {
  const result = startOfDay(date);
  const day = result.getDay();
  const diff = (day + 6) % 7;
  result.setDate(result.getDate() - diff);
  return result;
};

const startOfMonth = (date: Date) => {
  const result = startOfDay(date);
  result.setDate(1);
  return result;
};

const startOfYear = (date: Date) => {
  const result = startOfDay(date);
  result.setMonth(0, 1);
  return result;
};

export const getStartOfPeriod = (date: Date, period: TimePeriod) => {
  switch (period) {
    case "days":
      return startOfDay(date);
    case "weeks":
      return startOfWeek(date);
    case "months":
      return startOfMonth(date);
    case "years":
      return startOfYear(date);
    default:
      return startOfDay(date);
  }
};

export const subtractPeriod = (date: Date, period: TimePeriod, amount: number) => {
  const result = new Date(date);
  switch (period) {
    case "days":
      result.setDate(result.getDate() - amount);
      break;
    case "weeks":
      result.setDate(result.getDate() - amount * 7);
      break;
    case "months":
      result.setMonth(result.getMonth() - amount);
      break;
    case "years":
      result.setFullYear(result.getFullYear() - amount);
      break;
  }
  return getStartOfPeriod(result, period);
};

const getIsoWeek = (date: Date) => {
  const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = tempDate.getUTCDay() || 7;
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { week, year: tempDate.getUTCFullYear() };
};

export const formatAxisLabel = (date: Date, period: TimePeriod) => {
  switch (period) {
    case "days":
      return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
    case "weeks": {
      const { week } = getIsoWeek(date);
      return `S${week.toString().padStart(2, "0")}`;
    }
    case "months":
      return date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
    case "years":
      return date.getFullYear().toString();
    default:
      return "";
  }
};

export const formatTooltipLabel = (date: Date, period: TimePeriod) => {
  switch (period) {
    case "days":
      return date.toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long" });
    case "weeks": {
      const { week, year } = getIsoWeek(date);
      const endOfWeek = new Date(date);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      const startLabel = date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
      const endLabel = endOfWeek.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
      return `Semaine ${week} ${year} (du ${startLabel} au ${endLabel})`;
    }
    case "months":
      return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    case "years":
      return date.getFullYear().toString();
    default:
      return "";
  }
};

const getSessionDate = (session: Session) => {
  const isoDate = session.startTime || session.date || session.endTime;
  return isoDate ? new Date(isoDate) : new Date();
};

export const buildXpSeries = (sessions: Session[] | undefined, period: TimePeriod): XpTimeSeriesPoint[] => {
  const safeSessions = sessions ?? [];
  const xpMap = new Map<number, number>();

  safeSessions.forEach((session) => {
    const xp = session.totalXpEarned ?? 0;
    if (xp <= 0) {
      return;
    }

    const sessionDate = getStartOfPeriod(getSessionDate(session), period);
    const key = sessionDate.getTime();
    xpMap.set(key, (xpMap.get(key) ?? 0) + xp);
  });

  const now = getStartOfPeriod(new Date(), period);
  const buckets: XpTimeSeriesPoint[] = [];
  const bucketCount = BUCKET_COUNT[period];

  for (let i = bucketCount - 1; i >= 0; i--) {
    const bucketDate = subtractPeriod(now, period, i);
    const xp = xpMap.get(bucketDate.getTime()) ?? 0;
    buckets.push({
      label: formatAxisLabel(bucketDate, period),
      tooltipLabel: formatTooltipLabel(bucketDate, period),
      xp,
    });
  }

  return buckets;
};

const findFirstNonZero = (points: XpTimeSeriesPoint[]) => points.find((point) => point.xp > 0);

const findLastNonZero = (points: XpTimeSeriesPoint[]) => {
  for (let i = points.length - 1; i >= 0; i--) {
    if (points[i].xp > 0) {
      return points[i];
    }
  }
  return undefined;
};

export const calculateTrend = (data: XpTimeSeriesPoint[]): TrendResult => {
  if (data.length < 2) {
    return { trend: "stable", percentage: 0, label: "Stable" };
  }

  const first = findFirstNonZero(data);
  const last = findLastNonZero(data);

  if (!first || !last) {
    return { trend: "stable", percentage: 0, label: "Stable" };
  }

  const firstValue = first.xp;
  const lastValue = last.xp;

  if (firstValue === lastValue) {
    return { trend: "stable", percentage: 0, label: "Stable" };
  }

  const rawPercentage = ((lastValue - firstValue) / firstValue) * 100;
  const percentage = Math.abs(rawPercentage) < 0.5 ? 0 : rawPercentage;

  if (percentage > 5) {
    return {
      trend: "up",
      percentage,
      label: percentage > 25 ? "Forte progression" : first === data[0] ? "Progression" : "Progression récente",
    };
  }

  if (percentage < -5) {
    return {
      trend: "down",
      percentage,
      label: percentage < -25 ? "Grosse baisse" : first === data[0] ? "Ralentissement" : "Ralentissement récent",
    };
  }

  return {
    trend: "stable",
    percentage,
    label: first === data[0] ? "Stable" : "Stabilisation",
  };
};

export const TrendInfo = (trend: TrendResult, hasXpData: boolean, periodLabel: string) => {
  if (!hasXpData) {
    return {
      icon: Minus,
      title: "En attente de données",
      description: "Aucune session validée sur cette période pour analyser la tendance.",
      colorClass: "text-slate-300",
      chipClass: "border-slate-600/60 bg-slate-900/70",
      valueLabel: "0%",
    } as const;
  }

  // const percentage = Number.isFinite(trend.percentage) ? trend.percentage : 0;
  const abs = Math.abs(trend.percentage);
  const precision = abs >= 10 ? 0 : 1;
  const formatted = trend.percentage === 0 ? "0%" : `${trend.percentage > 0 ? "+" : "-"}${abs.toFixed(precision)}%`;
  const absoluteLabel = `${abs.toFixed(precision)}%`;

  if (trend.trend === "up") {
    return {
      icon: ArrowUpRight,
      title: trend.label,
      description:
        trend.label === "Premier gain"
          ? "Tu démarres cette période avec de nouveaux gains d'XP."
          : `${formatted} d'XP par rapport au début des ${periodLabel}. Continue comme ça !`,
      colorClass: "text-emerald-300",
      chipClass: "border-emerald-500/40 bg-emerald-500/10",
      valueLabel: formatted,
    } as const;
  }

  if (trend.trend === "down") {
    return {
      icon: ArrowDownRight,
      title: trend.label,
      description: `-${absoluteLabel} d'XP par rapport au dernier plus haut pic d'XP atteint. Accroche-toi, l'important c'est de ne rien lâcher !`,
      colorClass: "text-rose-300",
      chipClass: "border-rose-500/40 bg-rose-500/10",
      valueLabel: formatted,
    } as const;
  }

  return {
    icon: Minus,
    title: trend.label,
    description: `${formatted} d'XP par rapport au début des ${periodLabel}. Niveau d'effort constant.`,
    colorClass: "text-cyan-200",
    chipClass: "border-cyan-500/40 bg-cyan-500/10",
    valueLabel: formatted,
  } as const;
};
