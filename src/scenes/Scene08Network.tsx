import React from "react";
import {
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useCue } from "../components/Cues";
import { Scene } from "../components/Scene";
import { Middle, Takeaway, useAppear, useRamp } from "../components/ui";
import { colors, fmt, fonts } from "../theme";

const R = 104;
const RAIN = { x: 180, y: 140 };
const SPRINKLER = { x: 760, y: 140 };
const GRASS = { x: 470, y: 480 };

const NetNode: React.FC<{
  x: number;
  y: number;
  label: string[];
  appear: number;
  fill: string;
  textColor: string;
}> = ({ x, y, label, appear, fill, textColor }) => (
  <g transform={`translate(${x} ${y}) scale(${appear})`}>
    <circle r={R} fill={fill} stroke={colors.primary} strokeWidth={5} />
    {label.map((line, i) => (
      <text
        key={i}
        y={(i - (label.length - 1) / 2) * 40}
        textAnchor="middle"
        dominantBaseline="central"
        fill={textColor}
        style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 34 }}
      >
        {line}
      </text>
    ))}
  </g>
);

const Arrow: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  progress: number;
}> = ({ from, to, progress }) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const sx = from.x + ux * (R + 8);
  const sy = from.y + uy * (R + 8);
  const ex = to.x - ux * (R + 14);
  const ey = to.y - uy * (R + 14);
  const cx = sx + (ex - sx) * progress;
  const cy = sy + (ey - sy) * progress;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <g>
      <line
        x1={sx}
        y1={sy}
        x2={cx}
        y2={cy}
        stroke={colors.muted}
        strokeWidth={5}
      />
      <polygon
        points="-24,-14 0,0 -24,14"
        fill={colors.muted}
        opacity={progress > 0.98 ? 1 : 0}
        transform={`translate(${ex} ${ey}) rotate(${angle})`}
      />
    </g>
  );
};

const Caption: React.FC<{ text: string; opacity: number }> = ({
  text,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      opacity,
      fontWeight: 800,
      fontSize: 36,
      lineHeight: 1.25,
      color: colors.text,
    }}
  >
    {text}
  </div>
);

export const Scene08Network: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  } as const;

  const rain = useAppear(0.2 * fps, 14);
  const sprinkler = useAppear(0.45 * fps, 14);
  const grass = useAppear(0.7 * fps, 14);
  const arrows = useRamp(1 * fps, 1.7 * fps);
  const panel = useAppear(useCue(1));
  const takeaway = useCue(4);
  const wet = useCue(2) + 0.5 * fps;
  const sprinklerOn = useCue(3) + 0.6 * fps;

  // Paso 1: se observa el pasto mojado. Paso 2: el aspersor estaba encendido.
  const t1 = [wet, wet + 1 * fps];
  const t2 = [sprinklerOn, sprinklerOn + 1 * fps];
  const value =
    frame < t2[0]
      ? interpolate(frame, t1, [20, 45.7], clamp)
      : interpolate(frame, t2, [45.7, 23.6], clamp);

  const grassFill = interpolateColors(
    frame,
    [t1[0], t1[0] + 10],
    [colors.card, colors.accent],
  );
  const sprinklerFill = interpolateColors(
    frame,
    [t2[0], t2[0] + 10],
    [colors.card, colors.primary],
  );
  const grassObserved = frame >= t1[0] + 5;
  const sprinklerObserved = frame >= t2[0] + 5;

  // El texto anterior sale por completo antes de que entre el siguiente.
  const c1 = interpolate(frame, [t1[0], t1[0] + 6], [1, 0], clamp);
  const c2 =
    interpolate(frame, [t1[0] + 6, t1[0] + 12], [0, 1], clamp) *
    interpolate(frame, [t2[0], t2[0] + 6], [1, 0], clamp);
  const c3 = interpolate(frame, [t2[0] + 6, t2[0] + 12], [0, 1], clamp);

  return (
    <Scene label="4 · Redes bayesianas" title="Un mapa de causas y efectos">
      <Middle>
        <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
          <svg
            width={940}
            height={600}
            style={{ overflow: "visible", flexShrink: 0 }}
          >
            <Arrow from={RAIN} to={GRASS} progress={arrows} />
            <Arrow from={SPRINKLER} to={GRASS} progress={arrows} />
            <NetNode
              x={RAIN.x}
              y={RAIN.y}
              label={["Lluvia"]}
              appear={rain}
              fill={colors.card}
              textColor={colors.primary}
            />
            <NetNode
              x={SPRINKLER.x}
              y={SPRINKLER.y}
              label={["Aspersor"]}
              appear={sprinkler}
              fill={sprinklerFill}
              textColor={sprinklerObserved ? "#FFFFFF" : colors.primary}
            />
            <NetNode
              x={GRASS.x}
              y={GRASS.y}
              label={["Pasto", "mojado"]}
              appear={grass}
              fill={grassFill}
              textColor={grassObserved ? "#FFFFFF" : colors.primary}
            />
          </svg>
          <div
            style={{
              flex: 1,
              backgroundColor: colors.card,
              border: `3px solid ${colors.primary}`,
              borderRadius: 28,
              padding: "40px 48px",
              opacity: panel,
              translate: `${(1 - panel) * 60}px 0px`,
            }}
          >
            <div
              style={{ fontWeight: 800, fontSize: 44, color: colors.primary }}
            >
              ¿Llovió?
            </div>
            <div
              style={{
                fontFamily: fonts.mono,
                fontWeight: 500,
                fontSize: 140,
                lineHeight: 1.1,
                marginTop: 12,
                color: colors.accent,
              }}
            >
              {fmt(value)} %
            </div>
            <div style={{ position: "relative", height: 100, marginTop: 18 }}>
              <Caption text="No sabemos nada" opacity={c1} />
              <Caption text="Vemos el pasto mojado" opacity={c2} />
              <Caption text="Y el aspersor estaba encendido" opacity={c3} />
            </div>
          </div>
        </div>
      </Middle>
      <Takeaway
        text="Otra explicación hace menos necesaria la lluvia"
        delay={takeaway}
      />
    </Scene>
  );
};
