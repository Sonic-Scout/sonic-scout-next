"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Tutorial = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Welcome to SonicScout",
      content: "Discover a new way to explore and manage your music collection with powerful tools and insights.",
      color: "bg-gradient-to-br from-primary/20 to-primary/10"
    },
    {
      title: "Discover New Features",
      content: "Our intuitive interface makes it easy to organize, filter, and find exactly what you're looking for.",
      color: "bg-gradient-to-br from-secondary/20 to-secondary/10"
    },
    {
      title: "Personalized Experience",
      content: "Customize your dashboard and get recommendations tailored to your unique music preferences.",
      color: "bg-gradient-to-br from-accent/20 to-accent/10"
    },
    {
      title: "Ready to Start",
      content: "You're all set! Begin your musical journey and unlock the full potential of SonicScout.",
      color: "bg-gradient-to-br from-primary/20 to-primary-foreground/10"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto advance slides
  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentSlide]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border border-border shadow-xl rounded-xl max-w-4xl w-full overflow-hidden">
        <div className="relative h-[600px] w-full">
          {/* Carousel track */}
          <div 
            className="h-full transition-transform duration-500 ease-out flex"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div 
                key={index}
                className={cn(
                  "min-w-full h-full flex flex-col items-center justify-center p-12",
                  slide.color
                )}
              >
                <div className="max-w-lg text-center">
                  <h2 className="text-4xl font-bold mb-6 text-foreground">{slide.title}</h2>
                  <p className="text-xl text-muted-foreground mb-8">{slide.content}</p>
                  
                  {/* Example UI element for visual interest */}
                  <div className="w-full h-40 rounded-xl bg-background/50 backdrop-blur-sm shadow-lg mb-8 flex items-center justify-center">
                    <div className="w-3/4 h-1/2 rounded-lg bg-primary/20 animate-pulse"></div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Slide {index + 1} of {slides.length}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation arrows */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 text-foreground"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 text-foreground"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          
          {/* Indicators */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  currentSlide === index ? "w-8 bg-primary" : "bg-muted"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 flex justify-between items-center border-t border-border bg-card">
          <p className="text-sm text-muted-foreground">Press ESC or click Close to exit the tutorial</p>
          <Button 
            variant="default"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;