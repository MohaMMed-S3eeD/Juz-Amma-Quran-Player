export interface Surah {
  number: number;
  name: string;
  startTime: number;
  endTime: number;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isRepeating: boolean;
  currentSurah: Surah | null;
  isLoading: boolean;
  error: string | null;
}