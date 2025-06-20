import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, CheckCircle } from "lucide-react";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const CARDS = [
  {
    icon: Clock,
    title: "Focus Sessions",
    description: "Break your work into focused 16-minute sessions to maintain peak concentration and avoid burnout.",
    color: "text-primary bg-primary/10"
  },
  {
    icon: Calendar,
    title: "Daily Schedule",
    description: "Set your preferred time for focus sessions and build a consistent daily routine that works for you.",
    color: "text-purple-600 bg-purple-600/10"
  },
  {
    icon: CheckCircle,
    title: "Stay Consistent",
    description: "Track your progress and maintain momentum with gentle reminders and completion celebrations.",
    color: "text-green-500 bg-green-500/10"
  }
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const swipeDistance = touchStartX.current - touchEndX.current;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0 && currentCard < CARDS.length - 1) {
        // Swipe left - next card
        setCurrentCard(currentCard + 1);
      } else if (swipeDistance < 0 && currentCard > 0) {
        // Swipe right - previous card
        setCurrentCard(currentCard - 1);
      }
    }
  };

  const getCardStyle = (index: number) => {
    if (index === currentCard) {
      return {
        zIndex: 3,
        transform: 'translateX(0) scale(1)',
        opacity: 1
      };
    } else if (index === currentCard + 1) {
      return {
        zIndex: 2,
        transform: 'translateX(8px) scale(0.95)',
        opacity: 0.8
      };
    } else if (index === currentCard + 2) {
      return {
        zIndex: 1,
        transform: 'translateX(16px) scale(0.9)',
        opacity: 0.6
      };
    } else {
      return {
        zIndex: 0,
        transform: 'translateX(100%) scale(0.8)',
        opacity: 0
      };
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-bold text-foreground text-center">16mins</h1>
        <p className="text-muted-foreground text-center mt-2">Focus in 16-minute sessions</p>
      </div>

      {/* Card Deck Container */}
      <div className="flex-1 relative px-6 pb-6">
        <div 
          className="card-deck h-full"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="card-item absolute inset-0 bg-card rounded-2xl shadow-lg border border-border"
                style={getCardStyle(index)}
              >
                <div className="p-8 h-full flex flex-col justify-center text-center">
                  <div className={`w-16 h-16 ${card.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{card.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Card Indicators */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {CARDS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentCard ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Get Started Button */}
      <div className="px-6 pb-8">
        <Button 
          onClick={onComplete}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 px-6 rounded-xl touch-feedback shadow-lg active:shadow-md transition-all duration-150"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
