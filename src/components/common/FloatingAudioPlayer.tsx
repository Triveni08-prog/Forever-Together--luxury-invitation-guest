import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { weddingAudio } from '../../services/audioPlayer';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage } from '../../context/LanguageContext';

export const FloatingAudioPlayer: React.FC = () => {
  const { data } = useWedding();
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const unsub = weddingAudio.subscribe((playing, muted) => {
      setIsPlaying(playing);
      setIsMuted(muted);
    });
    return unsub;
  }, []);

  const handleTogglePlay = () => {
    weddingAudio.togglePlay(data.settings.musicUrl);
  };

  const handleToggleMute = () => {
    weddingAudio.toggleMute();
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 no-print">
      <div className="flex items-center gap-2 bg-[#FAF7F2]/95 backdrop-blur-md p-2 rounded-full border border-[#C5A059]/40 shadow-xl shadow-[#6B1724]/10 transition-all duration-300">
        {expanded && (
          <div className="pl-3 pr-2 flex items-center gap-2 text-xs text-[#2C2420]">
            <span className="font-serif italic max-w-[130px] truncate text-[#6B1724] font-medium">
              {data.settings.musicTitle || 'Raag Yaman Harmony'}
            </span>
            <button
              onClick={handleToggleMute}
              className="p-1.5 rounded-full hover:bg-[#F4EFE6] text-[#8C6D37] transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        )}

        <button
          onClick={handleTogglePlay}
          className={`flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 shadow-md ${
            isPlaying
              ? 'bg-[#6B1724] text-[#FAF7F2] ring-2 ring-[#C5A059]/50'
              : 'bg-[#C5A059] text-white hover:bg-[#B38D45]'
          }`}
          title={isPlaying ? t.envelope.soundOff : t.envelope.soundOn}
          aria-label={isPlaying ? t.envelope.soundOff : t.envelope.soundOn}
        >
          {isPlaying ? (
            <div className="flex items-center gap-0.5">
              <span className="w-0.5 h-3.5 bg-white animate-pulse" />
              <span className="w-0.5 h-5 bg-white animate-pulse delay-75" />
              <span className="w-0.5 h-2.5 bg-white animate-pulse delay-150" />
            </div>
          ) : (
            <Music className="w-5 h-5 text-[#FAF7F2]" />
          )}
        </button>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-6 h-6 flex items-center justify-center text-[#8C6D37] text-xs font-serif hover:text-[#6B1724]"
          title="Toggle player details"
        >
          {expanded ? '✕' : '♪'}
        </button>
      </div>
    </div>
  );
};
