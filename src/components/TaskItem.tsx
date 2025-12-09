import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, Pencil, Trash2, CheckCircle2, Circle, GripVertical, Sparkles } from "lucide-react";
import { Task, CATEGORY_LABELS, CATEGORY_COLORS } from "@/types/task";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  const [isHovered, setIsHovered] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    try {
      await onToggleComplete(task.id, !task.completed);
    } finally {
      setTimeout(() => setIsCompleting(false), 300);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.9 }}
      transition={{ 
        duration: 0.3, 
        ease: [0.23, 1, 0.32, 1],
        layout: { duration: 0.3 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative group",
        task.completed && "opacity-60"
      )}
    >
      {/* Glow effect for priority tasks */}
      {task.priority && !task.completed && (
        <motion.div
          className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-warning/30 via-warning/10 to-warning/30"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ filter: "blur(8px)" }}
        />
      )}

      {/* Hover glow effect */}
      <motion.div
        className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered && !task.priority ? 0.5 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ filter: "blur(6px)" }}
      />

      {/* Main card */}
      <motion.div
        className={cn(
          "relative flex items-start gap-3 p-4 rounded-xl",
          "bg-card/90 backdrop-blur-sm",
          "border border-border/50",
          "transition-all duration-300",
          task.priority && !task.completed && "border-warning/30",
          isHovered && "border-primary/30 shadow-lg"
        )}
        animate={{
          y: isHovered ? -2 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Drag handle */}
        <motion.div 
          className="pt-1 cursor-grab active:cursor-grabbing"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.5 : 0 }}
          whileHover={{ opacity: 0.8, scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </motion.div>

        {/* Checkbox with animation */}
        <motion.button
          onClick={handleToggleComplete}
          className="pt-0.5 relative"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          <AnimatePresence mode="wait">
            {task.completed ? (
              <motion.div
                key="completed"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <CheckCircle2 className="w-6 h-6 text-success" />
              </motion.div>
            ) : (
              <motion.div
                key="incomplete"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="relative"
              >
                <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                {isCompleting && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <motion.h3
                className={cn(
                  "font-medium text-foreground",
                  task.completed && "line-through text-muted-foreground"
                )}
                animate={{
                  opacity: task.completed ? 0.6 : 1,
                }}
              >
                {task.title}
              </motion.h3>
              
              <AnimatePresence>
                {task.notes && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-muted-foreground mt-1 line-clamp-2"
                  >
                    {task.notes}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Priority star with premium animation */}
            <motion.button
              onClick={() => onTogglePriority(task.id, !task.priority)}
              className="relative"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={task.priority ? "Remove priority" : "Mark as priority"}
            >
              <motion.div
                animate={{
                  rotate: task.priority ? [0, -10, 10, 0] : 0,
                }}
                transition={{
                  duration: 0.5,
                  repeat: task.priority ? Infinity : 0,
                  repeatDelay: 2,
                }}
              >
                <Star 
                  className={cn(
                    "w-5 h-5 transition-colors duration-300",
                    task.priority 
                      ? "text-warning fill-warning drop-shadow-[0_0_8px_hsl(var(--warning)/0.5)]" 
                      : "text-muted-foreground/40 hover:text-warning/60"
                  )} 
                />
              </motion.div>
              
              {/* Sparkle effect when priority */}
              {task.priority && (
                <motion.div
                  className="absolute -top-1 -right-1"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <Sparkles className="w-3 h-3 text-warning" />
                </motion.div>
              )}
            </motion.button>
          </div>

          {/* Meta info with enhanced styling */}
          <motion.div 
            className="flex items-center gap-2 mt-3 flex-wrap"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0.8 }}
          >
            {task.time && (
              <motion.span 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                whileHover={{ scale: 1.05 }}
              >
                <Clock className="w-3 h-3" />
                {task.time}
              </motion.span>
            )}
            <motion.span
              className={cn(
                "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border",
                CATEGORY_COLORS[task.category]
              )}
              whileHover={{ scale: 1.05 }}
            >
              {CATEGORY_LABELS[task.category]}
            </motion.span>
          </motion.div>
        </div>

        {/* Actions with smooth reveal */}
        <motion.div 
          className="flex items-center gap-1"
          initial={{ opacity: 0, x: 10 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            x: isHovered ? 0 : 10,
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              onClick={() => onEdit(task)}
              aria-label="Edit task"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </motion.div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-border/50">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete task?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{task.title}". This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
