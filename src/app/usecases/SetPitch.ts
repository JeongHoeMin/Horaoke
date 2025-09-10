import type {KaraokeSession} from "../services/KaraokeSession.ts";

export class SetPitch {
  private _session: KaraokeSession

  constructor(session: KaraokeSession) {
    this._session = session;
  }

  setSemitone(semitone: number): void {
    this._session.music()?.setPitchSemitone(semitone);
  }
}