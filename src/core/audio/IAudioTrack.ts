export interface IAudioTrack {
  prepare(): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  isPlaying(): boolean;
  output(): AudioNode | null;
  setGain(v: number): void;
}