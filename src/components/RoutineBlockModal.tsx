import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RoutineBlock, RoutineBlockFormData, ROUTINE_ICONS } from "@/types/routine";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Clock, 
  Star, 
  Loader2, 
  FileText,
  Sparkles,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RoutineBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: RoutineBlockFormData) => Promise<void>;
  block?: RoutineBlock | null;
}

const TIME_OPTIONS = [
  "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00"
];

export const RoutineBlockModal = ({
  isOpen,
  onClose,
  onSave,
  block,
}: RoutineBlockModalProps) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (block) {
      setTitle(block.title);
      setStartTime(block.startTime);
      setEndTime(block.endTime);
      setNotes(block.notes || "");
      setPriority(block.priority);
    } else {
      setTitle("");
      setStartTime("09:00");
      setEndTime("10:00");
      setNotes("");
      setPriority(false);
    }
  }, [block, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        startTime,
        endTime,
        notes: notes.trim() || null,
        priority,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">
              {block ? ROUTINE_ICONS[block.type] : "✏️"}
            </span>
            <span>Edit Routine Block</span>
            {block?.isLocked && (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Block Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you working on?"
              className="h-12 rounded-xl border-border/50 focus:border-primary/50 focus:ring-primary/20"
              autoFocus
              disabled={!block?.isEditable}
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Start Time
              </Label>
              <Select 
                value={startTime} 
                onValueChange={setStartTime}
                disabled={!block?.isEditable}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue>{formatTimeDisplay(startTime)}</SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {TIME_OPTIONS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {formatTimeDisplay(time)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                End Time
              </Label>
              <Select 
                value={endTime} 
                onValueChange={setEndTime}
                disabled={!block?.isEditable}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue>{formatTimeDisplay(endTime)}</SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {TIME_OPTIONS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {formatTimeDisplay(time)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or details..."
              className="rounded-xl min-h-[80px] resize-none border-border/50 focus:border-primary/50"
            />
          </div>

          {/* Priority Toggle */}
          <motion.button
            type="button"
            onClick={() => setPriority(!priority)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300",
              priority
                ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30"
                : "border-border/50 hover:border-primary/30"
            )}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  rotate: priority ? [0, -10, 10, 0] : 0,
                  scale: priority ? 1.1 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <Star className={cn(
                  "w-5 h-5 transition-colors",
                  priority ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                )} />
              </motion.div>
              <div className="text-left">
                <p className="font-medium">Priority Block</p>
                <p className="text-sm text-muted-foreground">
                  Mark as important
                </p>
              </div>
            </div>
            <div className={cn(
              "w-5 h-5 rounded-full border-2 transition-all",
              priority 
                ? "bg-amber-400 border-amber-400" 
                : "border-muted-foreground/30"
            )}>
              {priority && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <Sparkles className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </div>
          </motion.button>

          {/* Submit Button */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button
              type="submit"
              disabled={saving || !title.trim()}
              className="w-full h-12 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Save Changes
                </span>
              )}
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
