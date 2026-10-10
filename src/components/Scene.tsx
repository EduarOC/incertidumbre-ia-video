import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../theme";
import { Words } from "./Words";

// Fondo vivo: la retícula se desplaza despacio y dos manchas de luz flotan.
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${70 + 8 * Math.sin(t * 0.35)}% ${
            30 + 10 * Math.cos(t * 0.3)
          }%, rgba(42, 157, 143, 0.10), transparent 38%), radial-gradient(circle at ${
            20 + 10 * Math.cos(t * 0.25)
          }% ${80 + 8 * Math.sin(t * 0.4)}%, rgba(231, 111, 81, 0.08), transparent 40%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle, rgba(31, 78, 121, 0.16) 2.4px, transparent 2.6px)`,
          backgroundSize: "56px 56px",
          backgroundPosition: `${28 - t * 6}px ${28 - t * 3}px`,
        }}
      />
    </AbsoluteFill>
  );
};

type SceneProps = {
  label?: string;
  title: string;
  titleSize?: number;
  titleMaxWidth?: number;
  // En la primera escena el título debe verse completo desde el frame 0.
  titleStatic?: boolean;
  children?: React.ReactNode;
  // Contenido que se posiciona libremente sobre toda la escena.
  overlay?: React.ReactNode;
  centered?: boolean;
};

export const Scene: React.FC<SceneProps> = ({
  label,
  title,
  titleSize = 96,
  titleMaxWidth = 1680,
  titleStatic = false,
  children,
  overlay,
  centered = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const accent = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });

  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill
        style={{
          // Acercamiento continuo y leve para que nada quede congelado.
          scale: interpolate(frame, [0, durationInFrames], [1, 1.015], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <AbsoluteFill
          style={{
            padding: "84px 120px 72px",
            display: "flex",
            flexDirection: "column",
            justifyContent: centered ? "center" : "flex-start",
            color: colors.text,
            fontFamily: fonts.body,
          }}
        >
          {label ? (
            <div
              style={{
                fontFamily: fonts.mono,
                fontWeight: 500,
                fontSize: 28,
                letterSpacing: 1,
                color: colors.primary,
                marginBottom: 14,
                opacity: titleStatic
                  ? 1
                  : interpolate(frame, [0, 8], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 44 * (titleStatic ? 1 : accent),
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.accent,
                  marginRight: 18,
                  verticalAlign: "middle",
                }}
              />
              {label}
            </div>
          ) : null}
          <div
            style={{
              fontFamily: fonts.title,
              fontWeight: 800,
              fontSize: titleSize,
              lineHeight: 1.04,
              letterSpacing: -1.5,
              color: colors.primary,
              maxWidth: titleMaxWidth,
            }}
          >
            {titleStatic ? title : <Words text={title} />}
          </div>
          {children ? (
            <div
              style={{
                flex: centered ? undefined : 1,
                display: "flex",
                flexDirection: "column",
                marginTop: 40,
                minHeight: 0,
              }}
            >
              {children}
            </div>
          ) : null}
        </AbsoluteFill>
        {overlay}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
