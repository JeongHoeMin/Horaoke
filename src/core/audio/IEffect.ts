export interface IEffect {
  connect(input: AudioNode, destination: AudioNode): void;
  disconnect(): void;
}

export interface IMicEffect extends IEffect {
  inputNode(): AudioNode;
  setGain(v: number): void;
}

export interface IDelayEffect extends IEffect {
  set(ms: number, feedback: number): void;
}

export interface IConvolverReverbEffect extends IEffect {
  setMix(mix: number): void;
}
