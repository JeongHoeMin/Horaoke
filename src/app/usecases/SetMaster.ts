import type {KaraokeSession} from "../services/KaraokeSession.ts";

export class SetMaster {
  private _session: KaraokeSession

  constructor(session: KaraokeSession) {
    this._session = session;
  }

  setMasterGain(v: number): void {
    this._session.mixer().setMasterGain(v);
  }
}