import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Clock } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface TimeInputScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function TimeInputScreen({ onComplete, onBack }: TimeInputScreenProps) {
  const [dailyTime, setDailyTime] = useLocalStorage("dailyTime", "09:00");
  const [frequency, setFrequency] = useLocalStorage("frequency", "daily");

  const handleSave = () => {
    // Settings are already saved via useLocalStorage
    onComplete();
  };

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
          <h2 className="text-xl font-semibold text-foreground">Daily Schedule</h2>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Time Input Content */}
      <div className="flex-1 px-6 pb-6 flex flex-col justify-center">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-4">What time works best?</h3>
          <p className="text-muted-foreground">Choose your preferred time for daily 16-minute focus sessions</p>
        </div>

        {/* Time Picker */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <Label className="block text-sm font-medium text-foreground mb-3">Preferred Time</Label>
            <input
              type="time"
              value={dailyTime}
              onChange={(e) => setDailyTime(e.target.value)}
              className="w-full text-2xl font-semibold text-center py-4 px-6 border-2 border-border rounded-xl focus:border-primary focus:outline-none transition-colors bg-background text-foreground"
            />
          </CardContent>
        </Card>

        {/* Frequency Options */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <Label className="block text-sm font-medium text-foreground mb-4">Reminder Frequency</Label>
            <RadioGroup value={frequency} onValueChange={setFrequency} className="space-y-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="text-foreground cursor-pointer">Daily</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="weekdays" id="weekdays" />
                <Label htmlFor="weekdays" className="text-foreground cursor-pointer">Weekdays only</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="text-foreground cursor-pointer">Custom days</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* Continue Button */}
      <div className="px-6 pb-8">
        <Button 
          onClick={handleSave}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 px-6 rounded-xl touch-feedback shadow-lg active:shadow-md transition-all duration-150"
        >
          Continue to Timer
        </Button>
      </div>
    </div>
  );
}
