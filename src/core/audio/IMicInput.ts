export interface MicConstraints {
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
  channelCount?: number;
  sampleRate?: number;
}

export interface IMicInput {
  start(constraints?: MicConstraints): Promise<void>;
  stop(): void;
  output(): AudioNode | null;
}