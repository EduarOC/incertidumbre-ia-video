import { Audio } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  getStaticFiles,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Scene01Intro } from "./scenes/Scene01Intro";
import { Scene02Everywhere } from "./scenes/Scene02Everywhere";
import { Scene03Probability } from "./scenes/Scene03Probability";
import { Scene04LargeNumbers } from "./scenes/Scene04LargeNumbers";
import { Scene05Bayes } from "./scenes/Scene05Bayes";
import { Scene06Order } from "./scenes/Scene06Order";
import { Scene07NaiveBayes } from "./scenes/Scene07NaiveBayes";
import { Scene08Network } from "./scenes/Scene08Network";
import { Scene09Summary } from "./scenes/Scene09Summary";
import { Scene10Closing } from "./scenes/Scene10Closing";
import { colors } from "./theme";

const MUSIC = "musica.mp3";

// Banda sonora opcional: solo suena si existe public/musica.mp3.
const Soundtrack: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const hasMusic = getStaticFiles().some((f) => f.name === MUSIC);
  if (!hasMusic) {
    return null;
  }
  return (
    <Audio
      src={staticFile(MUSIC)}
      volume={(f) =>
        interpolate(f, [durationInFrames - 2 * fps, durationInFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};

export const IncertidumbreIA: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <Sequence name="1 · Intro" durationInFrames={4 * fps} premountFor={fps}>
        <Scene01Intro />
      </Sequence>
      <Sequence
        name="2 · Todas partes"
        from={4 * fps}
        durationInFrames={8 * fps}
        premountFor={fps}
      >
        <Scene02Everywhere />
      </Sequence>
      <Sequence
        name="3 · Probabilidad"
        from={12 * fps}
        durationInFrames={6 * fps}
        premountFor={fps}
      >
        <Scene03Probability />
      </Sequence>
      <Sequence
        name="4 · Grandes números"
        from={18 * fps}
        durationInFrames={6 * fps}
        premountFor={fps}
      >
        <Scene04LargeNumbers />
      </Sequence>
      <Sequence
        name="5 · Bayes"
        from={24 * fps}
        durationInFrames={6 * fps}
        premountFor={fps}
      >
        <Scene05Bayes />
      </Sequence>
      <Sequence
        name="6 · El orden importa"
        from={30 * fps}
        durationInFrames={6 * fps}
        premountFor={fps}
      >
        <Scene06Order />
      </Sequence>
      <Sequence
        name="7 · Naïve Bayes"
        from={36 * fps}
        durationInFrames={6 * fps}
        premountFor={fps}
      >
        <Scene07NaiveBayes />
      </Sequence>
      <Sequence
        name="8 · Redes bayesianas"
        from={42 * fps}
        durationInFrames={8 * fps}
        premountFor={fps}
      >
        <Scene08Network />
      </Sequence>
      <Sequence
        name="9 · Cuadro comparativo"
        from={50 * fps}
        durationInFrames={6 * fps}
        premountFor={fps}
      >
        <Scene09Summary />
      </Sequence>
      <Sequence
        name="10 · Cierre"
        from={56 * fps}
        durationInFrames={4 * fps}
        premountFor={fps}
      >
        <Scene10Closing />
      </Sequence>
      <Soundtrack />
    </AbsoluteFill>
  );
};
