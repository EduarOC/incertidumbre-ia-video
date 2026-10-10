# incertidumbre-ia-video

Video educativo de 60 s (1920 × 1080, 30 fps) hecho con Remotion a partir de
`guion-remotion.md` y la guía del curso «Incertidumbre en Inteligencia Artificial».

```bash
npm install
npm run dev      # vista previa en Remotion Studio
npm run render   # genera out/incertidumbre-ia.mp4
```

## Banda sonora

Coloca el video de origen en `audio/fuente.mp4` y ejecuta `npm run audio`.
Esto extrae `audio/musica.mp3` con ffmpeg y lo copia a `public/musica.mp3`;
la composición lo reproduce desde el frame 0 con un fundido de salida de 2 s.
Si el archivo no existe, el video se renderiza sin sonido.

## Estructura

- `src/IncertidumbreIA.tsx`: composición principal, una `<Sequence>` por escena.
- `src/scenes/`: las 10 escenas del guion.
- `src/components/`: escena base (retícula, etiqueta, título, acercamiento),
  texto palabra por palabra y piezas comunes.
- `public/fonts/`: Bricolage Grotesque, Manrope y DM Mono (Google Fonts, OFL),
  incluidas localmente para que el render no dependa de la red.
