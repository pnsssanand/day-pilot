import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Task, TaskFormData } from "@/types/task";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CalendarIcon,
  Star,
  Loader2,
  Clock,
  FileText,
  Sparkles,
  Building2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface CompanyTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<TaskFormData, "category">) => Promise<void>;
  task?: Task | null;
}

const TIME_OPTIONS = [
  "", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30", "22:00", "22:30", "23:00"
];

export const CompanyTaskModal = ({
  isOpen,
  onClose,
  onSave,
  task,
}: CompanyTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setNotes(task.notes || "");
      setDate(parseISO(task.date));
      setTime(task.time || "");
      setPriority(task.priority);
    } else {
      setTitle("");
      setNotes("");
      setDate(new Date());
      setTime("");
      setPriority(false);
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        notes: notes.trim() || null,
        date: format(date, "yyyy-MM-dd"),
        time: time || null,
        priority,
        completed: false,
        repeat: null,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const formatTimeDisplay = (t: string) => {
    if (!t) return "No time";
    const [hours, minutes] = t.split(":");
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
            <Building2 className="w-5 h-5 text-cyan-500" />
            <span>{task ? "Edit Company Task" : "Add Company Task"}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Task Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to do?"
              className="h-12 rounded-xl border-border/50 focus:border-primary/50"
              autoFocus
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 justify-start rounded-xl font-normal"
                >
                  {format(date, "EEEE, MMMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Time (Optional)
            </Label>
            <Select value={time || "none"} onValueChange={(v) => setTime(v === "none" ? "" : v)}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Select time">{formatTimeDisplay(time)}</SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="none">No time</SelectItem>
                {TIME_OPTIONS.filter(t => t).map((t) => (
                  <SelectItem key={t} value={t}>
                    {formatTimeDisplay(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              placeholder="Add any details or notes..."
              className="rounded-xl min-h-[80px] resize-none border-border/50"
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
                  scale: priority ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <Star
                  className={cn(
                    "w-5 h-5 transition-colors",
                    priority ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                  )}
                />
              </motion.div>
              <div className="text-left">
                <p className="font-medium">Priority Task</p>
                <p className="text-sm text-muted-foreground">
                  Show in Priority tab
                </p>
              </div>
            </div>
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 transition-all",
                priority
                  ? "bg-amber-400 border-amber-400"
                  : "border-muted-foreground/30"
              )}
            >
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
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
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
                  {task ? "Update Task" : "Add Task"}
                </span>
              )}
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
