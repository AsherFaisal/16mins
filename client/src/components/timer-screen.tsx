import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Settings, RotateCcw, Play, Pause, SkipForward, Music, Target, BarChart3 } from "lucide-react";
import { useTimer } from "@/hooks/use-timer";

interface TimerScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function TimerScreen({ onBack, onComplete }: TimerScreenProps) {
  const [sessionCount, setSessionCount] = useState(1);
  
  const {
    timeLeft,
    isRunning,
    isCompleted,
    progress,
    formatTime,
    start,
    pause,
    reset,
    skip
  } = useTimer({
    initialTime: 16 * 60, // 16 minutes in seconds
    onComplete: () => {
      setSessionCount(prev => prev + 1);
      onComplete();
    }
  });

  const circumference = 2 * Math.PI * 120; // radius of 120
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="h-screen flex flex-col">
      {/* Header with Settings */}
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
          <h2 className="text-xl font-semibold text-foreground">Focus Timer</h2>
          <Button 
            variant="ghost" 
            size="icon"
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Timer Container */}
      <div className="flex-1 timer-container flex flex-col justify-center items-center px-6">
        {/* Timer Circle */}
        <div className="relative mb-12">
          {/* Background Ring */}
          <div className="absolute inset-0 w-72 h-72">
            <svg className="w-full h-full progress-ring" viewBox="0 0 288 288">
              <circle 
                cx="144" 
                cy="144" 
                r="120" 
                stroke="hsl(var(--border))" 
                strokeWidth="8" 
                fill="none"
              />
            </svg>
          </div>

          {/* Progress Ring */}
          <div className="absolute inset-0 w-72 h-72">
            <svg className="w-full h-full progress-ring" viewBox="0 0 288 288">
              <circle
                cx="144"
                cy="144"
                r="120"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
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
            <div className="absolute inset-0 w-72 h-72">
              <div className="w-full h-full rounded-full border-4 border-primary/30 pulse-ring"></div>
            </div>
          )}

          {/* Timer Display */}
          <div className="w-72 h-72 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold text-foreground font-mono">
              {formatTime(timeLeft)}
            </div>
            <div className="text-lg text-muted-foreground mt-2">
              {isRunning ? 'Focusing...' : timeLeft === 16 * 60 ? 'Ready to focus' : 'Paused'}
            </div>

            {/* Session Info */}
            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground">Session</div>
              <div className="text-xl font-semibold text-foreground">{sessionCount}</div>
            </div>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center space-x-6">
          {/* Reset Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={reset}
            className="w-14 h-14 bg-secondary text-secondary-foreground rounded-full touch-feedback shadow-sm active:shadow-none transition-all duration-150"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>

          {/* Play/Pause Button */}
          <Button
            onClick={isRunning ? pause : start}
            className="w-20 h-20 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full touch-feedback shadow-lg active:shadow-md transition-all duration-150"
          >
            {isRunning ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>

          {/* Skip Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={skip}
            className="w-14 h-14 bg-secondary text-secondary-foreground rounded-full touch-feedback shadow-sm active:shadow-none transition-all duration-150"
          >
            <SkipForward className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 pb-8">
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="ghost"
                className="flex flex-col items-center py-3 px-2 text-muted-foreground hover:text-primary transition-colors touch-feedback rounded-lg h-auto"
              >
                <Music className="w-6 h-6 mb-1" />
                <span className="text-xs">Sounds</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center py-3 px-2 text-muted-foreground hover:text-primary transition-colors touch-feedback rounded-lg h-auto"
              >
                <Target className="w-6 h-6 mb-1" />
                <span className="text-xs">Goals</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center py-3 px-2 text-muted-foreground hover:text-primary transition-colors touch-feedback rounded-lg h-auto"
              >
                <BarChart3 className="w-6 h-6 mb-1" />
                <span className="text-xs">Stats</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
