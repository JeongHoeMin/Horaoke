export interface MinChainParams {
  delayMs: number;
  delayFeedback: number;
  reverbMix: number;
  minGain: number;
}

export interface MusicChainParams {
  musicGain: number;
  semitone: number;
}

export interface MasterParams {
  masterGain: number;
}