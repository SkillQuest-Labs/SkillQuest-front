import ReactECharts from "echarts-for-react";
import { BarChart3, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getLineChartOption } from "./chart-option.const";
import { Button } from "@/shared/components/ui/button";
import { useGetSessions } from "@/shared/services/session/api-session";
import { useUser } from "@clerk/clerk-react";
import { periodLabels, type TimePeriod } from "./type";
import { buildXpSeries, calculateTrend, TrendInfo } from "./skill-experience-chart.const";

export const SkillExperienceChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("days");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chartOpacity, setChartOpacity] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { user } = useUser();
  const { sessions } = useGetSessions(user?.id || "", true);

  const chartData = useMemo(() => buildXpSeries(sessions, selectedPeriod), [sessions, selectedPeriod]);
  const trend = calculateTrend(chartData);
  const chartOptions = useMemo(() => getLineChartOption({ data: chartData }), [chartData]);
  const hasXpData = chartData.some((point) => point.xp > 0);

  const periodLabel = (periodLabels[selectedPeriod] ?? "période").toLowerCase();

  const trendInfoData = useMemo(() => {
    return TrendInfo(trend, hasXpData, periodLabel);
  }, [hasXpData, periodLabel, trend]);

  const handlePeriodChange = (period: TimePeriod) => {
    if (period === selectedPeriod) {
      setIsDropdownOpen(false);
      return;
    }

    setIsTransitioning(true);
    setChartOpacity(0);

    setTimeout(() => {
      setSelectedPeriod(period);
      setIsDropdownOpen(false);
    }, 200);
  };

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setChartOpacity(1);
        setIsTransitioning(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [selectedPeriod, isTransitioning]);

  const TrendIcon = trendInfoData.icon;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-600/40 bg-gradient-to-br from-slate-900/70 via-slate-900/45 to-slate-900/80 shadow-lg shadow-black/30">
      <div className="flex flex-col gap-4 border-b border-slate-700/40 bg-slate-900/50 px-6 py-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-cyan-500/25 blur" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-500/40 bg-slate-900/80">
              <BarChart3 className="h-6 w-6 text-cyan-200" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Tendance XP</h3>
            <p className="text-xs text-slate-400">Évolution de votre expérience sur la période choisie</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div
            className={`flex min-w-[220px] flex-col rounded-lg border px-4 py-3 shadow-inner ${trendInfoData.chipClass}`}
          >
            <div className="flex items-center justify-between">
              <span className={`flex items-center gap-2 text-sm font-semibold ${trendInfoData.colorClass}`}>
                <TrendIcon className="h-4 w-4" />
                {trendInfoData.title}
              </span>
              <span className={`text-sm font-semibold ${trendInfoData.colorClass}`}>{trendInfoData.valueLabel}</span>
            </div>
            <p className="mt-1 text-xs text-slate-300">{trendInfoData.description}</p>
          </div>

          <div className="relative">
            <Button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer rounded-lg border border-cyan-500/30 bg-slate-900/60 px-4 py-2 text-sm font-medium text-cyan-200 transition-colors duration-200 hover:bg-cyan-600/30 hover:text-white"
            >
              <span>{periodLabels[selectedPeriod]}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </Button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-40 overflow-hidden rounded-lg border border-slate-700/60 bg-slate-900/95 shadow-2xl backdrop-blur">
                {Object.entries(periodLabels).map(([period, label]) => (
                  <Button
                    key={period}
                    onClick={() => handlePeriodChange(period as TimePeriod)}
                    className={`flex w-full items-center justify-between cursor-pointer px-4 py-2 text-sm transition-colors duration-150 ${
                      selectedPeriod === period
                        ? "bg-cyan-600/30 text-cyan-200"
                        : "text-slate-200 hover:bg-slate-800/80"
                    }`}
                  >
                    <span>{label}</span>
                    {selectedPeriod === period && <span className="text-xs uppercase text-cyan-300">Actif</span>}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 px-6 py-5">
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-slate-700/40 bg-slate-900/60">
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          <div className="flex-1">
            {hasXpData ? (
              <div className="h-full transition-opacity duration-300 ease-out" style={{ opacity: chartOpacity }}>
                <ReactECharts
                  option={chartOptions}
                  style={{ height: "100%", width: "100%" }}
                  opts={{
                    renderer: "svg",
                    devicePixelRatio: typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2,
                  }}
                  notMerge
                  lazyUpdate
                />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-cyan-200/70">
                Aucun gain d'XP enregistré sur cette période.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
