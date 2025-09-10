import type {IYouTubePlayer} from "./IYouTubePlayer.ts";

export class YouTubeIframeAdapter implements IYouTubePlayer {
  private _player?: YT.Player;
  private _elId: string;

  constructor(elId: string) {
    this._elId = elId;
  }

  async load(videoId: string): Promise<void> {
      await this.ensureApi();
      this._player = new YT.Player(this._elId, {
        videoId, playerVars: { playsinline: 1 }
      });
  }

  play(): void {
    this._player?.playVideo;
  }

  pause(): void {
    this._player?.pauseVideo;
  }

  private ensureApi(): Promise<void> {
    return new Promise((res) => {
      if ((window as any).YT?.Player) return res();
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = () => res();
      document.head.appendChild(tag);
    })
  }

  setVolume(vol0to100: number): void {
    const clamped = Math.max(0, Math.min(100, vol0to100));
    this._player?.setVolume(clamped);
  }
}// 라이나손보 롯데카드 노원 녹취가 error 쪽으로 빠져있는데