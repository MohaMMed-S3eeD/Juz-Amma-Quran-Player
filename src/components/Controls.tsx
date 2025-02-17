import React from 'react';
import { 
  PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon,
  ArrowPathIcon, BackwardIcon, ForwardIcon 
} from '@heroicons/react/24/solid';

interface ControlsProps {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isRepeating: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onVolumeChange: (value: number) => void;
  onToggleMute: () => void;
  onToggleRepeat: () => void;
  onRestart: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  volume,
  isMuted,
  isRepeating,
  onPlayPause,
  onPrevious,
  onNext,
  onVolumeChange,
  onToggleMute,
  onToggleRepeat,
  onRestart,
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onToggleRepeat}
        className={`p-2 rounded-full hover:bg-emerald-700/30 transition-colors ${
          isRepeating ? 'text-emerald-400' : 'text-emerald-50'
        }`}
      >
        <ArrowPathIcon className="w-6 h-6" />
      </button>

      <button
        onClick={onPrevious}
        className="p-2 rounded-full hover:bg-emerald-700/30 transition-colors"
      >
        <BackwardIcon className="w-6 h-6" />
      </button>

      <button
        onClick={onPlayPause}
        className="p-4 rounded-full bg-emerald-600 hover:bg-emerald-500 transition-colors"
      >
        {isPlaying ? (
          <PauseIcon className="w-8 h-8" />
        ) : (
          <PlayIcon className="w-8 h-8" />
        )}
      </button>

      <button
        onClick={onNext}
        className="p-2 rounded-full hover:bg-emerald-700/30 transition-colors"
      >
        <ForwardIcon className="w-6 h-6" />
      </button>

      <button
        onClick={onRestart}
        className="p-3 text-emerald-200 hover:text-emerald-400 transition-colors"
        title="إعادة السورة من البداية"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12c0 4.97 4.03 9 9 9s9-4.03 9-9-4.03-9-9-9m0 18c-4.97 0-9-4.03-9-9s4.03-9 9-9" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
        </svg>
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMute}
          className="p-2 rounded-full hover:bg-emerald-700/30 transition-colors"
        >
          {isMuted ? (
            <SpeakerXMarkIcon className="w-6 h-6" />
          ) : (
            <SpeakerWaveIcon className="w-6 h-6" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-24 h-2 rounded-full appearance-none bg-emerald-900/50 cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-emerald-400
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:hover:bg-emerald-300
            [&::-webkit-slider-thumb]:transition-colors"
        />
      </div>
    </div>
  );
};

export default Controls;