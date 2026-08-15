/**
 * The whole site "grooves" at a fixed tempo — page transitions, reveal
 * staggers and hover easings are all derived from this single BPM so the
 * navigation reads like it's cut on the beat rather than arbitrary CSS timing.
 */
export const TEMPO_BPM = 90;
export const BEAT_SEC = 60 / TEMPO_BPM;

export const beats = (n: number) => n * BEAT_SEC;

export const grooveEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
