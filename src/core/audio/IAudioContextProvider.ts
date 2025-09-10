export interface IAudioContextProvider {
  get(): AudioContext;
  ensureResumed(): Promise<void>;
  close(): Promise<void>;
}
