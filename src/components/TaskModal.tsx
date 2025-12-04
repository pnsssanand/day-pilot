import { useEffect, useState } from "react";
import { Task, TaskCategory, TaskFormData, CATEGORY_LABELS } from "@/types/task";
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
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Star, Loader2 } from "lucide-react";
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
      await onSave({
        title: title.trim(),
        notes: notes.trim() || undefined,
        date: format(date, "yyyy-MM-dd"),
        time: time || undefined,
        category,
        priority,
        completed: task?.completed || false,
        repeat,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "MMM d, yyyy")}
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

            <div className="space-y-2">
              <Label htmlFor="time">Time (optional)</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t || "none"} value={t || "none"}>
                      {t || "No specific time"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category & Repeat */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as TaskCategory)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repeat">Repeat</Label>
              <Select
                value={repeat || "none"}
                onValueChange={(v) => setRepeat(v === "none" ? null : (v as any))}
              >
                <SelectTrigger id="repeat">
                  <SelectValue placeholder="No repeat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority toggle */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Star className={cn("w-5 h-5", priority ? "text-warning fill-warning" : "text-muted-foreground")} />
              <Label htmlFor="priority" className="cursor-pointer">
                Mark as Priority
              </Label>
            </div>
            <Switch
              id="priority"
              checked={priority}
              onCheckedChange={setPriority}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="btn-primary" disabled={saving || !title.trim()}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {task ? "Save Changes" : "Add Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
