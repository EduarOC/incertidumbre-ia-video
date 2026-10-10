import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Scene } from "../components/Scene";
import { Middle, Pill, Takeaway, useAppear } from "../components/ui";
import { colors, fonts } from "../theme";

const BAR_WIDTH = 1560;
const TARGET = 0.3;

export const Scene03Probability: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bar = useAppear(0.2 * fps);
  // El marcador viaja de 0 a 0,30 con rebote.
  const travel = spring({
    frame: frame - 1 * fps,
    fps,
    config: { damping: 9, stiffness: 90, mass: 0.9 },
  });
  const value = TARGET * travel;
  const pill = useAppear(2.4 * fps, 14);
  const x = value * BAR_WIDTH;

  const tickLabel = (pos: number, top: string, bottom: string) => (
    <div
      style={{
        position: "absolute",
        left: pos * BAR_WIDTH,
        top: 70,
        translate: "-50% 0px",
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          width: 3,
          height: 28,
          backgroundColor: colors.primary,
          margin: "0 auto 12px",
        }}
      />
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 40,
          color: colors.text,
        }}
      >
        {top}
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 500,
          fontSize: 30,
          color: colors.muted,
          marginTop: 4,
        }}
      >
        {bottom}
      </div>
    </div>
  );

  return (
    <Scene label="1 · Probabilidad" title="La incertidumbre se mide de 0 a 1">
      <Middle>
        <div
          style={{
            position: "relative",
            width: BAR_WIDTH,
            height: 200,
            marginTop: 120,
            opacity: bar,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: BAR_WIDTH,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#E2E8F0",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: Math.max(0, x),
                height: "100%",
                backgroundColor: colors.accent,
              }}
            />
          </div>
          {tickLabel(0, "0", "imposible")}
          {tickLabel(0.5, "0,5", "la mitad de las veces")}
          {tickLabel(1, "1", "seguro")}
          {/* Marcador */}
          <div
            style={{
              position: "absolute",
              left: x,
              top: -14,
              width: 84,
              height: 84,
              translate: "-50% 0px",
              borderRadius: 42,
              backgroundColor: colors.card,
              border: `8px solid ${colors.primary}`,
              boxSizing: "border-box",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: x,
              top: -120,
              translate: "-50% 0px",
              opacity: pill,
              scale: String(0.8 + 0.2 * pill),
            }}
          >
            <Pill>P(spam) = 30 %</Pill>
          </div>
        </div>
      </Middle>
      <Takeaway
        text="Todo suma 1: si hay 30 % de spam, hay 70 % de no spam"
        delay={3.6 * fps}
      />
    </Scene>
  );
};
