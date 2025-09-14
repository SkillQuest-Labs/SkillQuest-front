import { useEffect, useState } from "react";
import { Sparkles, Flame, Star } from "lucide-react";

const MOTIVATIONAL_QUOTES = [
  "Chaque quête accomplie te rapproche de la maîtrise !",
  "Les vrais héros se forgent dans l'adversité.",
  "Ton potentiel n'a pas de limites, aventurier !",
  "Chaque niveau gagné est une victoire sur toi-même.",
  "L'excellence n'est pas un acte, mais une habitude.",
  "Les légendes commencent par un premier pas.",
  "Transforme tes défis en opportunités de croissance.",
  "Seuls ceux qui osent échouer peuvent réussir grandement.",
];

const getTimeBasedGreeting = (): { message: string; icon: string; gradient: string } => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return {
      message: "Bon matin",
      icon: "🌅",
      gradient: "from-slate-900/95 via-blue-900/30 to-violet-900/25",
    };
  } else if (hour < 18) {
    return {
      message: "Bon après-midi",
      icon: "☀️",
      gradient: "from-slate-900/95 via-cyan-900/30 to-blue-900/25",
    };
  } else {
    return {
      message: "Bonsoir",
      icon: "🌙",
      gradient: "from-slate-900/95 via-violet-900/30 to-indigo-900/25",
    };
  }
};

type WelcomeSectionProps = {
  userName: string;
  userLevel: number;
  streak: number;
};
export const WelcomeSection = ({ userName, userLevel, streak = 0 }: WelcomeSectionProps) => {
  const [quote, setQuote] = useState("");
  const [greeting, setGreeting] = useState(getTimeBasedGreeting());

  useEffect(() => {
    // Citation aléatoire au chargement
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);

    // Mise à jour du greeting
    setGreeting(getTimeBasedGreeting());
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${greeting.gradient} border border-blue-500/20 backdrop-blur-md shadow-[0_20px_50px_rgba(59,130,246,0.15)] mb-8`}
    >
      {/* Effets de particules */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-4 left-8 w-2 h-2 bg-blue-400/70 rounded-full animate-pulse" />
        <div className="absolute top-12 right-12 w-1 h-1 bg-cyan-400/70 rounded-full animate-ping" />
        <div className="absolute bottom-8 left-16 w-1.5 h-1.5 bg-violet-400/70 rounded-full animate-bounce" />
        <div className="absolute bottom-16 right-8 w-1 h-1 bg-blue-300/70 rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl animate-bounce">{greeting.icon}</div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                {greeting.message}, {userName} !
              </h1>
              <div className="flex items-center gap-2 text-blue-100/80 text-sm">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400" />
                  Niveau {userLevel}
                </span>
                {streak > 0 && (
                  <span className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-cyan-400" />
                    {streak} jours de suite
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <Sparkles className="w-12 h-12 text-blue-400/70 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
        </div>

        {/* Citation motivante */}
        <div className="bg-slate-900/40 rounded-xl p-4 border border-blue-500/20 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💭</div>
            <div>
              <p className="text-blue-50/95 font-medium italic text-lg leading-relaxed">"{quote}"</p>
              <p className="text-blue-200/60 text-sm mt-2">— Conseil du jour</p>
            </div>
          </div>
        </div>

        {/* Indicateurs de progression */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-500/20 px-2 py-1 rounded-full border border-cyan-400/40">
              <span className="text-cyan-200 text-xs font-medium">🎯 Prêt pour l'aventure</span>
            </div>
          </div>

          <div className="text-blue-200/60 text-xs">Dernière connexion: {new Date().toLocaleDateString("fr-FR")}</div>
        </div>
      </div>
    </div>
  );
};
