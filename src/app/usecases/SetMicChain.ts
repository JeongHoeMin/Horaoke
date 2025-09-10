import type {KaraokeSession} from "../sessions/KaraokeSession.ts";

export class SetMicChain {
  private _session: KaraokeSession
  constructor(session: KaraokeSession) {
    this._session = session;
  }

  setMinGain(v: number): void {
    this._session.mic().setMicGain(v);
  }

  setDelay(ms: number, fb: number):void {
    this._session.mic().setDelay(ms, fb);
  }

  setReverbMix(mix: number): void {
    this._session.mic().setReverbMix(mix);
  }
}