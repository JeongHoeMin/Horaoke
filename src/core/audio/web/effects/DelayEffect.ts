import type {IDelayEffect} from "../../IEffect.ts";
import type {IAudioContextProvider} from "../../IAudioContextProvider.ts";

export class DelayEffect implements IDelayEffect {
  private readonly _delay: DelayNode;
  private readonly _feedback: GainNode;
  private _connected: boolean = false;

  constructor(ctxp: IAudioContextProvider, ms: number = 120, fb: number = 0.25) {
    const ctx = ctxp.get();
    this._delay = ctx.createDelay(1.0);
    this._delay.delayTime.value = ms / 1000;
    this._feedback = ctx.createGain();
    this._feedback.gain.value = fb;

    this._delay.connect(this._feedback);
    this._feedback.connect(this._delay);
  }

  set(ms: number, fb: number): void {
    this._delay.delayTime.value = ms / 1000;
    this._feedback.gain.value = fb;
  }

  connect(input: AudioNode, destination: AudioNode): void {
    input.connect(this._delay);
    this._delay.connect(destination);
    this._connected = true;
  }

  disconnect(): void {
    if(!this._connected) return;
    try {
      this._delay.disconnect();
      this._feedback.disconnect();
    } catch {}
    this._connected = false;
  }
}