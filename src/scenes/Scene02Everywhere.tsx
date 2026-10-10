import React from "react";
import { useVideoConfig } from "remotion";
import { useCue } from "../components/Cues";
import { Scene } from "../components/Scene";
import { LitCard, Takeaway } from "../components/ui";
import { colors, fonts } from "../theme";

const Example: React.FC<{
  delay: number;
  accent: string;
  name: string;
  question: string;
  answer: string;
}> = ({ delay, accent, name, question, answer }) => (
  <LitCard delay={delay} accent={accent} style={{ padding: "34px 40px" }}>
    <div
      style={{
        fontFamily: fonts.body,
        fontWeight: 800,
        fontSize: 42,
        color: colors.primary,
      }}
    >
      {name}
    </div>
    <div
      style={{
        fontFamily: fonts.body,
        fontWeight: 500,
        fontSize: 32,
        marginTop: 10,
        color: colors.text,
      }}
    >
      {question}
    </div>
    <div
      style={{
        fontFamily: fonts.body,
        fontWeight: 800,
        fontSize: 32,
        marginTop: 8,
        color: accent,
      }}
    >
      {answer}
    </div>
  </LitCard>
);

export const Scene02Everywhere: React.FC = () => {
  const { fps } = useVideoConfig();
  // Las tarjetas se encienden mientras el narrador nombra cada ejemplo.
  const start = useCue(1);
  const step = 0.7 * fps;
  const takeaway = useCue(2);

  return (
    <Scene
      label="La incertidumbre está en todas partes"
      title="La IA casi nunca está 100 % segura"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 36,
        }}
      >
        <Example
          delay={start}
          accent={colors.primary}
          name="Clima"
          question="¿Lloverá mañana?"
          answer="Calcula 70 % de probabilidad de lluvia"
        />
        <Example
          delay={start + step}
          accent={colors.teal}
          name="Correo"
          question="¿Es spam o no?"
          answer="Calcula la probabilidad de que sea spam"
        />
        <Example
          delay={start + 2 * step}
          accent={colors.orange}
          name="Carro autónomo"
          question="¿Persona o bolsa?"
          answer="Estima lo más probable y frena a tiempo"
        />
        <Example
          delay={start + 3 * step}
          accent={colors.accent}
          name="Asistente de voz"
          question="¿Dijiste «llama» o «lama»?"
          answer="Elige la palabra más probable"
        />
      </div>
      <Takeaway
        text="No sabe con certeza: calcula qué tan probable es cada opción"
        delay={takeaway}
        style={{ marginTop: 44 }}
      />
    </Scene>
  );
};
