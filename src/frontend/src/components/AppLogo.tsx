import { useState } from 'react';

interface AppLogoProps {
  className?: string;
  alt?: string;
}

/**
 * AppLogo component with fallback support.
 * 
 * Attempts to load a custom logo from /assets/app-logo.png first.
 * If that fails, falls back to the generated logo at /assets/generated/app-logo.dim_512x512.png.
 * 
 * To use a custom logo, place your image at: frontend/public/assets/app-logo.png
 */
export default function AppLogo({ className = 'w-10 h-10', alt = 'Tayari Logo' }: AppLogoProps) {
  const [useCustom, setUseCustom] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  const handleError = () => {
    if (useCustom) {
      setUseCustom(false);
      setUseFallback(true);
    }
  };

  const logoSrc = useCustom && !useFallback
    ? '/assets/app-logo.png'
    : '/assets/generated/app-logo.dim_512x512.png';

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
