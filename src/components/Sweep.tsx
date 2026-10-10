import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { colors } from "../theme";

type SweepProps = Record<string, never>;

const SKEW = 260;
const BAND = 150;

// Barrido diagonal: una banda coral y otra azul cruzan la pantalla y
// descubren la escena siguiente; la anterior retrocede un poco.
const SweepPresentation: React.FC<
  TransitionPresentationComponentProps<SweepProps>
> = ({ children, presentationDirection, presentationProgress: p }) => {
  const { width, height } = useVideoConfig();

  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill
        style={{
          scale: String(1 - 0.05 * p),
          translate: `${-120 * p}px 0px`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  const edge = interpolate(p, [0, 1], [width + 40, -SKEW - 2 * BAND - 40]);
  const band = (from: number, to: number) =>
    `polygon(${from + SKEW}px 0px, ${to + SKEW}px 0px, ${to}px ${height}px, ${from}px ${height}px)`;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: band(edge + 2 * BAND, width + SKEW),
          translate: `${(1 - p) * 80}px 0px`,
        }}
      >
        {children}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: colors.primary,
          clipPath: band(edge + BAND, edge + 2 * BAND),
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: colors.accent,
          clipPath: band(edge, edge + BAND),
        }}
      />
    </AbsoluteFill>
  );
};

export const sweep = (): TransitionPresentation<SweepProps> => ({
  component: SweepPresentation,
  props: {},
});
