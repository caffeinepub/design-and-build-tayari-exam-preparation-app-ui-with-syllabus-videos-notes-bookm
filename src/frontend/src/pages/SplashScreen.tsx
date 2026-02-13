import { useEffect } from 'react';
import AppLogo from '@/components/AppLogo';

export default function SplashScreen() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
      <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse" />
          <AppLogo className="relative w-40 h-40 drop-shadow-2xl" />
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg animate-in slide-in-from-bottom-4 duration-700 delay-150">
            सफलता को साथी
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 right-8 text-white/90 text-sm font-medium">
        Janak prasad pande
      </div>
    </div>
  );
}
