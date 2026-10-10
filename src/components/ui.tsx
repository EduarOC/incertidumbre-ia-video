import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";
import { Words } from "./Words";

// Progreso 0 → 1 con resorte suave a partir de un frame dado.
export const useAppear = (delay: number, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

// Progreso 0 → 1 con desaceleración entre dos frames.
export const useRamp = (start: number, end: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
};

// Frase de cierre de una escena: entra palabra por palabra.
export const Takeaway: React.FC<{
  text: string;
  delay: number;
  style?: React.CSSProperties;
}> = ({ text, delay, style }) => {
  const line = useRamp(delay, delay + 12);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        fontFamily: fonts.body,
        fontWeight: 800,
        fontSize: 40,
        lineHeight: 1.25,
        color: colors.text,
        ...style,
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: 7,
          flexShrink: 0,
          backgroundColor: colors.accent,
          scale: String(line),
        }}
      />
      <div>
        <Words text={text} delay={delay} />
      </div>
    </div>
  );
};

export const Pill: React.FC<{
  children: React.ReactNode;
  color?: string;
  textColor?: string;
  style?: React.CSSProperties;
}> = ({ children, color = colors.accent, textColor = "#FFFFFF", style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "12px 28px",
      borderRadius: 999,
      backgroundColor: color,
      color: textColor,
      fontFamily: fonts.mono,
      fontWeight: 500,
      fontSize: 36,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

// Tarjeta que se «enciende»: entra y su borde pasa de gris a azul.
export const LitCard: React.FC<{
  delay: number;
  accent?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay, accent = colors.primary, style, children }) => {
  const p = useAppear(delay);
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: colors.card,
        borderRadius: 24,
        border: `3px solid ${p > 0.5 ? accent : colors.line}`,
        boxShadow: `0 ${18 * p}px ${40 * p}px rgba(20, 40, 60, ${0.1 * p})`,
        opacity: p,
        translate: `${(1 - p) * 60}px 0px`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -11,
          left: 36,
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: accent,
          border: `4px solid ${colors.background}`,
          scale: String(p),
        }}
      />
      {children}
    </div>
  );
};

// Centra verticalmente el bloque principal en el espacio libre de la escena.
export const Middle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      paddingBottom: 30,
    }}
  >
    {children}
  </div>
);
