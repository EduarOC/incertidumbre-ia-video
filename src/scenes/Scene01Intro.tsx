import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Scene } from "../components/Scene";
import { useAppear, useRamp } from "../components/ui";
import { colors, fonts } from "../theme";

const CENTER = { x: 1430, y: 610 };
const NODES = [
  { x: 1430, y: 250, color: colors.primary },
  { x: 1770, y: 470, color: colors.teal },
  { x: 1660, y: 900, color: colors.orange },
  { x: 1190, y: 910, color: colors.accent },
  { x: 1090, y: 450, color: colors.primary },
];

const Node: React.FC<{ x: number; y: number; color: string; i: number }> = ({
  x,
  y,
  color,
  i,
}) => {
  const p = useAppear(4 + i * 6, 14);
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`}>
      <circle r={34} fill={colors.card} stroke={color} strokeWidth={6} />
      <circle r={12} fill={color} />
    </g>
  );
};

const Link: React.FC<{ x: number; y: number; i: number }> = ({ x, y, i }) => {
  const p = useRamp(10 + i * 6, 34 + i * 6);
  return (
    <line
      x1={x}
      y1={y}
      x2={x + (CENTER.x - x) * p}
      y2={y + (CENTER.y - y) * p}
      stroke={colors.primary}
      strokeOpacity={0.45}
      strokeWidth={3}
    />
  );
};

export const Scene01Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const center = useAppear(0, 14);
  // Latido suave (0,8 por segundo, muy por debajo de 3 Hz).
  const beat = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 2 * 0.8);

  return (
    <Scene
      label="Incertidumbre en Inteligencia Artificial"
      title="¿Cómo piensa una IA cuando no está segura?"
      titleStatic
      titleMaxWidth={900}
      overlay={
        <AbsoluteFill>
          <svg width={1920} height={1080}>
            {NODES.map((n, i) => (
              <Link key={i} x={n.x} y={n.y} i={i} />
            ))}
            {NODES.map((n, i) => (
              <Node key={i} x={n.x} y={n.y} color={n.color} i={i} />
            ))}
            <g
              transform={`translate(${CENTER.x} ${CENTER.y}) scale(${
                center * beat
              })`}
            >
              <circle r={150} fill={colors.primary} fillOpacity={0.1} />
              <circle r={110} fill={colors.primary} />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                y={6}
                fill="#FFFFFF"
                style={{
                  fontFamily: fonts.title,
                  fontWeight: 800,
                  fontSize: 130,
                }}
              >
                ?
              </text>
            </g>
          </svg>
        </AbsoluteFill>
      }
    />
  );
};
