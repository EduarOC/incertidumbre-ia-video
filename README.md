# incertidumbre-ia-video

Motion graphics educativo (1920 × 1080, 30 fps, unos 2 min 30 s) hecho con
Remotion a partir de `guion-remotion.md` y la guía del curso «Incertidumbre en
Inteligencia Artificial». Tiene narración en español, música de fondo original
y animaciones sincronizadas con la voz.

```bash
npm install
npm run dev      # vista previa en Remotion Studio
npm run render   # genera out/incertidumbre-ia.mp4
```

## Narración

El texto está en `src/narracion.json`, dividido en frases por escena. Cada
animación arranca cuando el narrador dice la frase que la menciona, y cada
escena dura lo que necesita su voz.

Para regenerarla después de cambiar el texto se usa [Piper](https://github.com/rhasspy/piper)
(TTS neuronal de código abierto) con la voz `es_MX-claude-high`:

```bash
python3 -m venv /opt/piper-venv && /opt/piper-venv/bin/pip install piper-tts
# Descarga es_MX-claude-high.onnx y .onnx.json de huggingface.co/rhasspy/piper-voices
PIPER_BIN=/opt/piper-venv/bin/piper PIPER_MODEL=/ruta/es_MX-claude-high.onnx npm run voz
```

Esto escribe un MP3 por frase en `public/voz/` y los tiempos en `src/voz.json`.

## Música

`public/musica.mp3` es una pista original compuesta por código
(`npm run musica`, requiere numpy). Baja de volumen automáticamente mientras
habla el narrador. Para usar otra música, reemplaza ese archivo; si tienes un
video de origen en `audio/fuente.mp4`, `npm run audio` extrae su audio ahí.

## Estructura

- `src/IncertidumbreIA.tsx`: línea de tiempo con transiciones, música y barra de progreso.
- `src/scenes/`: las 10 escenas del guion.
- `src/components/`: escena base, voz sincronizada (`Cues.tsx`), transición
  diagonal (`Sweep.tsx`), texto palabra por palabra y piezas comunes.
- `public/fonts/`: Bricolage Grotesque, Manrope y DM Mono (Google Fonts, OFL),
  incluidas localmente para que el render no dependa de la red.
