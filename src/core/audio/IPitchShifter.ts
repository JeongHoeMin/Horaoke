export interface IPitchShifter {
  setSemitone(semitone: number): void;
  bindToMedia?(el: HTMLMediaElement): void;
  insert?(input: AudioNode, destination: AudioNode): void;
  remove?(): void;
  supportsTimeStretch(): boolean;
}
