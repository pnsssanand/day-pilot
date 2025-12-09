import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Star,
  Clock,
  Pencil,
  Trash2,
  MoreHorizontal,
  Check,
} from "lucide-react";
import { Task, CATEGORY_COLORS } from "@/types/task";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CompanyTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
  onTogglePriority: (taskId: string, priority: boolean) => Promise<void>;
  onComplete: (taskId: string) => Promise<void>;
}

// Format time to 12-hour format
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const CompanyTaskCard = ({
  task,
  onEdit,
  onDelete,
  onTogglePriority,
  onComplete,
}: CompanyTaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCompletedAnimation, setShowCompletedAnimation] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    setShowCompletedAnimation(true);
    
    // Wait for animation
    setTimeout(async () => {
      try {
        await onComplete(task.id);
      } finally {
        setIsCompleting(false);
      }
    }, 400);
  };

  const handleTogglePriority = async () => {
    await onTogglePriority(task.id, !task.priority);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ 
          opacity: showCompletedAnimation ? 0 : 1, 
          x: showCompletedAnimation ? 50 : 0,
          scale: showCompletedAnimation ? 0.95 : 1,
        }}
        exit={{ opacity: 0, x: -50, scale: 0.9 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative group"
      >
        {/* Priority glow */}
        {task.priority && (
          <motion.div
            className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-amber-400/30 via-amber-200/10 to-amber-400/30"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ filter: "blur(6px)" }}
          />
        )}

        {/* Main card */}
        <motion.div
          className={cn(
            "relative flex items-center gap-3 p-4 rounded-xl",
            "bg-card/90 backdrop-blur-sm",
            "border border-border/50",
            "transition-all duration-300",
            task.priority && "border-amber-200/50 dark:border-amber-800/30",
            isHovered && "shadow-lg border-cyan-200/50 dark:border-cyan-800/30"
          )}
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Tick / Complete Button */}
          <motion.button
            onClick={handleComplete}
            disabled={isCompleting}
            className={cn(
              "flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all",
              "hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
              isCompleting 
                ? "border-emerald-500 bg-emerald-500" 
                : "border-muted-foreground/30"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isCompleting ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="w-full h-full rounded-full"
                />
              )}
            </AnimatePresence>
          </motion.button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-medium text-foreground truncate",
                showCompletedAnimation && "line-through text-muted-foreground"
              )}>
                {task.title}
              </span>
              {task.priority && (
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 flex-shrink-0" />
                </motion.div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {task.time && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatTime(task.time)}
                </span>
              )}
              {task.notes && (
                <span className="text-xs text-muted-foreground/70 truncate">
                  · {task.notes}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity",
                  "hover:bg-muted"
                )}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTogglePriority}>
                <Star className={cn(
                  "w-4 h-4 mr-2",
                  task.priority && "fill-amber-400 text-amber-400"
                )} />
                {task.priority ? "Remove Priority" : "Mark Priority"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </motion.div>

      {/* Delete confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove "{task.title}" from your company tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
