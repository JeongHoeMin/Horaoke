import type {KaraokeSession} from "../sessions/KaraokeSession.ts";

export class LoadMusicFile {
  private _session: KaraokeSession;

  constructor(session: KaraokeSession) {
    this._session = session;
  }

  async exec(): Promise<void> {
    await this._session.music()?.prepare();
  }
}