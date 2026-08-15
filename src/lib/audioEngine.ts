/**
 * Lightweight Web Audio piano synth used by the interactive piano and the
 * ambient ticker. No sample files required, which keeps the bundle small and
 * means the keys are playable the instant the scene mounts — swap in real
 * Naifos one-shots later by pointing `playNote` at decoded buffers if needed.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let convolver: ConvolverNode | null = null;
let convolverGain: GainNode | null = null;

function getContext(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.55;

    convolver = ctx.createConvolver();
    convolver.buffer = buildImpulse(ctx, 1.8, 2.2);
    convolverGain = ctx.createGain();
    convolverGain.gain.value = 0.32;

    masterGain.connect(ctx.destination);
    masterGain.connect(convolver);
    convolver.connect(convolverGain);
    convolverGain.connect(ctx.destination);
  }
  return ctx;
}

function buildImpulse(context: AudioContext, duration: number, decay: number) {
  const rate = context.sampleRate;
  const length = Math.floor(rate * duration);
  const impulse = context.createBuffer(2, length, rate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

export function resumeAudio() {
  const c = getContext();
  if (c.state === "suspended") void c.resume();
}

export function setMasterVolume(v: number) {
  getContext();
  if (masterGain) masterGain.gain.value = v;
}

/**
 * Plays a piano-ish tone at `freq` Hz: two detuned oscillators through a
 * lowpass filter with a percussive envelope, giving a warmer body than a
 * bare sine without needing a sample library.
 */
export function playNote(freq: number, velocity = 0.9) {
  const c = getContext();
  if (!masterGain) return;
  resumeAudio();

  const now = c.currentTime;
  const voiceGain = c.createGain();
  voiceGain.gain.value = 0;
  voiceGain.connect(masterGain);

  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = Math.min(freq * 6, 8000);
  filter.Q.value = 0.6;
  filter.connect(voiceGain);

  const osc1 = c.createOscillator();
  osc1.type = "triangle";
  osc1.frequency.value = freq;

  const osc2 = c.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = freq * 2.005;

  const osc2Gain = c.createGain();
  osc2Gain.gain.value = 0.18;

  osc1.connect(filter);
  osc2.connect(osc2Gain);
  osc2Gain.connect(filter);

  const peak = 0.7 * velocity;
  voiceGain.gain.setValueAtTime(0, now);
  voiceGain.gain.linearRampToValueAtTime(peak, now + 0.012);
  voiceGain.gain.exponentialRampToValueAtTime(Math.max(peak * 0.25, 0.001), now + 0.4);
  voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 1.7);
  osc2.stop(now + 1.7);
}

const NOTE_STEPS: Record<string, number> = {
  C: -9,
  "C#": -8,
  D: -7,
  "D#": -6,
  E: -5,
  F: -4,
  "F#": -3,
  G: -2,
  "G#": -1,
  A: 0,
  "A#": 1,
  B: 2,
};

export function noteToFreq(note: string, octave: number): number {
  const step = NOTE_STEPS[note];
  const semitones = step + (octave - 4) * 12;
  return 440 * Math.pow(2, semitones / 12);
}
