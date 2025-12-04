import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Clock, Pencil, Trash2, CheckCircle2, Circle, GripVertical } from "lucide-react";
import { Task, CATEGORY_LABELS, CATEGORY_COLORS } from "@/types/task";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => Promise<void>;
  onTogglePriority: (taskId: string, priority: boolean) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
}

export const TaskItem = ({
  task,
  onToggleComplete,
  onTogglePriority,
  onEdit,
  onDelete,
}: TaskItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        "task-card group flex items-start gap-3",
        task.completed && "opacity-60",
        task.priority && !task.completed && "priority-glow border-warning/30"
      )}
    >
      {/* Drag handle (visual only for now) */}
      <div className="pt-1 opacity-0 group-hover:opacity-50 transition-opacity cursor-grab">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Checkbox */}
      <button
        onClick={() => onToggleComplete(task.id, !task.completed)}
        className="pt-0.5 transition-transform hover:scale-110"
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed ? (
          <CheckCircle2 className="w-5 h-5 text-success" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-medium text-foreground truncate",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </h3>
            {task.notes && (
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                {task.notes}
              </p>
            )}
          </div>

          {/* Priority star */}
          <button
            onClick={() => onTogglePriority(task.id, !task.priority)}
            className={cn(
              "transition-all hover:scale-110",
              task.priority ? "text-warning" : "text-muted-foreground/40 hover:text-warning/60"
            )}
            aria-label={task.priority ? "Remove priority" : "Mark as priority"}
          >
            <Star className={cn("w-5 h-5", task.priority && "fill-current")} />
          </button>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {task.time && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {task.time}
            </span>
          )}
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
              CATEGORY_COLORS[task.category]
            )}
          >
            {CATEGORY_LABELS[task.category]}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          <Pencil className="w-4 h-4" />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              aria-label="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete task?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{task.title}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
};
