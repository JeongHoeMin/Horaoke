import type {IPitchShifter} from "../../IPitchShifter.ts";

export class PlaybackRatePitchShifter implements IPitchShifter {
  private _el?: HTMLMediaElement;
  private _semitone: number = 0;

  bindToMedia(el: HTMLMediaElement): void {
    this._el = el;
    this.apply();
  }

  setSemitone(semitone: number): void {
    this._semitone = semitone;
    this.apply();
  }

  supportsTimeStretch(): boolean {
    return false;
  }

  private apply() {
    if (!this._el) return;
    const ratio = Math.pow(2, this._semitone / 12);
    this._el.playbackRate = ratio;
  }
}