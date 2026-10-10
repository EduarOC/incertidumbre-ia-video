import React from "react";
import {
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Scene } from "../components/Scene";
import { Middle, Takeaway } from "../components/ui";
import { colors, fmt, fonts } from "../theme";

const TOSSES = 1000;
const CHART_W = 1050;
const CHART_H = 430;
const Y_MIN = 0;
const Y_MAX = 1;

// Simulación con semilla fija: proporción acumulada de caras.
const proportions: number[] = (() => {
  let heads = 0;
  const out: number[] = [];
  for (let i = 0; i < TOSSES; i++) {
    if (random(`moneda-${i}`) < 0.5) heads++;
    out.push(heads / (i + 1));
  }
  return out;
})();

const px = (i: number) => (i / (TOSSES - 1)) * CHART_W;
const py = (v: number) => CHART_H - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * CHART_H;

const formatCount = (n: number) =>
  n >= 1000
    ? `${Math.floor(n / 1000)} ${String(n % 1000).padStart(3, "0")}`
    : String(n);

export const Scene04LargeNumbers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.round(
    interpolate(frame, [0.5 * fps, 4 * fps], [1, TOSSES], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }),
  );
  const path = proportions
    .slice(0, n)
    .map(
      (v, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(v).toFixed(1)}`,
    )
    .join(" ");
  const current = proportions[n - 1];
  const axis = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Scene
      label="La ley de los grandes números"
      title="Con más datos, la estimación mejora"
    >
      <Middle>
        <div style={{ display: "flex", gap: 70, alignItems: "flex-start" }}>
          <svg
            width={CHART_W + 110}
            height={CHART_H + 80}
            style={{ overflow: "visible", opacity: axis }}
          >
            <g transform="translate(90 10)">
              {[0, 0.25, 0.5, 0.75, 1].map((v) => (
                <g key={v}>
                  <line
                    x1={0}
                    x2={CHART_W}
                    y1={py(v)}
                    y2={py(v)}
                    stroke={colors.line}
                    strokeWidth={1.5}
                  />
                  <text
                    x={-18}
                    y={py(v)}
                    textAnchor="end"
                    dominantBaseline="central"
                    fill={colors.muted}
                    style={{ fontFamily: fonts.mono, fontSize: 26 }}
                  >
                    {fmt(v, 2)}
                  </text>
                </g>
              ))}
              {[0, 250, 500, 750, 1000].map((t) => (
                <text
                  key={t}
                  x={px(Math.max(0, t - 1))}
                  y={CHART_H + 44}
                  textAnchor="middle"
                  fill={colors.muted}
                  style={{ fontFamily: fonts.mono, fontSize: 26 }}
                >
                  {formatCount(t)}
                </text>
              ))}
              <line
                x1={0}
                x2={CHART_W}
                y1={py(0.5)}
                y2={py(0.5)}
                stroke={colors.accent}
                strokeWidth={4}
                strokeDasharray="16 12"
              />
              <path
                d={path}
                fill="none"
                stroke={colors.teal}
                strokeWidth={5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <circle
                cx={px(n - 1)}
                cy={py(current)}
                r={11}
                fill={colors.primary}
              />
            </g>
          </svg>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 26,
              marginTop: 20,
            }}
          >
            <div
              style={{
                backgroundColor: colors.card,
                border: `3px solid ${colors.primary}`,
                borderRadius: 24,
                padding: "28px 34px",
                width: 380,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 64,
                  color: colors.primary,
                }}
              >
                {formatCount(n)}
              </div>
              <div
                style={{ fontWeight: 500, fontSize: 30, color: colors.muted }}
              >
                lanzamientos
              </div>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 40,
                  color: colors.teal,
                  marginTop: 18,
                  whiteSpace: "nowrap",
                }}
              >
                caras: {fmt(current, 2)}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 28,
                fontWeight: 500,
                color: colors.muted,
              }}
            >
              <svg width={56} height={8}>
                <line
                  x1={0}
                  x2={56}
                  y1={4}
                  y2={4}
                  stroke={colors.accent}
                  strokeWidth={4}
                  strokeDasharray="12 8"
                />
              </svg>
              probabilidad teórica: 0,5
            </div>
          </div>
        </div>
      </Middle>
      <Takeaway
        text="Por eso una IA entrenada con pocos datos se equivoca más"
        delay={3.9 * fps}
      />
    </Scene>
  );
};
