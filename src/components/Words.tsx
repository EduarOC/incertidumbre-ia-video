import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

type WordsProps = {
  text: string;
  // Momento (en frames) en que entra la primera palabra.
  delay?: number;
  style?: React.CSSProperties;
};

// El texto entra palabra por palabra desde la derecha, 110 ms entre palabras.
export const Words: React.FC<WordsProps> = ({ text, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <span style={style}>
      {words.map((word, i) => {
        const progress = spring({
          frame: frame - delay - i * 0.11 * fps,
          fps,
          config: { damping: 200 },
          durationInFrames: 0.5 * fps,
        });
        return (
          <React.Fragment key={i}>
            <span
              style={{
                display: "inline-block",
                opacity: progress,
                translate: `${(1 - progress) * 60}px 0px`,
                whiteSpace: "pre",
              }}
            >
              {word}
            </span>
            {i < words.length - 1 ? " " : null}
          </React.Fragment>
        );
      })}
    </span>
  );
};
