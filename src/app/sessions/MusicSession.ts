import type {IAudioTrack} from "../../core/audio/IAudioTrack.ts";
import type {IMixer} from "../../core/audio/IMixer.ts";
import type {IPitchShifter} from "../../core/audio/IPitchShifter.ts";

export class MusicSession {
  private _track: IAudioTrack;
  private _mixer: IMixer;
  private _pitch: IPitchShifter;

  constructor(
    track: IAudioTrack,
    mixer: IMixer,
    pitch: IPitchShifter,
  ) {
    this._track = track;
    this._mixer = mixer;
    this._pitch = pitch;
  }

  async prepare(): Promise<void> {
    await this._track.prepare();
    this.connectChain();
  }

  connectChain(): void {
    const out = this._track.output();
    if (!out) return;

    const bus = this._mixer.bus();

    if (this._pitch.insert) this._pitch.insert(out, bus);
    else out.connect(bus);
  }

  async play(): Promise<void> {
    await this._track.play();
  }

  async pause(): Promise<void> {
    await this._track.pause();
  }

  setGain(v: number): void {
    this._track.setGain(v);
  }

  setPitchSemitone(semitone: number): void {
    this._pitch.setSemitone(semitone);
  }
}