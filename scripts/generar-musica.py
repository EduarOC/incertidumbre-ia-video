"""Compone una pista de fondo original (libre de derechos) para el video.

Estilo: ambiental y tecnológico a 96 BPM, progresión Am7 - Fmaj7 - Cmaj7 - G6,
con pad, bajo, arpegio con eco y percusión suave. La duración se toma de
src/voz.json para que la música cubra todo el video.

Uso: python3 scripts/generar-musica.py  (requiere numpy y ffmpeg)
"""

import json
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np

SR = 44100
BPM = 96
BEAT = 60 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(7)

voz = json.loads(Path("src/voz.json").read_text())
total_seconds = sum(s["durationInFrames"] for s in voz["scenes"]) / voz["fps"] + 2
n_bars = int(np.ceil(total_seconds / BAR))
length = int(n_bars * BAR * SR) + SR * 4
left = np.zeros(length)
right = np.zeros(length)


def midi(note: int) -> float:
    return 440.0 * 2 ** ((note - 69) / 12)


def add(signal: np.ndarray, start: float, pan: float = 0.0, gain: float = 1.0):
    i = int(start * SR)
    end = min(length, i + len(signal))
    signal = signal[: end - i] * gain
    left[i:end] += signal * np.sqrt((1 - pan) / 2)
    right[i:end] += signal * np.sqrt((1 + pan) / 2)


def lowpass(signal: np.ndarray, cutoff: float) -> np.ndarray:
    # Filtro de un polo, suficiente para suavizar el pad.
    a = np.exp(-2 * np.pi * cutoff / SR)
    out = np.empty_like(signal)
    acc = 0.0
    for k, x in enumerate(signal):
        acc = (1 - a) * x + a * acc
        out[k] = acc
    return out


# Acordes (MIDI) y raíz del bajo por compás.
CHORDS = [
    ([57, 60, 64, 67], 45),  # Am7
    ([53, 57, 60, 64], 41),  # Fmaj7
    ([48, 52, 55, 59], 48),  # Cmaj7
    ([55, 59, 62, 64], 43),  # G6
]

# Pad: ondas con pocos armónicos y ligera desafinación, envolvente lenta.
pad_cache = {}
for chord, _ in CHORDS:
    dur = BAR + 1.5
    t = np.arange(int(dur * SR)) / SR
    tone = np.zeros_like(t)
    for note in chord:
        for detune in (-0.06, 0.06):
            f = midi(note + detune)
            for h, amp in ((1, 1.0), (2, 0.35), (3, 0.15)):
                tone += amp * np.sin(2 * np.pi * f * h * t + rng.uniform(0, 6.28))
    env = np.minimum(1, t / 0.9) * np.minimum(1, np.maximum(0, (dur - t) / 1.4))
    pad_cache[tuple(chord)] = lowpass(tone * env, 1400) / 18

# Pulsos de percusión y notas cortas reutilizables.
kt = np.arange(int(0.35 * SR)) / SR
kick = np.sin(2 * np.pi * (45 * kt + 90 * (1 - np.exp(-kt * 30)) / 30)) * np.exp(-kt * 9)
ht = np.arange(int(0.06 * SR)) / SR
hat = np.diff(rng.normal(size=len(ht) + 1)) * np.exp(-ht * 70) * 0.18


def pluck(note: int, dur: float = 0.5) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    f = midi(note)
    tone = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)
    return tone * np.exp(-t * 7) * np.minimum(1, t / 0.004)


def bass(note: int, dur: float) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    f = midi(note)
    tone = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    env = np.minimum(1, t / 0.01) * np.exp(-t * 1.6)
    return tone * env


ARP_PATTERN = [0, 1, 2, 3, 2, 1, 2, 3]
for bar in range(n_bars):
    chord, root = CHORDS[bar % 4]
    start = bar * BAR
    # Intro: solo pad durante 2 compases; final: se vacía los últimos 2.
    full = 2 <= bar < n_bars - 2
    add(pad_cache[tuple(chord)], start, gain=0.9)
    if full:
        add(bass(root, BEAT * 2), start, gain=0.32)
        add(bass(root, BEAT * 1.5), start + 2 * BEAT, gain=0.26)
        for beat in range(4):
            if beat in (0, 2):
                add(kick, start + beat * BEAT, gain=0.32)
            add(hat, start + (beat + 0.5) * BEAT, pan=0.3, gain=0.5)
    if bar >= 1:
        for step, idx in enumerate(ARP_PATTERN):
            note = chord[idx] + 12
            when = start + step * BEAT / 2
            pan = -0.4 if step % 2 == 0 else 0.4
            add(pluck(note), when, pan=pan, gain=0.09)
            # Eco a corchea con puntillo, rebotando de lado.
            add(pluck(note), when + BEAT * 0.75, pan=-pan, gain=0.035)

stereo = np.stack([left, right], axis=1)
stereo /= np.max(np.abs(stereo)) + 1e-9
stereo *= 0.9
# Fundido de entrada corto para evitar clics.
stereo[: SR] *= np.linspace(0, 1, SR)[:, None]
pcm = (stereo * 32767).astype(np.int16)

with tempfile.TemporaryDirectory() as tmp:
    wav_path = Path(tmp) / "musica.wav"
    with wave.open(str(wav_path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    Path("public").mkdir(exist_ok=True)
    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error", "-i", str(wav_path),
            "-af", "loudnorm=I=-18:TP=-2:LRA=11",
            "-ar", "44100", "-c:a", "libmp3lame", "-q:a", "3",
            "public/musica.mp3",
        ],
        check=True,
    )

print(f"public/musica.mp3: {n_bars} compases, {n_bars * BAR:.1f} s")
