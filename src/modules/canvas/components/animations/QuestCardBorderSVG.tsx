import React from "react";

export const QuestCardBorderSVG: React.FC = () => (
  <svg
    viewBox="0 0 400 600"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 w-full h-full pointer-events-none z-0"
    preserveAspectRatio="none"
  >
    <path
      d="M20,0 H380 C390,0 400,10 400,20 V580 C400,590 390,600 380,600 H20 C10,600 0,590 0,580 V20 C0,10 10,0 20,0 Z
           M40,40 H360 V560 H40 Z"
      fill="none"
      stroke="rgba(255,255,255,0.2)"
      strokeWidth="8"
    />
  </svg>
);
