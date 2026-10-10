import voz from "./voz.json";

// Duración de la transición entre escenas (frames).
export const TRANSITION = 24;

export type Cue = {
  text: string;
  file: string;
  from: number;
  durationInFrames: number;
};

export const SCENES = voz.scenes;

// Frame global en el que empieza cada escena: las transiciones solapan escenas.
export const SCENE_STARTS = SCENES.map(
  (_, i) =>
    SCENES.slice(0, i).reduce((sum, s) => sum + s.durationInFrames, 0) -
    i * TRANSITION,
);

export const TOTAL_FRAMES =
  SCENE_STARTS[SCENES.length - 1] + SCENES[SCENES.length - 1].durationInFrames;

// Tramos globales en los que habla el narrador (para bajar la música).
export const VOICE_SPANS = SCENES.flatMap((scene, i) =>
  scene.cues.map((cue) => [
    SCENE_STARTS[i] + cue.from,
    SCENE_STARTS[i] + cue.from + cue.durationInFrames,
  ]),
);
