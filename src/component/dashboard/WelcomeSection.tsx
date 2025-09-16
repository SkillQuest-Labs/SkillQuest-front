import { useEffect, useState } from "react";
import { Flame, Sunrise, Sun, Sunset, Moon } from "lucide-react";
import backgroundVideo from "@/assets/images/journey-through-the-mountains.1920x1080.webm";
import { MOTIVATIONAL_QUOTES, type MotivationalQuote } from "@/shared/constants/motivational-quotes";

// Configuration optimisée des greetings par période
const GREETING_CONFIGS = {
  morning: {
    message: "Bonjour",
    gradient: "from-slate-900/95 via-blue-900/30 to-violet-900/25",
  },
  afternoon: {
    message: "Bon après-midi",
    gradient: "from-slate-900/95 via-cyan-900/30 to-blue-900/25",
  },
  evening: {
    message: "Bonsoir",
    gradient: "from-slate-900/95 via-violet-900/30 to-indigo-900/25",
  },
} as const;

const getTimeBasedGreeting = (): { message: string; gradient: string } => {
  const hour = new Date().getHours();

  // Optimisation : utilisation d'une logique plus claire et efficace
  if (hour >= 4 && hour < 13) {
    return GREETING_CONFIGS.morning;
  } else if (hour >= 13 && hour < 18) {
    return GREETING_CONFIGS.afternoon;
  } else {
    return GREETING_CONFIGS.evening;
  }
};

// Fonction optimisée pour calculer le prochain changement de greeting
const getNextGreetingChange = (currentDate: Date): Date => {
  const now = new Date(currentDate);
  const hour = now.getHours();

  // Heures de changement : 4h, 13h, 18h
  const changeHours = [4, 13, 18];

  // Trouver la prochaine heure de changement aujourd'hui
  const nextHour = changeHours.find((h) => h > hour);

  if (nextHour) {
    // Prochain changement aujourd'hui
    const nextChange = new Date(now);
    nextChange.setHours(nextHour, 0, 0, 0);
    return nextChange;
  } else {
    // Prochain changement demain à 4h
    const nextChange = new Date(now);
    nextChange.setDate(nextChange.getDate() + 1);
    nextChange.setHours(4, 0, 0, 0);
    return nextChange;
  }
};

type WelcomeSectionProps = {
  userName: string;
  streak: number;
};

export const WelcomeSection = ({ userName, streak = 0 }: WelcomeSectionProps) => {
  const [quote, setQuote] = useState<MotivationalQuote | null>(null);
  const [greeting, setGreeting] = useState(getTimeBasedGreeting());
  const [isQuoteVisible, setIsQuoteVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Citation aléatoire au chargement
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);

    // Animation de la citation avec délai
    const quoteTimer = setTimeout(() => {
      setIsQuoteVisible(true);
    }, 1000); // Délai de 1 seconde après le chargement

    // Fonction de mise à jour du greeting
    const updateGreeting = () => {
      setGreeting(getTimeBasedGreeting());
    };

    // Mise à jour immédiate
    updateGreeting();

    // Calculer le prochain changement de greeting
    const nextChange = getNextGreetingChange(new Date());
    const timeUntilNext = nextChange.getTime() - Date.now();

    // Programmer la prochaine mise à jour
    const timeoutId = setTimeout(() => {
      updateGreeting();

      // Après le premier changement, programmer les mises à jour quotidiennes
      setInterval(updateGreeting, 24 * 60 * 60 * 1000);
    }, timeUntilNext);

    // Timer pour l'heure
    const timeTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Nettoyage des timers au démontage du composant
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(quoteTimer);
      clearInterval(timeTimer);
    };
  }, []);

  const getTimeIcon = () => {
    const hour = currentTime.getHours();

    if (hour >= 4 && hour < 8) {
      return <Sunrise className="w-4 h-4 text-orange-400" />;
    } else if (hour >= 8 && hour < 17) {
      return <Sun className="w-4 h-4 text-yellow-400" />;
    } else if (hour >= 17 && hour < 20) {
      return <Sunset className="w-4 h-4 text-orange-500" />;
    } else {
      return <Moon className="w-4 h-4 text-blue-300" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Carte Welcome avec vidéo de fond - Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 backdrop-blur-md shadow-[0_20px_50px_rgba(59,130,246,0.15)] min-h-[320px]">
        {/* Vidéo de fond */}
        <video className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline>
          <source src={backgroundVideo} type="video/webm" />
        </video>

        {/* Overlay avec gradient pour la lisibilité */}
        <div className={`absolute inset-0 bg-gradient-to-br ${greeting.gradient} mix-blend-overlay`} />

        {/* Overlay sombre pour améliorer la lisibilité du texte */}
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 p-6 flex items-center h-full">
          <div>
            <h1 className="text-3xl lg:text-4xl font-semibold text-white mb-1 drop-shadow-lg">
              {greeting.message} {userName} !
            </h1>
          </div>

          {/* Widget d'heure en haut à droite */}
          <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 rounded-lg px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              {getTimeIcon()}
              <span className="text-white text-sm font-medium">{formatTime(currentTime)}</span>
            </div>
            
            {/* Streak sous le widget d'heure */}
            {streak > 0 && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-600/30">
                <Flame 
                  className={`w-4 h-4 transition-all duration-300 ${
                    streak >= 7 
                      ? "text-orange-500 drop-shadow-lg" 
                      : streak >= 3 
                      ? "text-orange-400" 
                      : "text-orange-300"
                  }`} 
                />
                <span className="text-white/80 text-xs font-medium">
                  x{streak}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Citation motivante - Section inspirante */}
      <div
        className={`bg-slate-900/50 rounded-xl p-4 border border-blue-500/30 backdrop-blur-sm transition-all duration-1000 ease-out transform ${
          isQuoteVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        <div className="flex items-start gap-2">
          <div className="text-xl">💭</div>
          <div>
            <p className="text-blue-50/95 font-medium italic text-base leading-relaxed drop-shadow-md">
              "{quote?.text}"
            </p>
            <p className="text-blue-200/70 text-xs mt-1 drop-shadow-sm">— {quote?.author}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
