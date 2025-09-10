import type {IAudioContextProvider} from "../../core/audio/IAudioContextProvider.ts";
import type {IMixer} from "../../core/audio/IMixer.ts";
import type {MicSession} from "./MicSession.ts";
import type {MusicSession} from "./MusicSession.ts";

export class KaraokeSession {
  private readonly _ctxp: IAudioContextProvider;
  private readonly _mixer: IMixer;
  private readonly _micSession: MicSession;
  private _musicSession?: MusicSession;
  constructor(
    ctxp: IAudioContextProvider,
    mixer: IMixer,
    micSession: MicSession,
    musicSession?: MusicSession,
  ) {
    this._ctxp = ctxp;
    this._mixer = mixer;
    this._micSession = micSession;
    this._musicSession = musicSession;
  }

  mic() {
    return this._micSession;
  }
  music() {
    return this._musicSession;
  }
  mixer() {
    return this._mixer;
  }
  ctx() {
    return this._ctxp;
  }

  attachMusic(music: MusicSession) {
    this._musicSession = music;
  }

  teardown() {
    try {
      this._mixer.close()
    } catch {}
  }
}