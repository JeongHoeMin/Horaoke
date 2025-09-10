import type {IAudioTrack} from "../IAudioTrack.ts";
import type {IAudioContextProvider} from "../IAudioContextProvider.ts";

export class MusicElementTrack implements IAudioTrack {
  private readonly _el: HTMLAudioElement;
  private _srcNode: MediaElementAudioSourceNode | null = null;
  private _gain: GainNode | null = null;
  private _isReady: boolean = false;
  private _playing: boolean = false;
  private readonly _ctxp: IAudioContextProvider;

  constructor(
    ctxp: IAudioContextProvider,
    el: HTMLAudioElement,
    srcUrl: string,
  ) {
    this._el = el;
    this._ctxp = ctxp;

    this._el.crossOrigin = 'anonymous';
    this._el.src = srcUrl;
  }

  async prepare(): Promise<void> {
    if (this._isReady) return;
    await new Promise<void>(res => {
      this._el.oncanplay = () => res();
    });
    const ctx = this._ctxp.get();
    this._srcNode = ctx.createMediaElementSource(this._el);
    this._gain = ctx.createGain();
    this._gain.gain.value = 1.0;
    this._srcNode.connect(this._gain);
    this._isReady = true;
  }

  async play(): Promise<void> {
    await this._ctxp.ensureResumed();
    await this._el.play();
    this._playing = true;
  }

  async pause(): Promise<void> {
    this._el.pause();
    this._playing = false;
  }

  isPlaying(): boolean {
    return this._playing && !this._el.paused;
  }

  output(): AudioNode | null {
    return this._gain;
  }

  setGain(v: number): void {
    if (this._gain) this._gain.gain.value = v;
  }

  element(): HTMLAudioElement {
    return this._el;
  }
}
