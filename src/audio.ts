import type { Bit, Cue } from "./types";
import { getLang } from "./progress";
import { speechFor } from "./i18n";

const MUTE_KEY = "toddler-learn-muted";

let muted = false;
try {
  muted = localStorage.getItem(MUTE_KEY) === "1";
} catch {
  muted = false;
}

let session = 0;
let ctx: AudioContext | null = null;

export function mutedNow() {
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
  try {
    localStorage.setItem(MUTE_KEY, next ? "1" : "0");
  } catch {
    /* ignore private mode */
  }
  if (next) stopAudio();
}

export function stopAudio() {
  session += 1;
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* ignore */
  }
}

export function unlockAudio() {
  getCtx();
  try {
    const synth = window.speechSynthesis;
    synth?.getVoices();
    if (!synth || muted) return;
    const primer = new SpeechSynthesisUtterance(" ");
    primer.volume = 0.01;
    primer.rate = 2;
    synth.speak(primer);
  } catch {
    /* ignore */
  }
}

function getCtx() {
  if (typeof window === "undefined") return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!ctx) ctx = new Ctx();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

function tone(freq: number, dur: number, type: OscillatorType = "sine", peak = 0.06) {
  const audio = getCtx();
  if (!audio || muted) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime);
  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(peak, audio.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + dur + 0.02);
}

function glide(from: number, to: number, dur: number, type: OscillatorType = "sine", peak = 0.06) {
  const audio = getCtx();
  if (!audio || muted) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, audio.currentTime);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), audio.currentTime + dur);
  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(peak, audio.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + dur + 0.02);
}

function noise(dur: number, freq = 900, peak = 0.045) {
  const audio = getCtx();
  if (!audio || muted) return;
  const length = Math.max(1, Math.floor(audio.sampleRate * dur));
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  const source = audio.createBufferSource();
  source.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = freq;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(peak, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);
  source.start();
}

function renderCue(cue: Cue) {
  switch (cue) {
    case "moo":
      glide(230, 110, 0.55, "sine", 0.07);
      return 580;
    case "oink":
      tone(320, 0.09, "square", 0.04);
      window.setTimeout(() => tone(260, 0.1, "square", 0.04), 120);
      return 280;
    case "quack":
      glide(620, 340, 0.16, "square", 0.04);
      return 200;
    case "baa":
      glide(360, 280, 0.45, "sawtooth", 0.035);
      return 480;
    case "goat":
      tone(420, 0.12, "sawtooth", 0.03);
      window.setTimeout(() => glide(480, 300, 0.22, "sawtooth", 0.03), 140);
      return 400;
    case "neigh":
      glide(380, 760, 0.42, "sawtooth", 0.03);
      return 460;
    case "cluck":
      tone(880, 0.06, "square", 0.035);
      window.setTimeout(() => tone(700, 0.06, "square", 0.03), 90);
      window.setTimeout(() => tone(760, 0.07, "square", 0.03), 180);
      return 280;
    case "roar":
      noise(0.45, 240, 0.05);
      glide(140, 70, 0.45, "sawtooth", 0.04);
      return 480;
    case "tweet":
      tone(1400, 0.08, "sine", 0.04);
      window.setTimeout(() => tone(1800, 0.1, "sine", 0.035), 100);
      return 240;
    case "bark":
      noise(0.09, 500, 0.05);
      window.setTimeout(() => noise(0.1, 420, 0.05), 140);
      return 280;
    case "meow":
      glide(760, 380, 0.35, "triangle", 0.05);
      return 380;
    case "hoot":
      tone(420, 0.18, "sine", 0.05);
      window.setTimeout(() => tone(360, 0.22, "sine", 0.045), 200);
      return 460;
    case "trumpet":
      glide(220, 360, 0.35, "sawtooth", 0.035);
      return 380;
    case "ribbit":
      tone(180, 0.1, "square", 0.04);
      window.setTimeout(() => tone(150, 0.12, "square", 0.04), 140);
      return 300;
    case "buzz":
      tone(190, 0.35, "sawtooth", 0.03);
      return 380;
    case "splash":
    case "rain":
      noise(0.35, 1400, 0.05);
      return 380;
    case "wind":
      noise(0.45, 600, 0.04);
      return 480;
    case "whale":
      glide(280, 120, 0.6, "sine", 0.06);
      return 640;
    case "click":
      tone(1200, 0.04, "square", 0.04);
      window.setTimeout(() => tone(1600, 0.04, "square", 0.035), 80);
      window.setTimeout(() => tone(1400, 0.04, "square", 0.03), 160);
      return 240;
    case "monkey":
      tone(700, 0.06, "square", 0.035);
      window.setTimeout(() => tone(900, 0.06, "square", 0.03), 80);
      window.setTimeout(() => tone(650, 0.08, "square", 0.03), 160);
      return 280;
    case "chirp":
      tone(1600, 0.05, "sine", 0.035);
      window.setTimeout(() => tone(1900, 0.05, "sine", 0.03), 70);
      window.setTimeout(() => tone(1700, 0.05, "sine", 0.03), 140);
      return 220;
    case "beep":
    case "pop":
      tone(880, 0.08, "sine", 0.05);
      return 120;
    case "drum":
      tone(90, 0.18, "sine", 0.08);
      noise(0.08, 300, 0.04);
      return 200;
    case "piano":
      tone(523, 0.35, "sine", 0.05);
      return 360;
    case "bell":
      tone(880, 0.4, "sine", 0.04);
      tone(1320, 0.3, "sine", 0.02);
      return 420;
    case "horn":
      tone(440, 0.28, "sawtooth", 0.03);
      return 320;
    default:
      tone(520, 0.12, "sine", 0.05);
      return 150;
  }
}

