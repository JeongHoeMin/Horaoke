import type {KaraokeSession} from "../sessions/KaraokeSession.ts";

export class PlayPauseMusic {
  private _session: KaraokeSession

  constructor(session: KaraokeSession) {
    this._session = session;
  }

  async play(): Promise<void> {
    await this._session.music()?.play();
  }

  async pause(): Promise<void> {
    await this._session.music()?.pause();
  }
}