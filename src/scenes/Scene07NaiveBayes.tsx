import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useCue } from "../components/Cues";
import { Scene } from "../components/Scene";
import { LitCard, Middle, Pill, Takeaway, useAppear } from "../components/ui";
import { colors, fmt, fonts } from "../theme";

const Row: React.FC<{
  delay: number;
  label: string;
  calc: string;
  result: string;
  color: string;
}> = ({ delay, label, calc, result, color }) => {
  const p = useAppear(delay);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 24,
        opacity: p,
        translate: `${(1 - p) * 60}px 0px`,
        fontFamily: fonts.mono,
        fontWeight: 500,
        fontSize: 42,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 250,
          flexShrink: 0,
          fontFamily: fonts.body,
          fontWeight: 800,
          color,
        }}
      >
        {label} →
      </span>
      <span style={{ color: colors.text }}>{calc} =</span>
      <span style={{ color }}>{result}</span>
    </div>
  );
};

export const Scene07NaiveBayes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const message = useCue(1);
  const result = useCue(2);
  const takeaway = useCue(3);
  const word1 = useAppear(message + 0.4 * fps, 14);
  const word2 = useAppear(message + 0.7 * fps, 14);
  const barIn = useAppear(result);
  const fill = interpolate(
    frame,
    [result + 0.2 * fps, result + 1.3 * fps],
    [0, 0.976],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 3),
    },
  );
  const labels = useAppear(result + 1.1 * fps);

  return (
    <Scene label="3 · Naïve Bayes" title="Muchas pistas, una por una">
      <Middle>
        <div style={{ display: "flex", gap: 56, alignItems: "center" }}>
          <LitCard
            delay={0.2 * fps}
            style={{ padding: "34px 40px", width: 460, flexShrink: 0 }}
          >
            <div
              style={{ fontWeight: 800, fontSize: 34, color: colors.primary }}
            >
              Mensaje nuevo:
            </div>
            <div
              style={{
                fontWeight: 500,
                fontSize: 34,
                marginTop: 6,
                color: colors.text,
              }}
            >
              «gratis premio»
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 22 }}>
              <Pill
                style={{ fontSize: 30, opacity: word1, scale: String(word1) }}
              >
                gratis
              </Pill>
              <Pill
                color={colors.orange}
                textColor={colors.text}
                style={{ fontSize: 30, opacity: word2, scale: String(word2) }}
              >
                premio
              </Pill>
            </div>
          </LitCard>
          <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
            <Row
              delay={message + 1.2 * fps}
              label="Spam"
              calc="0,30 × 0,80 × 0,60"
              result="0,1440"
              color={colors.accent}
            />
            <Row
              delay={message + 1.8 * fps}
              label="No spam"
              calc="0,70 × 0,10 × 0,05"
              result="0,0035"
              color={colors.teal}
            />
          </div>
        </div>
        <div style={{ marginTop: 56, opacity: barIn }}>
          <div
            style={{
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.teal,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${fill * 100}%`,
                height: "100%",
                backgroundColor: colors.accent,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 16,
              fontFamily: fonts.mono,
              fontWeight: 500,
              opacity: labels,
            }}
          >
            <span style={{ fontSize: 48, color: colors.accent }}>
              Spam: {fmt(fill * 100)} %
            </span>
            <span
              style={{ fontSize: 34, color: colors.teal, alignSelf: "center" }}
            >
              no spam: {fmt(100 - fill * 100)} %
            </span>
          </div>
        </div>
      </Middle>
      <Takeaway
        text="Es «ingenuo» porque supone que las pistas no dependen entre sí"
        delay={takeaway}
      />
    </Scene>
  );
};
