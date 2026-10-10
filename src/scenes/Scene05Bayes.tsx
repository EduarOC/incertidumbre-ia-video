import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useCue } from "../components/Cues";
import { Scene } from "../components/Scene";
import { Middle, Pill, useAppear, useRamp } from "../components/ui";
import { colors, fmt, fonts } from "../theme";

const PLOT_H = 420;
const BAR_W = 220;
const BAR1_X = 60;
const BAR2_X = 480;

const Bar: React.FC<{
  x: number;
  value: number;
  color: string;
  label: string;
  opacity: number;
}> = ({ x, value, color, label, opacity }) => (
  <g opacity={opacity}>
    <rect
      x={x}
      y={PLOT_H - value * PLOT_H}
      width={BAR_W}
      height={value * PLOT_H}
      rx={14}
      fill={color}
    />
    <text
      x={x + BAR_W / 2}
      y={PLOT_H - value * PLOT_H - 22}
      textAnchor="middle"
      fill={colors.text}
      style={{ fontFamily: fonts.mono, fontSize: 44, fontWeight: 500 }}
    >
      {fmt(value * 100)} %
    </text>
    <text
      x={x + BAR_W / 2}
      y={PLOT_H + 52}
      textAnchor="middle"
      fill={colors.muted}
      style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 32 }}
    >
      {label}
    </text>
  </g>
);

export const Scene05Bayes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const prior = useCue(1);
  const clue = useCue(2);
  const update = useCue(3);
  const bar1 = useRamp(prior, prior + 0.7 * fps);
  const pill = useAppear(clue, 14);
  const note = useAppear(clue + 0.4 * fps);
  const arrow = useRamp(update, update + 0.8 * fps);
  const bar2Visible = useAppear(update);
  // La segunda barra crece contando de 30,0 % a 77,4 %.
  const bar2 = interpolate(
    frame,
    [update + 0.5 * fps, update + 1.9 * fps],
    [0.3, 0.774],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 3),
    },
  );
  const formula = useAppear(useCue(4));

  const startX = BAR1_X + BAR_W / 2;
  const startY = PLOT_H - 0.3 * PLOT_H - 80;
  const endX = BAR2_X + BAR_W / 2;
  const endY = PLOT_H - 0.774 * PLOT_H - 84;

  return (
    <Scene label="2 · Teorema de Bayes" title="Una pista cambia lo que creemos">
      <Middle>
        <div style={{ display: "flex", gap: 90, alignItems: "flex-start" }}>
          <svg
            width={740}
            height={PLOT_H + 80}
            style={{ overflow: "visible", flexShrink: 0 }}
          >
            <line
              x1={0}
              x2={740}
              y1={PLOT_H}
              y2={PLOT_H}
              stroke={colors.line}
              strokeWidth={3}
            />
            <Bar
              x={BAR1_X}
              value={0.3 * bar1}
              color={colors.primary}
              label="Antes de leer"
              opacity={1}
            />
            <Bar
              x={BAR2_X}
              value={bar2}
              color={colors.accent}
              label="Con «gratis»"
              opacity={bar2Visible}
            />
            <path
              d={`M ${startX} ${startY} C ${startX + 40} ${endY - 90}, ${
                endX - 160
              } ${endY - 90}, ${endX - 30} ${endY}`}
              fill="none"
              stroke={colors.primary}
              strokeWidth={4}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - arrow}
            />
            <polygon
              points="0,-12 22,0 0,12"
              fill={colors.primary}
              opacity={arrow > 0.95 ? 1 : 0}
              transform={`translate(${endX - 34} ${endY}) rotate(20)`}
            />
          </svg>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 26,
              paddingTop: 20,
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 500, color: colors.muted }}>
              Llega una pista:
            </div>
            <div
              style={{
                opacity: pill,
                translate: `${(1 - pill) * 80}px 0px`,
              }}
            >
              <Pill style={{ fontSize: 48 }}>gratis</Pill>
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 38,
                color: colors.text,
                opacity: note,
              }}
            >
              aparece en el 80 % del spam
            </div>
            <div
              style={{
                marginTop: 50,
                padding: "26px 34px",
                borderRadius: 20,
                backgroundColor: "#FFF4EE",
                border: `3px solid ${colors.accent}`,
                fontFamily: fonts.mono,
                fontWeight: 500,
                fontSize: 38,
                color: colors.text,
                whiteSpace: "nowrap",
                opacity: formula,
                translate: `0px ${(1 - formula) * 30}px`,
              }}
            >
              P(A | B) = P(B | A) × P(A) ÷ P(B)
            </div>
          </div>
        </div>
      </Middle>
    </Scene>
  );
};
