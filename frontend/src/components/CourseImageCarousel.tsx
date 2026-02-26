import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseImageCarouselProps {
  images: string[];
  autoAdvanceInterval?: number;
}

export default function CourseImageCarousel({ 
  images, 
  autoAdvanceInterval = 3000 
}: CourseImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoAdvanceInterval);

    return () => clearInterval(timer);
  }, [images.length, autoAdvanceInterval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-lg shadow-lg aspect-[3/2]">
        <img
          src={images[currentIndex]}
          alt={`खरिदार कोर्स ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        
        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-slate-800 rounded-full shadow-md"
          onClick={goToPrevious}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-slate-800 rounded-full shadow-md"
          onClick={goToNext}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Indicators */}
      <div className="flex items-center justify-center space-x-2 mt-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-6' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
