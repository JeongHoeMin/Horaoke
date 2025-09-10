import {createContainer} from "../../app/di/container.ts";
import {onBeforeUnmount, ref} from "vue";
import {StartMic} from "../../app/usecases/StartMic.ts";
import {StopMic} from "../../app/usecases/StopMic.ts";
import {LoadMusicFile} from "../../app/usecases/LoadMusicFile.ts";
import {PlayPauseMusic} from "../../app/usecases/PlayPauseMusic.ts";
import {SetMicChain} from "../../app/usecases/SetMicChain.ts";
import {SetMusicChain} from "../../app/usecases/SetMusicChain.ts";
import {SetMaster} from "../../app/usecases/SetMaster.ts";
import {SetPitch} from "../../app/usecases/SetPitch.ts";
import {getErrorMessage} from "../../app/modules/ErrorModule.ts";
import type {IAudioTrack} from "../../core/audio/IAudioTrack.ts";
import {MusicElementTrack} from "../../core/audio/web/MusicElementTrack.ts";
import type {IPitchShifter} from "../../core/audio/IPitchShifter.ts";
import {WorkletPitchShifter} from "../../core/audio/web/shifters/WorkletPitchShifter.ts";
import {MusicSession} from "../../app/sessions/MusicSession.ts";


export function useKaraoke() {
  const { session } = createContainer();

  const busy = ref<boolean>(false);
  const micOn = ref<boolean>(false);
  const musicOn = ref<boolean>(false);
  const error = ref<string|null>(null);

  const startMicUC = new StartMic(session);
  const stopMicUC = new StopMic(session);
  const loadMusicUC = new LoadMusicFile(session);
  const playPauseUC = new PlayPauseMusic(session);
  const micUC = new SetMicChain(session);
  const musicUC = new SetMusicChain(session);
  const masterUC = new SetMaster(session);
  const pitchUC = new SetPitch(session);

  async function startMic() {
    try {
      busy.value = true;
      error.value = null;

      await startMicUC.exec();
      micOn.value = true;
    } catch (e: unknown) {
      error.value = getErrorMessage(e);
    } finally {
      busy.value = false;
    }
  }

  function stopMic() {
    stopMicUC.exec();
    micOn.value = false;
  }

  async function attachMusicFromUrl(audioEl: HTMLAudioElement, url: string) {
    const track: IAudioTrack = new MusicElementTrack(session.ctx(), audioEl, url);
    const pitch: IPitchShifter = new WorkletPitchShifter(session.ctx());
    await attachMusic(track, pitch);
  }

  async function attachMusicFromFile(audioEl: HTMLAudioElement, file: File) {
    const url = URL.createObjectURL(file);
    await attachMusicFromUrl(audioEl, url);
  }

  async function attachMusic(track: IAudioTrack, pitch: IPitchShifter) {
    const music = new MusicSession(track, session.mixer(), pitch);
    session.attachMusic(music);
    await loadMusicUC.exec();
  }

  async function playMusic() {
    await playPauseUC.play();
    musicOn.value = true;
  }

  async function pauseMusic() {
    await playPauseUC.pause();
    musicOn.value = false;
  }

  function setMicGain(v: number) {
    micUC.setMinGain(v);
  }

  function setDelay(ms: number, fb: number) {
    micUC.setDelay(ms, fb);
  }

  function setReverbMix(mix: number) {
    micUC.setReverbMix(mix);
  }

  function setMusicGain(v: number) {
    musicUC.setMusicGain(v);
  }

  function setMasterGain(v: number) {
    masterUC.setMasterGain(v);
  }

  function setPitchSemitone(semi: number) {
    pitchUC.setSemitone(semi);
  }

  onBeforeUnmount(() => session.teardown());

  return {
    // state
    busy,
    micOn,
    musicOn,
    error,

    // actions
    startMic,
    stopMic,
    attachMusic,
    attachMusicFromUrl,
    attachMusicFromFile,
    playMusic,
    pauseMusic,

    // params
    setMicGain,
    setDelay,
    setReverbMix,
    setMusicGain,
    setMasterGain,
    setPitchSemitone,
  }
}