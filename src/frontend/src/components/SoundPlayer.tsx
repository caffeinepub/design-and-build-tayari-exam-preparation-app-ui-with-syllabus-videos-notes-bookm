import { useEffect, useRef } from 'react';

interface SoundPlayerProps {
  play: boolean;
  onEnded?: () => void;
}

export default function SoundPlayer({ play, onEnded }: SoundPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (play && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.warn('Audio playback failed:', error);
      });
    }
  }, [play]);

  return (
    <audio
      ref={audioRef}
      src="/assets/sounds/exam-finish-bell.mp3"
      onEnded={onEnded}
      preload="auto"
    />
  );
}
