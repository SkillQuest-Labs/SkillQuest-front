import type { SkillTreeOptions } from "../../skill-tree.type";

type SpiralPoint = {
  x: number;
  y: number;
  radius: number;
  angle: number;
  index: number;
};

type SpiralSVGProps = {
  spiralPoints: SpiralPoint[];
  maxRadius: number;
  centerX: number;
  centerY: number;
  options?: SkillTreeOptions;
  containerWidth?: number;
  containerHeight?: number;
};

export const SpiralSVG = ({
  spiralPoints,
  maxRadius,
  centerX,
  centerY,
  options,
  containerWidth,
  containerHeight,
}: SpiralSVGProps) => {
  // Générer le chemin de la spirale
  const generateSpiralPath = () => {
    if (spiralPoints.length === 0) return "";

    let path = `M ${centerX} ${centerY}`;

    spiralPoints.forEach((point, index) => {
      if (index === 0) {
        path += ` L ${point.x} ${point.y}`;
      } else {
        // Utiliser des courbes de Bézier pour un tracé plus fluide
        const prevPoint = spiralPoints[index - 1];
        const controlX1 = prevPoint.x + (point.x - prevPoint.x) * 0.3;
        const controlY1 = prevPoint.y + (point.y - prevPoint.y) * 0.3;
        const controlX2 = prevPoint.x + (point.x - prevPoint.x) * 0.7;
        const controlY2 = prevPoint.y + (point.y - prevPoint.y) * 0.7;

        path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${point.x} ${point.y}`;
      }
    });

    return path;
  };

  // Générer des segments de spirale pour les effets visuels
  const generateSpiralSegments = () => {
    const segments = [];
    const segmentCount = Math.min(spiralPoints.length, 8); // Limiter le nombre de segments
    const pointsPerSegment = Math.ceil(spiralPoints.length / segmentCount);

    for (let i = 0; i < segmentCount; i++) {
      const startIndex = i * pointsPerSegment;
      const endIndex = Math.min(startIndex + pointsPerSegment, spiralPoints.length);
      const segmentPoints = spiralPoints.slice(startIndex, endIndex);

      if (segmentPoints.length > 0) {
        segments.push({
          points: segmentPoints,
          opacity: 0.8 - i * 0.1,
          strokeWidth: 3 - i * 0.2,
        });
      }
    }

    return segments;
  };

  const spiralPath = generateSpiralPath();
  const spiralSegments = generateSpiralSegments();

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none z-0"
      viewBox={`0 0 ${containerWidth} ${containerHeight}`}
    >
      {/* Define gradients and filters */}
      <defs>
        <radialGradient id="spiralGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#1e40af" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
        </radialGradient>

        <linearGradient id="spiralStrokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="30%" stopColor="#3b82f6" />
          <stop offset="70%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>

        <filter id="spiralGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="spiralShadow">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#1e3a8a" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background glow effect */}
      <circle
        cx={centerX}
        cy={centerY}
        r={maxRadius + 30}
        fill="url(#spiralGradient)"
        opacity="0.2"
        filter="url(#spiralGlow)"
      />

      {/* Main spiral path */}
      <path
        d={spiralPath}
        fill="none"
        stroke="url(#spiralStrokeGradient)"
        strokeWidth="4"
        strokeOpacity="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#spiralGlow)"
        style={{
          animation: options?.animationEnabled ? "spiralPulse 4s ease-in-out infinite" : "none",
        }}
      />

      {/* Additional spiral segments for depth */}
      {spiralSegments.map((segment, index) => (
        <path
          key={index}
          d={`M ${centerX} ${centerY} ${segment.points.map((p) => `L ${p.x} ${p.y}`).join(" ")}`}
          fill="none"
          stroke="#60a5fa"
          strokeWidth={segment.strokeWidth}
          strokeOpacity={segment.opacity * 0.6}
          strokeLinecap="round"
          strokeDasharray={`${4 + index},${2 + index}`}
          style={{
            animation: options?.animationEnabled ? `spiralFlow ${8 + index * 2}s linear infinite` : "none",
          }}
        />
      ))}

      {/* Spiral node markers */}
      {spiralPoints.map((point, index) => (
        <g key={index}>
          <circle cx={point.x} cy={point.y} r="3" fill="#60a5fa" opacity="0.6" filter="url(#spiralShadow)" />
          <circle cx={point.x} cy={point.y} r="1.5" fill="#ffffff" opacity="0.8" />
        </g>
      ))}

      <style>{`
        @keyframes spiralPulse {
          0%, 100% {
            stroke-opacity: 0.7;
            stroke-width: 4;
          }
          50% {
            stroke-opacity: 1;
            stroke-width: 5;
          }
        }

        @keyframes spiralFlow {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 20;
          }
        }
      `}</style>
    </svg>
  );
};
