import { LEVEL_COLORS } from "../../skill-tree.type";

export const ConnectionDefs = () => (
  <defs>
    {/* Active connection gradient */}
    <linearGradient id="activeConnection" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#a3e635" stopOpacity="1" /> {/* lime-400 */}
      <stop offset="100%" stopColor="#10b981" stopOpacity="1" /> {/* emerald-500 */}
    </linearGradient>

    {/* Highlighted path gradient */}
    <linearGradient id="pathHighlightConnection" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#f97316" stopOpacity="1" /> {/* Orange-500 */}
      <stop offset="100%" stopColor="#facc15" stopOpacity="1" /> {/* Yellow-500 */}
    </linearGradient>

    {/* Level gradients */}
    {Object.entries(LEVEL_COLORS).map(([, colors]) => (
      <linearGradient
        key={`levelConnection-${colors.connection.substring(1)}`}
        id={`levelConnection-${colors.connection.substring(1)}`}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" stopColor={colors.connection} stopOpacity="0.4" />
        <stop offset="100%" stopColor={colors.connection} stopOpacity="0.4" />
      </linearGradient>
    ))}
  </defs>
);
