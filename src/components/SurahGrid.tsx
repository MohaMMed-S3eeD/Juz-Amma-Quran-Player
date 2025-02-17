import React from 'react';
import type { Surah } from '../types';

interface SurahGridProps {
  surahs: Surah[];
  currentSurah: Surah | null;
  onSurahSelect: (surah: Surah) => void;
}

const SurahGrid: React.FC<SurahGridProps> = ({
  surahs,
  currentSurah,
  onSurahSelect,
}) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {surahs.map((surah) => (
        <button
          key={surah.number}
          onClick={() => onSurahSelect(surah)}
          className={`
            p-6 rounded-2xl text-right transition-all duration-300 group
            ${
              currentSurah?.number === surah.number
                ? 'bg-emerald-900/40 ring-2 ring-emerald-500'
                : 'bg-black/60 hover:bg-black/70'
            }
            backdrop-blur-xl border border-emerald-900/20 hover:border-emerald-700/50
            hover:transform hover:scale-105 shadow-lg
          `}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-emerald-500 text-lg font-arabic">
              {surah.number}
            </span>
            <h3 className="text-3xl font-arabic text-emerald-200 group-hover:text-emerald-100 drop-shadow-sm">
              {surah.name}
            </h3>
          </div>
          <div className="text-emerald-300/60 text-sm font-arabic">
            {formatTime(surah.startTime)} - {formatTime(surah.endTime)}
          </div>
        </button>
      ))}
    </div>
  );
};

export default SurahGrid;