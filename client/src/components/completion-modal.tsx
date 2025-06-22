import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface CompletionModalProps {
  isOpen: boolean;
  onStartAnother: () => void;
  onFinish: () => void;
}

export default function CompletionModal({ isOpen, onStartAnother, onFinish }: CompletionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-sm mx-auto p-0 bg-card border-border">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-2">Great Focus!</h3>
          <p className="text-muted-foreground mb-8">
            You completed a 16-minute focus session. Keep up the momentum!
          </p>

          <div className="space-y-3">
            <Button
              onClick={onStartAnother}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-xl touch-feedback"
            >
              Start Another Session
            </Button>
            <Button
              onClick={onFinish}
              variant="outline"
              className="w-full bg-secondary text-secondary-foreground font-medium py-3 px-6 rounded-xl touch-feedback"
            >
              Finish for Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
