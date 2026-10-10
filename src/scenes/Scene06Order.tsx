import React from "react";
import { useVideoConfig } from "remotion";
import { Scene } from "../components/Scene";
import { LitCard, Middle, Takeaway, useAppear } from "../components/ui";
import { colors, fonts } from "../theme";

const Conditional: React.FC<{
  delay: number;
  accent: string;
  formula: string;
  value: string;
  meaning: string;
}> = ({ delay, accent, formula, value, meaning }) => (
  <LitCard
    delay={delay}
    accent={accent}
    style={{ flex: 1, padding: "40px 44px" }}
  >
    <div
      style={{
        fontFamily: fonts.mono,
        fontWeight: 500,
        fontSize: 38,
        color: colors.primary,
        whiteSpace: "nowrap",
      }}
    >
      {formula}
    </div>
    <div
      style={{
        fontFamily: fonts.mono,
        fontWeight: 500,
        fontSize: 120,
        lineHeight: 1.1,
        marginTop: 14,
        color: accent,
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontWeight: 500,
        fontSize: 34,
        lineHeight: 1.3,
        marginTop: 8,
        color: colors.text,
      }}
    >
      {meaning}
    </div>
  </LitCard>
);

export const Scene06Order: React.FC = () => {
  const { fps } = useVideoConfig();
  const neq = useAppear(1.8 * fps, 11);

  return (
    <Scene
      label="Cuidado con este error"
      title="P(B | A) no es lo mismo que P(A | B)"
    >
      <Middle>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Conditional
            delay={0.4 * fps}
            accent={colors.primary}
            formula="P(«gratis» | spam)"
            value="80 %"
            meaning="del spam contiene la palabra «gratis»"
          />
          <div
            style={{
              width: 130,
              flexShrink: 0,
              textAlign: "center",
              fontFamily: fonts.title,
              fontWeight: 800,
              fontSize: 150,
              color: colors.accent,
              opacity: neq,
              translate: `0px ${(1 - neq) * -220}px`,
            }}
          >
            ≠
          </div>
          <Conditional
            delay={1 * fps}
            accent={colors.accent}
            formula="P(spam | «gratis»)"
            value="77,4 %"
            meaning="de los correos con «gratis» son spam"
          />
        </div>
      </Middle>
      <Takeaway
        text="El orden importa: Bayes es la forma correcta de darle la vuelta a la pregunta"
        delay={3.4 * fps}
      />
    </Scene>
  );
};
