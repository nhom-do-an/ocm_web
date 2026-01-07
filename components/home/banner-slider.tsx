'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Image from 'next/image';

const banners = [
  {
    id: 1,
    image: '/images/banners/banner1.jpg',
    alt: 'Bộ sưu tập từ thiên nhiên Harmony',
  },
  {
    id: 2,
    image: '/images/banners/banner2.jpg',
    alt: 'Bộ sưu tập từ thiên nhiên Mocha',
  },
];

export function BannerSlider() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaApi, setEmblaApi] = useState<any>(undefined);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  const goToPrevious = () => emblaApi?.scrollPrev();
  const goToNext = () => emblaApi?.scrollNext();
  const goToSlide = (index: number) => emblaApi?.scrollTo(index);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <Carousel
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 3000 })]}
        setApi={setEmblaApi}
        className="h-full"
      >
        <CarouselContent className="h-full">
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="w-full h-full flex-shrink-0">
              <Image src={banner.image} alt={banner.alt} className="w-full h-full object-cover" width={800} height={400} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-10 w-10 p-0 rounded-full"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-10 w-10 p-0 rounded-full"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${index === selectedIndex ? 'bg-white' : 'bg-white/50'
              }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}