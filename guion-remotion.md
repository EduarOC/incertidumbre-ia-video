# Guion: Incertidumbre en Inteligencia Artificial (Remotion)

Video educativo de 60 s que explica cómo una IA maneja la incertidumbre: probabilidad, Teorema de Bayes, Naïve Bayes y redes bayesianas. Todos los números vienen de la guía del curso; no inventar otros.

## Especificaciones

- 1920 × 1080, 30 fps, 60 s (1800 frames). Una composición `IncertidumbreIA` con una `<Sequence>` por escena.
- Colores: fondo `#F8FAFC`, principal `#1F4E79` (azul marino), texto `#14283C`, acento `#E76F51` (coral). Opcionales de la guía: `#2A9D8F` (verde azulado) y `#F4A261` (naranja).
- Fondo con una retícula de puntos suaves (azul al 16 %, cada 56 px).
- Tipografías (Google Fonts con `@remotion/google-fonts`): títulos Bricolage Grotesque 800, texto Manrope 500/800, números y fórmulas DM Mono.
- Estilo «mapa de pistas»: líneas finas que unen nodos y tarjetas que se encienden una a una. Animaciones con `spring()` e `interpolate()`; el texto entra palabra por palabra desde la derecha (110 ms entre palabras). Ningún parpadeo de más de 3 veces por segundo.
- Cada escena tiene un leve acercamiento continuo (escala 1 → 1,015) para que nada quede congelado.
- Arriba a la izquierda de cada escena: una etiqueta pequeña en DM Mono azul y un título grande (96 px).

## Escenas

| # | Segundos | Etiqueta | Título | Qué pasa |
|---|---|---|---|---|
| 1 | 0–4 | Incertidumbre en Inteligencia Artificial | ¿Cómo piensa una IA cuando no está segura? | A la derecha aparecen 5 nodos que se conectan con líneas a un círculo central con «?», que late suavemente. El título ya se ve en el primer frame. |
| 2 | 4–12 | La incertidumbre está en todas partes | La IA casi nunca está 100 % segura | Cuatro tarjetas en cuadrícula 2 × 2, una cada 0,9 s: **Clima** «¿Lloverá mañana? Calcula 70 % de probabilidad de lluvia» · **Correo** «¿Es spam o no? Calcula la probabilidad de que sea spam» · **Carro autónomo** «¿Persona o bolsa? Estima lo más probable y frena a tiempo» · **Asistente de voz** «¿Dijiste «llama» o «lama»? Elige la palabra más probable». Al final: «No sabe con certeza: calcula qué tan probable es cada opción». |
| 3 | 12–18 | 1 · Probabilidad | La incertidumbre se mide de 0 a 1 | Una barra horizontal de 0 («imposible») a 1 («seguro») con marca en 0,5. Un marcador viaja de 0 a 0,30 con rebote y aparece la píldora «P(spam) = 30 %». Al final: «Todo suma 1: si hay 30 % de spam, hay 70 % de no spam». |
| 4 | 18–24 | La ley de los grandes números | Con más datos, la estimación mejora | Gráfico de líneas: simulación de 1 000 lanzamientos de moneda (semilla fija, `random()` de Remotion). La línea se dibuja de izquierda a derecha y se acerca a la línea punteada coral de 0,5. Un contador muestra «N lanzamientos · caras: 0,XX». Al final: «Por eso una IA entrenada con pocos datos se equivoca más». |
| 5 | 24–30 | 2 · Teorema de Bayes | Una pista cambia lo que creemos | Barra «Antes de leer» en 30 %. Entra la píldora coral «gratis» con la nota «aparece en el 80 % del spam». Una flecha curva une las barras y la segunda crece contando de 30,0 % a 77,4 % («Con «gratis»»). Aparece la fórmula `P(A | B) = P(B | A) × P(A) ÷ P(B)`. |
| 6 | 30–36 | Cuidado con este error | P(B \| A) no es lo mismo que P(A \| B) | Dos tarjetas: «P(«gratis» \| spam) · 80 % · del spam contiene la palabra «gratis»» y «P(spam \| «gratis») · 77,4 % · de los correos con «gratis» son spam». Entre ellas cae un «≠» coral. Al final: «El orden importa: Bayes es la forma correcta de darle la vuelta a la pregunta». |
| 7 | 36–42 | 3 · Naïve Bayes | Muchas pistas, una por una | Tarjeta «Mensaje nuevo: «gratis premio»» con dos píldoras de palabras. Dos filas: «Spam → 0,30 × 0,80 × 0,60 = 0,1440» y «No spam → 0,70 × 0,10 × 0,05 = 0,0035». Una barra se llena al 97,6 % en coral y aparece «Spam: 97,6 %» / «no spam: 2,4 %». Al final: «Es «ingenuo» porque supone que las pistas no dependen entre sí». |
| 8 | 42–50 | 4 · Redes bayesianas | Un mapa de causas y efectos | Nodos circulares «Lluvia» y «Aspersor» con flechas hacia «Pasto mojado». Panel «¿Llovió?» con un número grande: 20,0 % («No sabemos nada») → el pasto se pinta coral y sube a 45,7 % («Vemos el pasto mojado») → el aspersor se pinta azul y baja a 23,6 % («Y el aspersor estaba encendido»). Al final: «Otra explicación hace menos necesaria la lluvia». |
| 9 | 50–56 | Cuadro comparativo | Cuatro ideas, una forma de pensar | Cuatro filas que se encienden una a una, unidas por una línea vertical con nodos: Probabilidad «¿Qué tan posible es que ocurra algo?» · Teorema de Bayes «¿Cuánto cambia mi creencia al ver una pista?» · Naïve Bayes «¿A qué clase pertenece algo con varias pistas?» · Red bayesiana «¿Cómo se relacionan muchas causas y efectos?». |
| 10 | 56–60 | — | La IA no sabe: calcula qué es más probable | Título de 110 px, subrayado coral que se dibuja y la línea «Probabilidad · Bayes · Naïve Bayes · Redes bayesianas». A la derecha, una cadena de nodos que termina en un punto coral. Se mantiene quieto hasta el final. |

## Sonido

Remotion no genera música. Si `audio/musica.mp3` existe en el repositorio, ponerlo con `<Audio>` desde el frame 0 con un fundido de salida de 2 s. Si no existe, renderizar sin sonido.

## Entrega

- Render: `npx remotion render IncertidumbreIA out/incertidumbre-ia.mp4`.
- Hacer commit del MP4 en `out/` y push a la rama de trabajo.
