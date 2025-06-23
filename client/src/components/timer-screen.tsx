// ... existing imports ...
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Play, Square } from "lucide-react";
import { useTimer } from "@/hooks/use-timer";
import { storage } from "@/lib/storage";

interface TimerScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function TimerScreen({ onBack, onComplete }: TimerScreenProps) {
  const [sessionCount, setSessionCount] = useState(1);

  // Save session to local storage when timer completes
  const handleSessionComplete = () => {
    storage.createSession({
      duration: 16 * 60, // 16 minutes in seconds
    });
    setSessionCount((prev) => prev + 1);
    onComplete();
  };

  const {
    timeLeft,
    isRunning,
    isCompleted,
    progress,
    formatTime,
    start,
    pause,
    reset
  } = useTimer({
    initialTime: 16 * 60,
    onComplete: handleSessionComplete,
  });

  const handleStop = () => {
    pause();
  };

  const circumference = 2 * Math.PI * 140; // radius of 140
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h2 className="text-xl font-semibold text-foreground">16mins Timer</h2>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Timer Container */}
      <div className="flex-1 timer-container flex flex-col justify-center items-center px-6">
        {/* Timer Circle */}
        <div className="relative mb-16">
          {/* Background Ring */}
          <div className="absolute inset-0 w-80 h-80">
            <svg className="w-full h-full progress-ring" viewBox="0 0 320 320">
              <circle 
                cx="160" 
                cy="160" 
                r="140" 
                stroke="hsl(var(--border))" 
                strokeWidth="12" 
                fill="none"
              />
            </svg>
          </div>

          {/* Progress Ring */}
          <div className="absolute inset-0 w-80 h-80">
            <svg className="w-full h-full progress-ring" viewBox="0 0 320 320">
              <circle
                cx="160"
                cy="160"
                r="140"
                stroke="hsl(var(--primary))"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="timer-circle"
              />
            </svg>
          </div>

          {/* Pulse Ring (when active) */}
          {isRunning && (
            <div className="absolute inset-0 w-80 h-80">
              <div className="w-full h-full rounded-full border-4 border-primary/30 pulse-ring"></div>
            </div>
          )}

          {/* Timer Display */}
          <div className="w-80 h-80 flex flex-col items-center justify-center">
            <div className="text-7xl font-bold text-foreground font-mono mb-4">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xl text-muted-foreground mb-6">
              {isRunning ? 'Focusing...' : timeLeft === 16 * 60 ? 'Ready to focus' : 'Paused'}
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Session</div>
              <div className="text-2xl font-semibold text-foreground">{sessionCount}</div>
            </div>
          </div>
        </div>

        {/* Simple Controls */}
        <div className="flex items-center justify-center space-x-8">
          {/* Start Button */}
          {!isRunning && (
            <Button
              onClick={start}
              className="w-24 h-24 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full touch-feedback shadow-lg active:shadow-md transition-all duration-150 text-lg font-medium"
            >
              <Play className="w-10 h-10 ml-1" />
            </Button>
          )}

          {/* Stop Button */}
          {isRunning && (
            <Button
              onClick={handleStop}
              className="w-24 h-24 bg-red-500 hover:bg-red-600 text-white rounded-full touch-feedback shadow-lg active:shadow-md transition-all duration-150 text-lg font-medium"
            >
              <Square className="w-10 h-10" />
            </Button>
          )}

          {/* Restart Button */}
          <Button
            onClick={reset}
            className="w-20 h-20 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full touch-feedback shadow-sm active:shadow-none transition-all duration-150"
          >
            <RotateCcw className="w-8 h-8" />
          </Button>
        </div>

        {/* Button Labels */}
        <div className="flex items-center justify-center space-x-8 mt-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground font-medium">
              {isRunning ? 'Stop' : 'Start'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground font-medium">Restart</div>
          </div>
        </div>
      </div>
    </div>
  );
}