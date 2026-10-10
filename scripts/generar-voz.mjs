// Genera la narración con Piper (TTS neuronal de código abierto) a partir de
// src/narracion.json. Crea un MP3 por frase en public/voz/ y escribe
// src/voz.json con los tiempos que usa la composición para sincronizar las
// animaciones con la voz.
//
// Uso: PIPER_BIN=/ruta/piper PIPER_MODEL=/ruta/voz.onnx node scripts/generar-voz.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const FPS = 30;
// Silencio antes de la primera frase y entre frases de una escena.
const LEAD_IN = 0.5;
const GAP = 0.35;
// Tiempo que la escena se sostiene después de la última frase.
const TAIL = 1.1;
const FINAL_TAIL = 2.2;

const piper = process.env.PIPER_BIN ?? "piper";
const model =
  process.env.PIPER_MODEL ?? "/opt/piper-voices/es_MX-claude-high.onnx";

const narration = JSON.parse(readFileSync("src/narracion.json", "utf8"));
const outDir = "public/voz";
const work = join(tmpdir(), "voz-piper");
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
mkdirSync(work, { recursive: true });

const duration = (file) =>
  Number(
    execFileSync("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "csv=p=0",
      file,
    ]).toString(),
  );

const scenes = narration.map((scene, s) => {
  let cursor = LEAD_IN;
  const cues = scene.cues.map((text, c) => {
    const name = `e${String(s + 1).padStart(2, "0")}-${c + 1}`;
    const wav = join(work, `${name}.wav`);
    const mp3 = join(outDir, `${name}.mp3`);
    execFileSync(piper, ["-m", model, "-f", wav, "--length_scale", "0.9"], {
      input: text,
      stdio: ["pipe", "ignore", "ignore"],
    });
    // Recorta el silencio inicial y final que añade Piper.
    execFileSync("ffmpeg", [
      "-y", "-loglevel", "error", "-i", wav,
      "-af",
      "silenceremove=start_periods=1:start_threshold=-50dB," +
        "areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse," +
        "loudnorm=I=-16:TP=-1.5:LRA=11",
      "-ar", "44100", "-c:a", "libmp3lame", "-q:a", "2", mp3,
    ]);
    const seconds = duration(mp3);
    const cue = {
      text,
      file: `voz/${name}.mp3`,
      from: Math.round(cursor * FPS),
      durationInFrames: Math.ceil(seconds * FPS),
    };
    cursor += seconds + GAP;
    return cue;
  });
  const isLast = s === narration.length - 1;
  const voiceEnd = cursor - GAP + (isLast ? FINAL_TAIL : TAIL);
  return {
    id: scene.id,
    durationInFrames: Math.ceil(Math.max(scene.minSeconds, voiceEnd) * FPS),
    cues,
  };
});

writeFileSync("src/voz.json", JSON.stringify({ fps: FPS, scenes }, null, 2) + "\n");
const total = scenes.reduce((sum, s) => sum + s.durationInFrames, 0);
console.log(
  scenes.map((s) => `${s.id}: ${(s.durationInFrames / FPS).toFixed(1)} s`).join("\n"),
);
console.log(`Total: ${(total / FPS).toFixed(1)} s`);
