import { Audio } from "@remotion/media";
import React, { createContext, useContext } from "react";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import type { Cue } from "../timing";

const CueContext = createContext<Cue[]>([]);

// Envuelve una escena con sus frases narradas y reproduce la voz.
export const Narrated: React.FC<{ cues: Cue[]; children: React.ReactNode }> = ({
  cues,
  children,
}) => {
  const { fps } = useVideoConfig();
  return (
    <CueContext.Provider value={cues}>
      {children}
      {cues.map((cue) => (
        <Sequence
          key={cue.file}
          name={`Voz: ${cue.text}`}
          from={cue.from}
          durationInFrames={cue.durationInFrames + 5}
          premountFor={fps}
        >
          <Audio src={staticFile(cue.file)} />
        </Sequence>
      ))}
    </CueContext.Provider>
  );
};

// Frame (local a la escena) en que el narrador empieza la frase `i`.
export const useCue = (i: number) => {
  const cues = useContext(CueContext);
  return cues[i]?.from ?? 0;
};

// Frame en que el narrador termina la frase `i`.
export const useCueEnd = (i: number) => {
  const cues = useContext(CueContext);
  const cue = cues[i];
  return cue ? cue.from + cue.durationInFrames : 0;
};
