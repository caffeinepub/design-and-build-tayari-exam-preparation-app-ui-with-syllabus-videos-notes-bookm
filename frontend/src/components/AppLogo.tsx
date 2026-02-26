import { useState } from 'react';

interface AppLogoProps {
  className?: string;
  alt?: string;
}

/**
 * AppLogo component with fallback support.
 * 
 * Displays the 3D education globe logo from /assets/generated/app-logo.dim_512x512.png.
 * Falls back to the Thah Study logo if the primary logo fails to load.
 */
export default function AppLogo({ className = 'w-10 h-10', alt = 'Tayari Logo' }: AppLogoProps) {
  const [usePrimary, setUsePrimary] = useState(true);

  const handleError = () => {
    if (usePrimary) {
      setUsePrimary(false);
    }
  };

  const logoSrc = usePrimary
    ? '/assets/generated/app-logo.dim_512x512.png'
    : '/assets/generated/thah-study-logo.dim_512x512.png';

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
