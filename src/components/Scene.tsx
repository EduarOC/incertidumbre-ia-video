import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../theme";
import { Words } from "./Words";

const DotGrid: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: colors.background,
      backgroundImage: `radial-gradient(circle, rgba(31, 78, 121, 0.16) 2.4px, transparent 2.6px)`,
      backgroundSize: "56px 56px",
      backgroundPosition: "28px 28px",
    }}
  />
);

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

  return (
    <AbsoluteFill>
      <DotGrid />
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
