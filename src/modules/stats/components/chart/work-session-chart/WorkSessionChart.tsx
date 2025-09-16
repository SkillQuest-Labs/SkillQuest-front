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
      <div className="bg-slate-800/95 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-3 shadow-xl">
        <p className="text-cyan-300 font-medium">{`Date: ${label}`}</p>
        <p className="text-blue-300">{`Sessions: ${payload[0].value}`}</p>
        <p className="text-violet-300">{`Durée: ${formatDuration(payload[0].payload.duration)}`}</p>
      </div>
    );
  }
  return null;
};

const WorkSessionChart: React.FC<WorkSessionChartProps> = ({ className = "" }) => {
  const { user } = useUser();
  const { sessions, isPending, error } = useGetSessions(user?.id || "");

  console.log("sessions", sessions);

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
        className={`bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl ${className}`}
      >
        <div className="flex items-center justify-center" style={{ height: '345px' }}>
          <div className="text-slate-400">Chargement des données...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl ${className}`}
      >
        <div className="flex items-center justify-center" style={{ height: '345px' }}>
          <div className="text-red-400">Erreur lors du chargement des données</div>
        </div>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div
        className={`bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl ${className}`}
      >
        <div className="flex items-center justify-center" style={{ height: '345px' }}>
          <div className="text-slate-400">Aucune session trouvée</div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-slate-700/50 shadow-2xl p-4 h-full flex flex-col ${className}`}
    >
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            📊 Sessions de Travail
          </h2>
          <p className="text-slate-400 text-xs">Évolution de vos sessions de travail</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
            <span className="text-slate-300 text-xs">Sessions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-400 to-purple-500"></div>
            <span className="text-slate-300 text-xs">Durée (min)</span>
          </div>
        </div>
      </div>

      <div className="mb-4 flex-1 min-h-0" style={{ height: '450px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sessions"
              stroke="#06b6d4"
              strokeWidth={3}
              fill="url(#sessionsGradient)"
              dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#06b6d4", strokeWidth: 2, fill: "#0891b2" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-shrink-0">
        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-400/30">
          <div className="text-xl font-bold text-blue-400 mb-1">{stats.totalSessions}</div>
          <div className="text-xs text-slate-400">Sessions totales</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-400/30">
          <div className="text-xl font-bold text-violet-400 mb-1">{formatDuration(stats.averageDuration)}</div>
          <div className="text-xs text-slate-400">Durée moyenne</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30">
          <div className="text-xl font-bold text-cyan-400 mb-1">{stats.bestStreak}</div>
          <div className="text-xs text-slate-400">Meilleure série</div>
        </div>
      </div>
    </div>
  );
};

export default WorkSessionChart;
