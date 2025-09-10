import type {IAudioContextProvider} from "../../IAudioContextProvider.ts";
import type {IMicEffect} from "../../IEffect.ts";

export class MicGainEffect implements IMicEffect {
  private readonly _gain: GainNode;
  private connected: boolean = false;

  constructor(ctxp: IAudioContextProvider, initialGain: number = 1.0) {
    this._gain = ctxp.get().createGain();
    this._gain.gain.value = initialGain;
  }

  inputNode(): AudioNode {
    return this._gain;
  }

  setGain(v: number) {
    this._gain.gain.value = v;
  }

  connect(input: AudioNode, destination: AudioNode): void {
    input.connect(this._gain);
    this._gain.connect(destination);
    this.connected = true;
  }

  disconnect(): void {
    if (!this.connected) return;
    try {
      this._gain.disconnect();
    } catch {}

    this.connected = false;
  }
}