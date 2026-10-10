import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  getStaticFiles,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Narrated } from "./components/Cues";
import { sweep } from "./components/Sweep";
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
import {
  SCENE_STARTS,
  SCENES,
  TOTAL_FRAMES,
  TRANSITION,
  VOICE_SPANS,
} from "./timing";

const MUSIC = "musica.mp3";
const MUSIC_LEVEL = 0.32;
const MUSIC_UNDER_VOICE = 0.13;

// Música de fondo que baja cuando habla el narrador y se apaga al final.
const Soundtrack: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const hasMusic = getStaticFiles().some((f) => f.name === MUSIC);
  if (!hasMusic) {
    return null;
  }
  const ramp = 0.35 * fps;
  return (
    <Audio
      src={staticFile(MUSIC)}
      volume={(f) => {
        const ducking = Math.max(
          0,
          ...VOICE_SPANS.map(([start, end]) =>
            interpolate(
              f,
              [start - ramp, start, end, end + ramp],
              [0, 1, 1, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          ),
        );
        const level = MUSIC_LEVEL - (MUSIC_LEVEL - MUSIC_UNDER_VOICE) * ducking;
        const fadeIn = interpolate(f, [0, fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fadeOut = interpolate(
          f,
          [durationInFrames - 2 * fps, durationInFrames],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        return level * fadeIn * fadeOut;
      }}
    />
  );
};

// Línea de progreso inferior con un punto por escena.
const ProgressRail: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const progress = frame / TOTAL_FRAMES;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: width * progress,
          height: 6,
          backgroundColor: colors.accent,
        }}
      />
      {SCENE_STARTS.slice(1).map((start) => {
        const reached = frame >= start;
        return (
          <div
            key={start}
            style={{
              position: "absolute",
              left: (start / TOTAL_FRAMES) * width - 5,
              bottom: -2,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: reached ? colors.accent : colors.line,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const timing = linearTiming({
  durationInFrames: TRANSITION,
  easing: Easing.inOut(Easing.cubic),
});

export const IncertidumbreIA: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="1 · Intro"
          durationInFrames={SCENES[0].durationInFrames}
          premountFor={fps}
        >
          <Narrated cues={SCENES[0].cues}>
            <Scene01Intro />
          </Narrated>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={sweep()} timing={timing} />
        <TransitionSeries.Sequence
          name="2 · Todas partes"
          durationInFrames={SCENES[1].durationInFrames}
          premountFor={fps}
        >
          <Narrated cues={SCENES[1].cues}>
            <Scene02Everywhere />
          </Narrated>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={sweep()} timing={timing} />
        <TransitionSeries.Sequence
          name="3 · Probabilidad"
          durationInFrames={SCENES[2].durationInFrames}
          premountFor={fps}
        >
          <Narrated cues={SCENES[2].cues}>
            <Scene03Probability />
          </Narrated>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={sweep()} timing={timing} />
        <TransitionSeries.Sequence
          name="4 · Grandes números"
          durationInFrames={SCENES[3].durationInFrames}
          premountFor={fps}
        >
          <Narrated cues={SCENES[3].cues}>
            <Scene04LargeNumbers />
          </Narrated>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={sweep()} timing={timing} />
        <TransitionSeries.Sequence
          name="5 · Bayes"
          durationInFrames={SCENES[4].durationInFrames}
          premountFor={fps}
        >
          <Narrated cues={SCENES[4].cues}>
            <Scene05Bayes />
          </Narrated>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={sweep()} timing={timing} />
        <TransitionSeries.Sequence
          name="6 · El orden importa"
          durationInFrames={SCENES[5].durationInFrames}
          premountFor={fps}
        >
          <Narrated cues={SCENES[5].cues}>
            <Scene06Order />
          </Narrated>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={sweep()} timing={timing} />
        <TransitionSeries.Sequence
          name="7 · Naïve Bayes"
          durationInFrames={SCENES[6].durationInFrames}
          premountFor={fps}
        >
          <Narrated cues={SCENES[6].cues}>
            <Scene07NaiveBayes />
          </Narrated>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={sweep()} timing={timing} />
        <TransitionSeries.Sequence
          name="8 · Redes bayesianas"
          durationInFrames={SCENES[7].durationInFrames}
          premountFor={fps}
        >
          <Narrated cues={SCENES[7].cues}>
            <Scene08Network />
          </Narrated>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={sweep()} timing={timing} />
        <TransitionSeries.Sequence
          name="9 · Cuadro comparativo"
          durationInFrames={SCENES[8].durationInFrames}
          premountFor={fps}
        >
          <Narrated cues={SCENES[8].cues}>
            <Scene09Summary />
          </Narrated>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={sweep()} timing={timing} />
        <TransitionSeries.Sequence
          name="10 · Cierre"
          durationInFrames={SCENES[9].durationInFrames}
          premountFor={fps}
        >
          <Narrated cues={SCENES[9].cues}>
            <Scene10Closing />
          </Narrated>
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <ProgressRail />
      <Soundtrack />
    </AbsoluteFill>
  );
};
