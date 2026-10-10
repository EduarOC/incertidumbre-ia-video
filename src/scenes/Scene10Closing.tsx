import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Scene } from "../components/Scene";
import { useAppear, useRamp } from "../components/ui";
import { Words } from "../components/Words";
import { colors } from "../theme";

const CHAIN = [
  { x: 1340, y: 300 },
  { x: 1500, y: 430 },
  { x: 1420, y: 600 },
  { x: 1600, y: 720 },
  { x: 1720, y: 560 },
];

const ChainNode: React.FC<{ i: number; last: boolean }> = ({ i, last }) => {
  const { fps } = useVideoConfig();
  const p = useAppear(0.3 * fps + i * 5, 14);
  const { x, y } = CHAIN[i];
  return last ? (
    <g transform={`translate(${x} ${y}) scale(${p})`}>
      <circle r={52} fill={colors.accent} fillOpacity={0.18} />
      <circle r={30} fill={colors.accent} />
    </g>
  ) : (
    <g transform={`translate(${x} ${y}) scale(${p})`}>
      <circle
        r={24}
        fill={colors.card}
        stroke={colors.primary}
        strokeWidth={6}
      />
    </g>
  );
};

const ChainLink: React.FC<{ i: number }> = ({ i }) => {
  const { fps } = useVideoConfig();
  const p = useRamp(0.3 * fps + i * 5 + 3, 0.3 * fps + i * 5 + 12);
  const a = CHAIN[i];
  const b = CHAIN[i + 1];
  return (
    <line
      x1={a.x}
      y1={a.y}
      x2={a.x + (b.x - a.x) * p}
      y2={a.y + (b.y - a.y) * p}
      stroke={colors.primary}
      strokeOpacity={0.5}
      strokeWidth={4}
    />
  );
};

export const Scene10Closing: React.FC = () => {
  const { fps } = useVideoConfig();
  const underline = useRamp(1.2 * fps, 2 * fps);

  return (
    <Scene
      title="La IA no sabe: calcula qué es más probable"
      titleSize={110}
      titleMaxWidth={1080}
      centered
      overlay={
        <AbsoluteFill>
          <svg width={1920} height={1080}>
            {CHAIN.slice(0, -1).map((_, i) => (
              <ChainLink key={i} i={i} />
            ))}
            {CHAIN.map((_, i) => (
              <ChainNode key={i} i={i} last={i === CHAIN.length - 1} />
            ))}
          </svg>
        </AbsoluteFill>
      }
    >
      <div
        style={{
          width: 560 * underline,
          height: 12,
          borderRadius: 6,
          backgroundColor: colors.accent,
        }}
      />
      <div
        style={{
          marginTop: 40,
          fontWeight: 500,
          fontSize: 38,
          color: colors.text,
        }}
      >
        <Words
          text="Probabilidad · Bayes · Naïve Bayes · Redes bayesianas"
          delay={1.6 * fps}
        />
      </div>
    </Scene>
  );
};
