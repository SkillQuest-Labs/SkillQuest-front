import React from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useGetSessions } from "@/shared/services/session/api-session";
import { useUser } from "@clerk/clerk-react";
import { useMemo } from "react";

interface WorkSessionChartProps {
  className?: string;
}

const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-sm border border-orange-400/30 rounded-lg p-3 shadow-xl">
        <p className="text-orange-300 font-medium">{`Date: ${label}`}</p>
        <p className="text-yellow-300">{`Sessions: ${payload[0].value}`}</p>
        <p className="text-red-300">{`Durée: ${formatDuration(payload[0].payload.duration)}`}</p>
      </div>
    );
  }
  return null;
};

const WorkSessionChart: React.FC<WorkSessionChartProps> = ({ className = "" }) => {
  const { user } = useUser();
  const { sessions, isPending, error } = useGetSessions(user?.id || "", true);

  const chartData = useMemo(() => {
    if (!sessions || sessions.length === 0) return [];

    // Grouper les sessions par date
    const sessionsByDate = sessions.reduce(
      (acc, session) => {
        const date = session.date;
        if (!acc[date]) {
          acc[date] = {
            date,
            sessions: 0,
            totalDuration: 0,
          };
        }
        acc[date].sessions += 1;
        acc[date].totalDuration += session.duration;
        return acc;
      },
      {} as Record<string, { date: string; sessions: number; totalDuration: number }>,
    );

    // Convertir en tableau et trier par date
    return Object.values(sessionsByDate)
      .map((item) => ({
        date: new Date(item.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
        sessions: item.sessions,
        duration: item.totalDuration, // Garder en minutes
      }))
      .sort(
        (a, b) =>
          new Date(a.date.split("/").reverse().join("-")).getTime() -
          new Date(b.date.split("/").reverse().join("-")).getTime(),
      );
  }, [sessions]);

  const stats = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return {
        totalSessions: 0,
        averageDuration: 0,
        bestStreak: 0,
      };
    }

    const totalSessions = sessions.length;
    const averageDuration = sessions.reduce((sum, session) => sum + session.duration, 0) / totalSessions;

    // Calculer la meilleure série
    const sortedDates = [...new Set(sessions.map((s) => s.date))].sort();
    let currentStreak = 1;
    let bestStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currentDate = new Date(sortedDates[i]);
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return {
      totalSessions,
      averageDuration: Math.round(averageDuration), // Garder en minutes
      bestStreak: sortedDates.length > 0 ? bestStreak : 0,
    };
  }, [sessions]);

  if (isPending) {
    return (
      <div
        className={`bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 shadow-2xl h-full flex items-center justify-center ${className}`}
      >
        <div className="text-slate-400">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 shadow-2xl h-full flex items-center justify-center ${className}`}
      >
        <div className="text-red-400">Erreur de chargement</div>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div
        className={`bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 shadow-2xl h-full flex items-center justify-center ${className}`}
      >
        <div className="text-slate-400">Aucune session</div>
      </div>
    );
  }
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-2xl p-6 h-full flex flex-col ${className}`}
    >
      {/* En-tête amélioré */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">
            Sessions de Travail
          </h2>
          <p className="text-slate-400 text-sm">Évolution de votre progression</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-lg"></div>
            <span className="text-slate-300 text-sm font-medium">Sessions</span>
          </div>
        </div>
      </div>

      {/* Graphique étendu */}
      <div className="mb-4 flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#eab308" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sessions"
              stroke="#eab308"
              strokeWidth={3}
              fill="url(#sessionsGradient)"
              dot={{ fill: "#eab308", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: "#eab308", strokeWidth: 2, fill: "#ca8a04" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Statistiques améliorées */}
      <div className="flex justify-between items-center text-sm text-slate-400 flex-shrink-0 bg-slate-800/50 rounded-lg p-3">
        <div className="flex items-center gap-1">
          <span className="text-slate-500">Total:</span>
          <span className="text-orange-400 font-bold text-base">{stats.totalSessions}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-slate-500">Moyenne:</span>
          <span className="text-red-400 font-bold text-base">{formatDuration(stats.averageDuration)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-slate-500">Série:</span>
          <span className="text-yellow-400 font-bold text-base">{stats.bestStreak}</span>
        </div>
      </div>
    </div>
  );
};

export default WorkSessionChart;
