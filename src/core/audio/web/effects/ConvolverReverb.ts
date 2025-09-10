import type {IConvolverReverbEffect} from "../../IEffect.ts";
import type {IAudioContextProvider} from "../../IAudioContextProvider.ts";

export class ConvolverReverb implements IConvolverReverbEffect {
  private readonly _conv: ConvolverNode;
  private readonly _dry: GainNode;
  private readonly _wet: GainNode;
  private _connected: boolean = false;

  constructor(ctxp: IAudioContextProvider, mix = 0.3, irBuffer?: AudioBuffer) {
    const ctx = ctxp.get();
    this._conv = ctx.createConvolver();
    this._conv.buffer = irBuffer ?? this.generateSimpleIR(ctx);
    this._dry = ctx.createGain();
    this._wet = ctx.createGain();
    this.setMix(mix);
  }

  setMix(mix: number): void {
    this._dry.gain.value = 1 - mix;
    this._wet.gain.value = mix;
  }

  connect(input: AudioNode, destination: AudioNode): void {
    input.connect(this._dry);
    this._dry.connect(destination);

    input.connect(this._conv);
    this._conv.connect(this._wet);
    this._wet.connect(destination);
    this._connected = true;
  }

  disconnect(): void {
    if (!this._connected) return;
    try {
      this._conv.disconnect();
      this._dry.disconnect();
      this._wet.disconnect();
    } catch {}
    this._connected = false;
  }

  private generateSimpleIR(ctx: AudioContext): AudioBuffer {
    const len = ctx.sampleRate * 1.2;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
      }
    }

    return buf;
  }

}