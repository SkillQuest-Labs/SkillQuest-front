import React, { useEffect, useRef } from "react";
import { COLORS } from "../skills.const";

type SparkleParticlesProps = {
  count?: number;
  className?: string;
};

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

export const SparkleParticles: React.FC<SparkleParticlesProps> = ({ count = 16, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      const size = randomBetween(3, 7);
      const left = randomBetween(0, 100);
      const duration = randomBetween(1.8, 3.2);
      const delay = randomBetween(0, 2);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      particle.style.position = "absolute";
      particle.style.left = `${left}%`;
      particle.style.bottom = "0";
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.borderRadius = "50%";
      particle.style.background = color;
      particle.style.opacity = "0.85";
      particle.style.pointerEvents = "none";
      particle.style.boxShadow = `0 0 6px 2px ${color}`;
      particle.style.animation = `sparkle-float ${duration}s linear ${delay}s infinite`;
      container.appendChild(particle);
      particles.push(particle);
    }
    return () => {
      particles.forEach((p) => container.removeChild(p));
    };
  }, [count]);

  return (
    <div
      ref={containerRef}
      className={"pointer-events-none absolute left-0 right-0 top-[-32px] h-8 w-full z-20 " + (className || "")}
      aria-hidden
    />
  );
};
