import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

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

// Configuration optimisée des greetings par période
const GREETING_CONFIGS = {
  morning: {
    message: "Bonjour",
    icon: "🌅",
    gradient: "from-slate-900/95 via-blue-900/30 to-violet-900/25",
  },
  afternoon: {
    message: "Bon après-midi",
    icon: "☀️",
    gradient: "from-slate-900/95 via-cyan-900/30 to-blue-900/25",
  },
  evening: {
    message: "Bonsoir",
    icon: "🌙",
    gradient: "from-slate-900/95 via-violet-900/30 to-indigo-900/25",
  },
} as const;

const getTimeBasedGreeting = (): { message: string; icon: string; gradient: string } => {
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
  const [quote, setQuote] = useState("");
  const [greeting, setGreeting] = useState(getTimeBasedGreeting());

  useEffect(() => {
    // Citation aléatoire au chargement
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);

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

    // Nettoyage des timers au démontage du composant
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${greeting.gradient} border border-blue-500/20 backdrop-blur-md shadow-[0_20px_50px_rgba(59,130,246,0.15)] mb-8`}
    >
      <div className="relative z-10 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">{greeting.icon}</div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
              {greeting.message}, {userName} !
            </h1>
            {streak > 0 && (
              <div className="flex items-center gap-1 text-blue-100/80 text-sm">
                <Flame className="w-4 h-4 text-cyan-400" />
                {streak} jours de suite
              </div>
            )}
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
      </div>
    </div>
  );
};
