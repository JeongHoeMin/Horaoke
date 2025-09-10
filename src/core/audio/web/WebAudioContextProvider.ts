import type {IAudioContextProvider} from "../IAudioContextProvider.ts";

export class WebAudioContextProvider implements IAudioContextProvider {
  private readonly ctx: AudioContext;

  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  get(): AudioContext {
    return this.ctx;
  }

  async ensureResumed(): Promise<void> {
    if (this.ctx.state === 'suspended') await this.ctx.resume();
  }

  async close(): Promise<void> {
    await this.ctx.close();
  }
}