import { useState, useEffect, useRef } from "react";

interface ProgressiveXpProps {
  currentXp: number;
  maxXp: number;
  level?: number; // Optional since it's not used
  animationDuration?: number; // in milliseconds
}

export const useProgressiveXp = ({ currentXp, maxXp, animationDuration = 1000 }: ProgressiveXpProps) => {
  const [animatedXp, setAnimatedXp] = useState(currentXp);
  const [xpGain, setXpGain] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousXpRef = useRef(currentXp);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentXp !== previousXpRef.current) {
      const startXp = previousXpRef.current;
      const endXp = currentXp;
      const gain = endXp - startXp;

      setXpGain(gain);
      setIsAnimating(true);

      startTimeRef.current = performance.now();

      const animate = (currentTime: DOMHighResTimeStamp) => {
        if (!startTimeRef.current) return;

        const elapsedTime = currentTime - startTimeRef.current;
        const progress = Math.min(elapsedTime / animationDuration, 1);

        // Easing function (easeOutCubic)
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        const newXp = startXp + gain * easedProgress;
        setAnimatedXp(newXp);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setAnimatedXp(endXp);
          setIsAnimating(false);
          setXpGain(0);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    previousXpRef.current = currentXp;

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentXp, animationDuration]);

  const xpPercentage = Math.min((animatedXp / maxXp) * 100, 100);

  return { animatedXp, xpPercentage, isAnimating, xpGain };
};
