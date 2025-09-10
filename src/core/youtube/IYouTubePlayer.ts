export interface IYouTubePlayer {
  load(videoId: string): Promise<void>;
  play(): void;
  pause(): void;
  setVolume(vol0to100: number): void;
}