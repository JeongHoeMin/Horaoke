import type {KaraokeSession} from "../sessions/KaraokeSession.ts";

export class SetMusicChain {
  private _session: KaraokeSession

  constructor(session: KaraokeSession) {
    this._session = session;
  }

  setMusicGain(v: number): void {
    this._session.music()?.setGain(v);
  }
}