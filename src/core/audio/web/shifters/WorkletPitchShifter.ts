import type {IPitchShifter} from "../../IPitchShifter.ts";
import type {IAudioContextProvider} from "../../IAudioContextProvider.ts";

export class WorkletPitchShifter implements IPitchShifter {
  private _node: AudioWorkletNode | null = null;
  private _ratio: number = 1.0;
  private _inserted: boolean = false;
  private _input?: AudioNode;
  private _destination?: AudioNode;
  private _ctxp: IAudioContextProvider;

  constructor(ctxp: IAudioContextProvider) {
    this._ctxp = ctxp;
  }

  private async ensureNode(): Promise<void> {
    if (!this._node) {
      const ctx = this._ctxp.get();
      if (!ctx._pitchWorkletLoaded) {
        await ctx.audioWorklet.addModule('/pitch-shifter-processor.js');
        ctx._pitchWorkletLoaded = true;
      }
      this._node = new AudioWorkletNode(ctx, 'pitch-shifter-processor', {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [2],
        parameterData: {
          pitchRatio: this._ratio,
        },
      });
    }
  }

  setSemitone(semitone: number): void {
    this._ratio = Math.pow(2, semitone / 12);
    if (this._node) {
      const param = this._node.parameters.get('pitchRatio');
      if (param) param.setValueAtTime(this._ratio, this._ctxp.get().currentTime);
    }
  }

  supportsTimeStretch(): boolean {
    return true;
  }

  async insert(input: AudioNode, destination: AudioNode): Promise<void> {
    await this.ensureNode();

    this.remove();

    input.connect(this._node!);
    this._node!.connect(destination);

    this._input = input;
    this._destination = destination;
    this._inserted = true;
  }

  remove(): void {
    if (!this._inserted) return;

    try {
      this._input?.disconnect(this._node!);
    } catch {}

    try {
      this._node?.disconnect(this._destination!);
    } catch {}

    this._input = undefined;
    this._destination = undefined;
    this._inserted = false;
  }
}