import type {IAudioTrack} from "../IAudioTrack.ts";
import type {IAudioContextProvider} from "../IAudioContextProvider.ts";

const SRC_NODE_CACHE = new WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>();

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
    await new Promise<void>((res, rej) => {
      const onCanPlay = () => {
        cleanup();
        res();
      };
      const onError = () => {
        cleanup();
        rej(this._el.error);
      }
      const cleanup = () => {
        this._el.removeEventListener('canplay', onCanPlay)
        this._el.removeEventListener('error', onError)
      };

      if (this._el.readyState >= 3) return res();
      this._el.addEventListener('canplay', onCanPlay);
      this._el.addEventListener('error', onError);
      this._el.load();
    });

    const ctx = this._ctxp.get();

    this._srcNode = SRC_NODE_CACHE.get(this._el) ?? ctx.createMediaElementSource(this._el);
    SRC_NODE_CACHE.set(this._el, this._srcNode);

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

  async replaceSource(url: string) {
    this._el.src = url;
    this._isReady = false;
    await this.prepare();
  }
}
