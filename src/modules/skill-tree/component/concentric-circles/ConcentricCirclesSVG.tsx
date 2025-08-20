import type { SkillTreeOptions } from "../../skill-tree.type";

type ConcentricCirclesProps = {
  rings: number[];
  centerX: number;
  centerY: number;
  options?: SkillTreeOptions;
};

export const ConcentricCirclesSVG = ({ rings, centerX, centerY, options }: ConcentricCirclesProps) => {
  return (
    <svg
      className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none z-0"
      viewBox="0 0 1200 800"
    >
      {/* Define gradients */}
      <defs>
        <radialGradient id="circleGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#1e40af" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
        </radialGradient>

        <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background glow effect */}
      <circle
        cx={centerX}
        cy={centerY}
        r={Math.max(...rings) + 20}
        fill="url(#circleGradient)"
        opacity="0.3"
        filter="url(#glow)"
      />

      {rings.map((radius, index) => (
        <g key={index}>
          {/* Main circle with gradient stroke */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="url(#strokeGradient)"
            strokeWidth="3"
            strokeOpacity="0.9"
            strokeDasharray={`${8 + index * 2},${6 + index}`}
            filter="url(#glow)"
            style={{
              animation: options?.animationEnabled ? `rotate ${70 + index * 7}s linear infinite` : "none",
              transformOrigin: `${centerX}px ${centerY}px`,
            }}
          />

          {/* Inner glow circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius - 2}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="1"
            strokeOpacity="0.3"
          />

          {/* Outer highlight */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 1}
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.5"
            strokeOpacity="0.2"
          />
        </g>
      ))}

      <style>{`
      @keyframes rotate {
        from {
        transform: rotate(0deg);
        }
        to {
        transform: rotate(360deg);
        }
      }

      @keyframes pulse {
        0%,
        100% {
        opacity: 0.7;
        }
        50% {
        opacity: 1;
        }
      }
      `}</style>
    </svg>
  );
};
