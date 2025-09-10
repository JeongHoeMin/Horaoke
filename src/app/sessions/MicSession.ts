import type {IMicInput} from "../../core/audio/IMicInput.ts";
import type {IMixer} from "../../core/audio/IMixer.ts";
import type {MicGainEffect} from "../../core/audio/web/effects/MicGainEffect.ts";
import type {DelayEffect} from "../../core/audio/web/effects/DelayEffect.ts";
import type {ConvolverReverb} from "../../core/audio/web/effects/ConvolverReverb.ts";

export class MicSession {
  private _mic: IMicInput;
  private _mixer: IMixer;
  private _micGain: MicGainEffect;
  private _delayFx: DelayEffect;
  private _reverbFx: ConvolverReverb;

  constructor(mic: IMicInput, mixer: IMixer, micGain: MicGainEffect, delayFx: DelayEffect, reverbFx: ConvolverReverb) {
    this._mic = mic;
    this._mixer = mixer;
    this._micGain = micGain;
    this._delayFx = delayFx;
    this._reverbFx = reverbFx;
  }

  async start(): Promise<void> {
    await this._mic.start({
      echoCancellation: true,
      noiseSuppression: true,
    });
    this.connectChain();
  }

  stop(): void {
    this._mic.stop();
  }

  private connectChain(): void {
    const src = this._mic.output();
    if (!src) return;
    const bus = this._mixer.bus();

    this._micGain.disconnect();
    this._delayFx.disconnect();
    this._reverbFx.disconnect();

    this._micGain.connect(src, bus);

    const micGainOut = this._micGain.inputNode();
    this._delayFx.connect(micGainOut, bus);
    this._reverbFx.connect(micGainOut, bus);
  }

  setMicGain(v: number): void {
    this._micGain.setGain(v)
  }

  setDelay(ms: number, fb: number): void {
    this._delayFx.set(ms, fb);
  }

  setReverbMix(mix: number): void {
    this._reverbFx.setMix(mix);
  }
}