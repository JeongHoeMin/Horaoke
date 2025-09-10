import type {KaraokeSession} from "../sessions/KaraokeSession.ts";

export class StopMic {
  private _session: KaraokeSession;

  constructor(session: KaraokeSession) {
    this._session = session;
  }

  exec(): void {
    this._session.mic().stop();
  }
}