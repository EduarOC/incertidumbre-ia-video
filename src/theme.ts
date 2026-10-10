import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fuentes de Google Fonts (licencia OFL) empaquetadas en public/fonts para que
// el render no dependa de la red.
const FONT_FILES = [
  {
    family: "Bricolage Grotesque",
    file: "BricolageGrotesque.woff2",
    weight: "200 800",
  },
  { family: "Manrope", file: "Manrope.woff2", weight: "200 800" },
  { family: "DM Mono", file: "DMMono-400.woff2", weight: "400" },
  { family: "DM Mono", file: "DMMono-500.woff2", weight: "500" },
];

for (const font of FONT_FILES) {
  loadFont({
    family: font.family,
    url: staticFile(`fonts/${font.file}`),
    weight: font.weight,
    format: "woff2",
  });
}

export const colors = {
  background: "#F8FAFC",
  primary: "#1F4E79",
  text: "#14283C",
  accent: "#E76F51",
  teal: "#2A9D8F",
  orange: "#F4A261",
  muted: "#64748B",
  line: "#C9D6E3",
  card: "#FFFFFF",
};

export const fonts = {
  title: "'Bricolage Grotesque', sans-serif",
  body: "Manrope, sans-serif",
  mono: "'DM Mono', monospace",
};

// Formato numérico en español: coma decimal.
export const fmt = (value: number, decimals = 1) =>
  value.toFixed(decimals).replace(".", ",");
