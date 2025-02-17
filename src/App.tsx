import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import Controls from './components/Controls';
import ProgressBar from './components/ProgressBar';
import SurahGrid from './components/SurahGrid';
import { surahs } from './data/surahs';
import type { PlayerState, Surah } from './types';

const YOUTUBE_VIDEO_ID = 'Fg1IYYGMt5k';

function App() {
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 100,
    isMuted: false,
    isRepeating: false,
    currentSurah: surahs[0],
    isLoading: true,
    error: null,
  });

  const playerRef = useRef<any>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const handlePlayPause = () => {
    if (playerState.isPlaying) {
      playerRef.current?.pauseVideo();
    } else {
      playerRef.current?.playVideo();
    }
    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleSurahSelect = async (surah: Surah) => {
    if (playerRef.current && isPlayerReady) {
      try {
        // Set time and play in sequence
        await playerRef.current.seekTo(surah.startTime);
        await playerRef.current.playVideo();
        
        setPlayerState(prev => ({ 
          ...prev, 
          currentSurah: surah, 
          isPlaying: true,
          isLoading: false
        }));

        videoContainerRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      } catch (error) {
        console.error('Error playing video:', error);
      }
    }
  };

  const handlePrevious = () => {
    if (playerState.currentSurah) {
      const currentIndex = surahs.findIndex(s => s.number === playerState.currentSurah?.number);
      if (currentIndex > 0) {
        handleSurahSelect(surahs[currentIndex - 1]);
      }
    }
  };

  const handleNext = () => {
    if (playerState.currentSurah) {
      const currentIndex = surahs.findIndex(s => s.number === playerState.currentSurah?.number);
      if (currentIndex < surahs.length - 1) {
        handleSurahSelect(surahs[currentIndex + 1]);
      }
    }
  };

  const handleVolumeChange = (value: number) => {
    if (playerRef.current) {
      const volume = Math.max(0, Math.min(100, value));
      playerRef.current.setVolume(volume);
      setPlayerState(prev => ({ ...prev, volume, isMuted: volume === 0 }));
    }
  };

  const handleToggleMute = () => {
    if (playerRef.current) {
      const newMuted = !playerState.isMuted;
      const newVolume = newMuted ? 0 : (playerState.volume || 100);
      playerRef.current.setVolume(newVolume);
      setPlayerState(prev => ({ ...prev, isMuted: newMuted, volume: newVolume }));
    }
  };

  const handleToggleRepeat = () => {
    setPlayerState(prev => ({ ...prev, isRepeating: !prev.isRepeating }));
  };

  const handleSeek = (time: number) => {
    if (playerRef.current) {
      const adjustedTime = playerState.currentSurah.startTime + time;
      playerRef.current.seekTo(adjustedTime);
    }
  };

  const handleRestart = () => {
    if (playerRef.current && playerState.currentSurah) {
      playerRef.current.seekTo(playerState.currentSurah.startTime);
      if (!playerState.isPlaying) {
        playerRef.current.playVideo();
        setPlayerState(prev => ({ ...prev, isPlaying: true }));
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && playerState.currentSurah) {
        const currentTime = playerRef.current.getCurrentTime();
        const surahRelativeTime = currentTime - playerState.currentSurah.startTime;
        const surahDuration = playerState.currentSurah.endTime - playerState.currentSurah.startTime;
        
        setPlayerState(prev => ({ 
          ...prev, 
          currentTime: surahRelativeTime,
          duration: surahDuration
        }));

        if (currentTime >= playerState.currentSurah.endTime) {
          if (playerState.isRepeating) {
            handleSurahSelect(playerState.currentSurah);
          } else {
            handleNext();
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playerState.currentSurah, playerState.isRepeating]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-6xl font-arabic text-center mb-12 text-emerald-200 drop-shadow-lg">
          جزء عم
        </h1>
        
        <div ref={videoContainerRef} className="bg-black/70 backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-2xl border border-emerald-900/30">
          <div className="relative w-full h-0 pb-[56.25%] mb-8 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-emerald-900/50">
            <YouTube
              videoId={YOUTUBE_VIDEO_ID}
              opts={{
                height: '100%',
                width: '100%',
                playerVars: {
                  controls: 0,
                  disablekb: 1,
                  autoplay: 1,
                  start: playerState.currentSurah?.startTime || 0,
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0,
                  iv_load_policy: 3,
                  fs: 0,
                  playsinline: 1,
                  enablejsapi: 1,
                },
              }}
              className="absolute top-0 left-0 w-full h-full"
              onReady={(event) => {
                playerRef.current = event.target;
                event.target.setVolume(playerState.volume);
                // Prevent right-click menu
                const iframe = event.target.getIframe();
                iframe.style.pointerEvents = 'none';
                setIsPlayerReady(true);
                setPlayerState(prev => ({
                  ...prev,
                  isLoading: false,
                  duration: event.target.getDuration(),
                }));
              }}
              onStateChange={(event) => {
                setPlayerState(prev => ({
                  ...prev,
                  isPlaying: event.data === 1,
                }));
              }}
              onError={() => {
                setPlayerState(prev => ({
                  ...prev,
                  error: 'حدث خطأ أثناء تحميل الفيديو',
                }));
              }}
            />
          </div>

          {playerState.error ? (
            <div className="text-red-500 text-center p-4 bg-red-100/10 rounded-lg mb-4">
              {playerState.error}
            </div>
          ) : null}

          <div className="space-y-8">
            {playerState.currentSurah && (
              <div className="text-center">
                <h2 className="text-3xl font-arabic text-emerald-200 drop-shadow-md">
                  سورة {playerState.currentSurah.name}
                </h2>
              </div>
            )}

            <ProgressBar
              currentTime={playerState.currentTime}
              duration={playerState.duration}
              onSeek={handleSeek}
            />

            <Controls
              isPlaying={playerState.isPlaying}
              volume={playerState.volume}
              isMuted={playerState.isMuted}
              isRepeating={playerState.isRepeating}
              onPlayPause={handlePlayPause}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onVolumeChange={handleVolumeChange}
              onToggleMute={handleToggleMute}
              onToggleRepeat={handleToggleRepeat}
              onRestart={handleRestart}
            />
          </div>
        </div>

        <SurahGrid
          surahs={surahs}
          currentSurah={playerState.currentSurah}
          onSurahSelect={handleSurahSelect}
        />
      </div>
    </div>
  );
}

export default App;