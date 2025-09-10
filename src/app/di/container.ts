import {WebAudioContextProvider} from "../../core/audio/web/WebAudioContextProvider.ts";
import {MixerBus} from "../../core/audio/web/MixerBus.ts";
import {MicInputWeb} from "../../core/audio/web/MicInputWeb.ts";
import {MusicElementTrack} from "../../core/audio/web/MusicElementTrack.ts";
import {DelayEffect} from "../../core/audio/web/effects/DelayEffect.ts";
import {ConvolverReverb} from "../../core/audio/web/effects/ConvolverReverb.ts";
import {MicGainEffect} from "../../core/audio/web/effects/MicGainEffect.ts";
import {WorkletPitchShifter} from "../../core/audio/web/shifters/WorkletPitchShifter.ts";
import {MicSession} from "../sessions/MicSession.ts";
import {MusicSession} from "../sessions/MusicSession.ts";
import {KaraokeSession} from "../sessions/KaraokeSession.ts";

export interface Container {
  session: KaraokeSession;
}

export function createContainer(audioEl?: HTMLAudioElement, srcUrl?: string): Container {
  const ctxp = new WebAudioContextProvider();
  const mixer = new MixerBus(ctxp);

  const mic = new MicInputWeb(ctxp);
  const micGain = new MicGainEffect(ctxp, 1.0);
  const delay = new DelayEffect(ctxp, 120, 0.25);
  const reverb = new ConvolverReverb(ctxp, 0.3);
  const micSession = new MicSession(mic, mixer, micGain, delay, reverb);

  let musicSession: MusicSession | undefined;
  if (audioEl && srcUrl) {
    const track = new MusicElementTrack(ctxp, audioEl, srcUrl);
    const pitch = new WorkletPitchShifter(ctxp);
    musicSession = new MusicSession(track, mixer, pitch);
  }

  const session = new KaraokeSession(ctxp, mixer, micSession, musicSession);
  return { session };
}