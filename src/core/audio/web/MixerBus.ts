import type {IMixer} from "../IMixer.ts";
import type {IAudioContextProvider} from "../IAudioContextProvider.ts";

export class MixerBus implements IMixer {
  private readonly _comp: DynamicsCompressorNode;
  private readonly _master: GainNode;

  constructor(ctxp: IAudioContextProvider) {
    const ctx = ctxp.get();
    this._comp = ctx.createDynamicsCompressor();
    this._comp.threshold.value = -10;
    this._comp.knee.value = 20;
    this._comp.ratio.value = 3;
    this._comp.attack.value = 0.003;
    this._comp.release.value = 0.25;

    this._master = ctx.createGain();
    this._master.gain.value = 1.0;

    this._comp.connect(this._master);
    this._master.connect(ctx.destination);
  }

  bus(): AudioNode {
    return this._comp;
  }

  setMasterGain(v: number): void {
    this._master.gain.value = v;
  }

  close(): void {
    try {
      this._comp.disconnect();
      this._master.disconnect();
    } catch {}
  }
}