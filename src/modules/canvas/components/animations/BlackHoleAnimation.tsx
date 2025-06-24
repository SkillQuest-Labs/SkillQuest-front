// Makes the black hole appear and grow
export const animateBlackHole = (
  tl: gsap.core.Timeline,
  element: HTMLDivElement
) => {
  tl.set(element, { opacity: 1, scale: 0 });
  tl.to(element, { scale: 1.0, duration: 0.9, ease: "back.out(2)" }, 0.1);
};

//  Rotates, shrinks, and makes the node disappear.
export const animateNodeAbsorption = (
  tl: gsap.core.Timeline,
  element: HTMLDivElement
) => {
  tl.to(
    element,
    {
      scale: 0,
      rotate: 1080,
      x: 0,
      y: 0,
      scaleX: 1.2,
      opacity: 0,
      duration: 1.7,
      ease: "power4.inOut",
    },
    0.2
  );
};

export const generateAndAnimateParticles = (
  container: HTMLDivElement | null
) => {
  if (!container) return;

  const particles = Array.from({ length: 50 }).map((_, i) => {
    const p = document.createElement("div");
    p.className =
      "absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-yellow-300 rounded-full pointer-events-none z-50";
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    container.appendChild(p);
    return p;
  });

  particles.forEach((p, i) => {
    const angle = (Math.PI * 2 * i) / particles.length;
    const dist = 100 + Math.random() * 200;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;

    gsap.to(p, {
      x,
      y,
      opacity: 0,
      scale: 0,
      duration: 1.2,
      delay: 0.3 + i * 0.02,
      ease: "power2.out",
      onComplete: () => p.remove(),
    });
  });
};

export const generateKeyframes = (count: number) => {
  return Array.from({ length: count })
    .map((_, i) => {
      function seededRandom(seed: number) {
        const x = Math.sin(seed + 1) * 10000;
        return x - Math.floor(x);
      }
      const top = seededRandom(i) * 100;
      const left = seededRandom(i + 1000) * 100;
      const centerX = 50 - left;
      const centerY = 50 - top;
      return `
          @keyframes dust-${i} {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(${centerX * 2.2}px, ${centerY * 2.2}px) scale(0);
              opacity: 0;
            }
          }
        `;
    })
    .join("\n");
};

export const BlackHoleVisual = () => (
  <div className="absolute inset-0 z-40 pointer-events-none">
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-black rounded-full blur-2xl opacity-0" />
    {Array.from({ length: 300 }).map((_, i) => {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      return (
        <div
          key={i}
          className="absolute w-[2.5px] h-[2.5px] bg-white rounded-full"
          style={{
            top: `${top}%`,
            left: `${left}%`,
            animation: `dust-${i} 0.9s ease-out forwards`,
            animationDelay: `${i * 0.003}s`,
          }}
        />
      );
    })}
    <style>{generateKeyframes(300)}</style>
  </div>
);
