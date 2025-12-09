import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Task, TaskCategory, TaskFormData, CATEGORY_LABELS, CATEGORY_COLORS } from "@/types/task";
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
  Repeat, 
  Tag,
  FileText,
  Sparkles
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskFormData) => Promise<void>;
  task?: Task | null;
  defaultDate?: string;
  defaultTime?: string | null;
}

const TIME_OPTIONS = [
  "", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30", "22:00", "22:30", "23:00"
];

const CATEGORY_ICONS: Record<TaskCategory, string> = {
  work: "💼",
  personal: "👤",
  learn: "📚",
  health: "💪",
  other: "📌",
};

export const TaskModal = ({
  isOpen,
  onClose,
  onSave,
  task,
  defaultDate,
  defaultTime,
}: TaskModalProps) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState("");
  const [category, setCategory] = useState<TaskCategory>("personal");
  const [priority, setPriority] = useState(false);
  const [repeat, setRepeat] = useState<"daily" | "weekly" | "monthly" | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setNotes(task.notes || "");
      setDate(parseISO(task.date));
      setTime(task.time || "");
      setCategory(task.category);
      setPriority(task.priority);
      setRepeat(task.repeat || null);
    } else {
      setTitle("");
      setNotes("");
      setDate(defaultDate ? parseISO(defaultDate) : new Date());
      setTime(defaultTime || "");
      setCategory("personal");
      setPriority(false);
      setRepeat(null);
    }
  }, [task, defaultDate, defaultTime, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      const taskData: TaskFormData = {
        title: title.trim(),
        notes: notes.trim() || null,
        date: format(date, "yyyy-MM-dd"),
        time: time || null,
        category,
        priority,
        completed: task?.completed || false,
        repeat: repeat || null,
      };
      await onSave(taskData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden bg-card/95 backdrop-blur-xl border-border/50">
        {/* Header with gradient */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-primary/5 to-transparent">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {task ? "Edit Task" : "Add New Task"}
              {priority && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex"
                >
                  <Star className="w-5 h-5 text-warning fill-warning" />
                </motion.span>
              )}
            </DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Task Title
            </Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
              className="h-12 rounded-xl border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-muted-foreground">
              Notes (optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="rounded-xl border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none transition-all"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal rounded-xl border-border/50 hover:bg-muted/50",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {format(date, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                    className="rounded-xl"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Time
              </Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger id="time" className="h-11 rounded-xl border-border/50">
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent className="max-h-60 rounded-xl">
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t || "none"} value={t || "none"}>
                      {t || "Any time"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category & Repeat */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                Category
              </Label>
              <Select value={category} onValueChange={(v) => setCategory(v as TaskCategory)}>
                <SelectTrigger id="category" className="h-11 rounded-xl border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span>{CATEGORY_ICONS[key as TaskCategory]}</span>
                        {label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repeat" className="text-sm font-medium flex items-center gap-2">
                <Repeat className="w-4 h-4 text-muted-foreground" />
                Repeat
              </Label>
              <Select
                value={repeat || "none"}
                onValueChange={(v) => setRepeat(v === "none" ? null : (v as any))}
              >
                <SelectTrigger id="repeat" className="h-11 rounded-xl border-border/50">
                  <SelectValue placeholder="No repeat" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="none">No repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority toggle - Premium styled */}
          <motion.button
            type="button"
            onClick={() => setPriority(!priority)}
            className={cn(
              "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all",
              priority 
                ? "border-warning bg-warning/10" 
                : "border-border/50 hover:border-warning/50 hover:bg-warning/5"
            )}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  rotate: priority ? [0, -10, 10, 0] : 0,
                  scale: priority ? [1, 1.2, 1] : 1
                }}
                transition={{ duration: 0.5 }}
              >
                <Star className={cn(
                  "w-6 h-6 transition-colors",
                  priority 
                    ? "text-warning fill-warning" 
                    : "text-muted-foreground"
                )} />
              </motion.div>
              <div className="text-left">
                <p className={cn(
                  "font-medium",
                  priority ? "text-warning" : "text-foreground"
                )}>
                  Priority Task
                </p>
                <p className="text-xs text-muted-foreground">
                  {priority ? "This task is marked as important" : "Mark as important to focus on"}
                </p>
              </div>
            </div>
            {priority && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Sparkles className="w-5 h-5 text-warning" />
              </motion.div>
            )}
          </motion.button>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="rounded-xl px-5"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saving || !title.trim()}
              className="rounded-xl px-6 shadow-md hover:shadow-lg transition-shadow"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {task ? "Save Changes" : "Add Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
