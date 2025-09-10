import type {IEffect} from "../../IEffect.ts";
import type {IAudioContextProvider} from "../../IAudioContextProvider.ts";

export class DynamicsLimiter implements IEffect {
  private readonly _comp: DynamicsCompressorNode;
  private _connected: boolean = false;

  constructor(ctxp: IAudioContextProvider, threshold: number = -6, ratio: number = 6) {
    const ctx = ctxp.get();
    this._comp = ctx.createDynamicsCompressor();
    this._comp.threshold.value = threshold;
    this._comp.ratio.value = ratio;
  }

  connect(input: AudioNode, destination: AudioNode): void {
    input.connect(this._comp);
    this._comp.connect(destination);
    this._connected = true;
  }

  disconnect(): void {
    if (!this._connected) return;
    try {
      this._comp.disconnect();
    } catch {}
    this._connected = false;
  }
}