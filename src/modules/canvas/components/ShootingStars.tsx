import { useEffect, useState } from "react";

type Star = {
  id: number;
  top: number;
  left: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
};

export default function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const newStar: Star = {
        id,
        top: Math.random() * 80,
        left: Math.random() * 100,
        x: 100 + Math.random() * 80,
        y: 100 + Math.random() * 80,
        duration: 1.5 + Math.random(),
        delay: Math.random() * 1.5,
      };

      setStars((prev) => [...prev, newStar]);

      setTimeout(
        () => {
          setStars((prev) => prev.filter((s) => s.id !== id));
        },
        (newStar.duration + newStar.delay) * 1000,
      );
    }, 900); // 1 étoile toutes les 0.9s

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          className="shooting-star"
          style={
            {
              top: `${star.top}vh`,
              left: `${star.left}vw`,
              "--x": `${star.x}vw`,
              "--y": `${star.y}vh`,
              "--duration": `${star.duration}s`,
              "--delay": `${star.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
}
