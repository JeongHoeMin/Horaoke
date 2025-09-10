declare namespace YT {
  class Player {
    constructor(
      elementId: string | HTMLElement,
      options: {
        videoId?: string;
        playerVars?: Record<string, any>;
        events?: {
          onReady?: (event: any) => void;
          onStateChange?: (event: any) => void;
        };
      }
    );
    playVideo(): void;
    pauseVideo(): void;
    setVolume(volume: number): void;
  }
}

interface Window {
  onYouTubeIframeAPIReady?: () => void;
}