export function playCue(cue: Cue) {
  if (muted) return Promise.resolve();
  return wait(renderCue(cue));
}

export async function playNotes(notes: number[]) {
  const id = session;
  for (const freq of notes) {
    if (session !== id || muted) return;
    tone(freq, 0.18, "sine", 0.055);
    await wait(190);
  }
}

export async function playSuccess() {
  const id = session;
  for (const freq of [523, 659, 784, 1046]) {
    if (session !== id || muted) return;
    tone(freq, 0.16, "sine", 0.055);
    await wait(110);
  }
}

export function playCheer() {
  if (muted) return;
  const id = session;
  const burst = (delay: number, notes: [number, number, OscillatorType, number][]) => {
    window.setTimeout(() => {
      if (session !== id || muted) return;
      for (const [freq, dur, type, peak] of notes) tone(freq, dur, type, peak);
    }, delay);
  };
  burst(0, [
    [523, 0.22, "triangle", 0.09],
    [659, 0.22, "triangle", 0.08],
    [784, 0.26, "triangle", 0.08],
  ]);
  burst(130, [
    [1046, 0.16, "sine", 0.06],
    [1318, 0.2, "sine", 0.045],
  ]);
  burst(250, [[1568, 0.18, "sine", 0.04]]);
}

export async function playTryAgain() {
  if (muted) return;
  tone(240, 0.12, "sine", 0.04);
  await wait(100);
  tone(180, 0.16, "sine", 0.035);
}

function utteranceLang(text: string) {
  if (/[\u0900-\u097F]/.test(text)) return getLang() === "mr" ? "mr-IN" : "hi-IN";
  return "en-US";
}

function pickVoice(lang: string) {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  const prefix = lang.slice(0, 2).toLowerCase();
  return (
    voices.find((voice) => voice.lang.toLowerCase().startsWith(prefix) && /google|lekha|female|samantha/i.test(voice.name)) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith(prefix)) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ||
    null
  );
}

export function speak(text: string, id = session) {
  if (!text || muted || session !== id) return Promise.resolve();
  const synth = window.speechSynthesis;
  if (!synth) return Promise.resolve();
  return new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve();
    };
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.86;
    utterance.pitch = 1.12;
    const lang = utteranceLang(text);
    utterance.lang = lang;
    const voice = pickVoice(lang);
    if (voice) utterance.voice = voice;
    utterance.onend = finish;
    utterance.onerror = finish;
    const timer = window.setTimeout(finish, Math.min(9000, 1100 + text.length * 78));
    try {
      synth.cancel();
      synth.speak(utterance);
    } catch {
      finish();
    }
  });
}

export async function playBit(bit: Bit) {
  const id = session;
  if (muted) return;
  if (bit.cue) {
    await playCue(bit.cue);
    if (session !== id) return;
  }
  if (bit.notes?.length) {
    await playNotes(bit.notes);
    if (session !== id) return;
  }
  await speak(speechFor(bit.say, bit.word).text, id);
}

export async function playPrompt(say: string, cue?: Cue) {
  const id = session;
  if (cue) {
    await playCue(cue);
    if (session !== id) return;
  }
  await speak(speechFor(say).text, id);
}

export async function listenForSound(ms = 2400) {
  if (!navigator.mediaDevices?.getUserMedia) return false;
  let stream: MediaStream | null = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audio = getCtx();
    if (!audio) return false;
    const source = audio.createMediaStreamSource(stream);
    const analyser = audio.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const data = new Uint8Array(analyser.fftSize);
    const started = Date.now();
    return await new Promise<boolean>((resolve) => {
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let peak = 0;
        for (const value of data) peak = Math.max(peak, Math.abs(value - 128));
        if (peak > 16) {
          resolve(true);
          return;
        }
        if (Date.now() - started > ms) {
          resolve(false);
          return;
        }
        window.requestAnimationFrame(tick);
      };
      tick();
    });
  } catch {
    return false;
  } finally {
    stream?.getTracks().forEach((track) => track.stop());
  }
}
