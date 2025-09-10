import type {KaraokeSession} from "../sessions/KaraokeSession.ts";

export class StartMic {
  private _session: KaraokeSession;

  constructor(session: KaraokeSession) {
    this._session = session;
  }

  async exec(): Promise<void> {
    await this._session.mic().start();
  }
}