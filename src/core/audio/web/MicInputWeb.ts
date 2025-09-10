import type {IMicInput, MicConstraints} from "../IMicInput.ts";
import type {IAudioContextProvider} from "../IAudioContextProvider.ts";

export class MicInputWeb implements IMicInput {
  private _stream: MediaStream | null = null;
  private _source: MediaStreamAudioSourceNode | null = null;
  private readonly _ctxp: IAudioContextProvider;
  constructor(ctxp: IAudioContextProvider) {
    this._ctxp = ctxp;
  }

  async start(constraints?: MicConstraints): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: constraints?.echoCancellation ?? true,
        noiseSuppression: constraints?.noiseSuppression ?? true,
        autoGainControl: constraints?.autoGainControl ?? false,
        channelCount: constraints?.channelCount ?? 1,
        sampleRate: constraints?.sampleRate,
      },
      video: false,
    });
    this._stream = stream;
    this._source = this._ctxp.get().createMediaStreamSource(stream);
    await this._ctxp.ensureResumed();
  }

  stop(): void {
    this._source?.disconnect();
    this._source = null;
    if (this._stream) {
      this._stream.getTracks().forEach((t) => t.stop());
      this._stream = null;
    }
  }

  output(): MediaStreamAudioSourceNode | null {
    return this._source;
  }
}