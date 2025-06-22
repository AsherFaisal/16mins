import { useState, useEffect } from "react";
import OnboardingScreen from "@/components/onboarding-screen";
import TimeInputScreen from "@/components/time-input-screen";
import TimerScreen from "@/components/timer-screen";
import CompletionModal from "@/components/completion-modal";
import { useLocalStorage } from "@/hooks/use-local-storage";

type Screen = "onboarding" | "time-input" | "timer";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding");
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage("hasSeenOnboarding", false);

  useEffect(() => {
    // Skip onboarding if user has seen it before
    if (hasSeenOnboarding) {
      setCurrentScreen("timer");
    }
  }, [hasSeenOnboarding]);

  const handleCompleteOnboarding = () => {
    setHasSeenOnboarding(true);
    setCurrentScreen("time-input");
  };

  const handleCompleteTimeInput = () => {
    setCurrentScreen("timer");
  };

  const handleBackToOnboarding = () => {
    setCurrentScreen("onboarding");
  };

  const handleBackToTimeInput = () => {
    setCurrentScreen("time-input");
  };

  const handleTimerComplete = () => {
    setShowCompletionModal(true);
  };

  const handleStartAnother = () => {
    setShowCompletionModal(false);
  };

  const handleFinishSession = () => {
    setShowCompletionModal(false);
  };

  return (
    <>
      {currentScreen === "onboarding" && (
        <OnboardingScreen onComplete={handleCompleteOnboarding} />
      )}
      
      {currentScreen === "time-input" && (
        <TimeInputScreen 
          onComplete={handleCompleteTimeInput}
          onBack={handleBackToOnboarding}
        />
      )}
      
      {currentScreen === "timer" && (
        <TimerScreen 
          onBack={handleBackToTimeInput}
          onComplete={handleTimerComplete}
        />
      )}

      <CompletionModal
        isOpen={showCompletionModal}
        onStartAnother={handleStartAnother}
        onFinish={handleFinishSession}
      />
    </>
  );
}
