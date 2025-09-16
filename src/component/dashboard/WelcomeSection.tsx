import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import backgroundVideo from "@/assets/images/journey-through-the-mountains.1920x1080.webm";

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
  const [isQuoteVisible, setIsQuoteVisible] = useState(false);

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

    // Nettoyage des timers au démontage du composant
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(quoteTimer);
    };
  }, []);

  return (
    <div className="mb-10">
      {/* Carte Welcome avec vidéo de fond - Taille adaptée */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 backdrop-blur-md shadow-[0_20px_50px_rgba(59,130,246,0.15)] mb-5 min-h-[280px]">
        {/* Vidéo de fond */}
        <video className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline>
          <source src={backgroundVideo} type="video/webm" />
        </video>


        {/* Overlay avec gradient pour la lisibilité */}
        <div className={`absolute inset-0 bg-gradient-to-br ${greeting.gradient} mix-blend-overlay`} />

        {/* Overlay sombre pour améliorer la lisibilité du texte */}
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 p-6 flex items-center h-full">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{greeting.icon}</div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1 drop-shadow-lg">
                {greeting.message}, {userName} !
              </h1>
              {streak > 0 && (
                <div className="flex items-center gap-2 text-blue-100/90 text-base drop-shadow-md">
                  <Flame className="w-5 h-5 text-cyan-400" />
                  {streak} jours de suite
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Citation motivante - Taille adaptée avec animation */}
      <div 
        className={`bg-slate-900/50 rounded-xl p-5 border border-blue-500/30 backdrop-blur-sm transition-all duration-1000 ease-out transform ${
          isQuoteVisible 
            ? 'translate-x-0 opacity-100' 
            : '-translate-x-full opacity-0'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl">💭</div>
          <div>
            <p className="text-blue-50/95 font-medium italic text-lg leading-relaxed drop-shadow-md">"{quote}"</p>
            <p className="text-blue-200/70 text-sm mt-2 drop-shadow-sm">— Conseil du jour</p>
          </div>
        </div>
      </div>
    </div>
  );
};
