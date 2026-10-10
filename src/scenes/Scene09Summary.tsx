import React from "react";
import { useCue } from "../components/Cues";
import { Scene } from "../components/Scene";
import { Middle, useAppear, useRamp } from "../components/ui";
import { colors } from "../theme";

const ROW_H = 150;

const SummaryRow: React.FC<{
  delay: number;
  color: string;
  name: string;
  question: string;
}> = ({ delay, color, name, question }) => {
  const p = useAppear(delay);
  const lit = p > 0.5;
  return (
    <div
      style={{
        position: "relative",
        height: ROW_H,
        display: "flex",
        alignItems: "center",
        paddingLeft: 90,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 13,
          width: 34,
          height: 34,
          borderRadius: 17,
          boxSizing: "border-box",
          backgroundColor: lit ? color : colors.background,
          border: `5px solid ${lit ? color : colors.line}`,
          scale: String(0.7 + 0.3 * p),
        }}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 40,
          height: ROW_H - 22,
          padding: "0 40px",
          borderRadius: 22,
          backgroundColor: colors.card,
          border: `3px solid ${lit ? color : colors.line}`,
          opacity: 0.25 + 0.75 * p,
          translate: `${(1 - p) * 50}px 0px`,
        }}
      >
        <div
          style={{
            width: 440,
            flexShrink: 0,
            fontWeight: 800,
            fontSize: 42,
            color: colors.primary,
          }}
        >
          {name}
        </div>
        <div
          style={{ flex: 1, fontWeight: 500, fontSize: 36, color: colors.text }}
        >
          {question}
        </div>
      </div>
    </div>
  );
};

export const Scene09Summary: React.FC = () => {
  const rows = [useCue(1), useCue(2), useCue(3), useCue(4)];
  const line = useRamp(rows[0], rows[3]);

  return (
    <Scene label="Cuadro comparativo" title="Cuatro ideas, una forma de pensar">
      <Middle>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 28,
              top: ROW_H / 2,
              width: 4,
              height: ROW_H * 3 * line,
              backgroundColor: colors.primary,
              opacity: 0.5,
            }}
          />
          <SummaryRow
            delay={rows[0]}
            color={colors.primary}
            name="Probabilidad"
            question="¿Qué tan posible es que ocurra algo?"
          />
          <SummaryRow
            delay={rows[1]}
            color={colors.teal}
            name="Teorema de Bayes"
            question="¿Cuánto cambia mi creencia al ver una pista?"
          />
          <SummaryRow
            delay={rows[2]}
            color={colors.orange}
            name="Naïve Bayes"
            question="¿A qué clase pertenece algo con varias pistas?"
          />
          <SummaryRow
            delay={rows[3]}
            color={colors.accent}
            name="Red bayesiana"
            question="¿Cómo se relacionan muchas causas y efectos?"
          />
        </div>
      </Middle>
    </Scene>
  );
};
