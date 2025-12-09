import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Star,
  Clock,
  Pencil,
  Trash2,
  Lock,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { RoutineBlock, ROUTINE_ICONS } from "@/types/routine";
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

interface RoutineBlockCardProps {
  block: RoutineBlock;
  onToggleComplete: (blockId: string, completed: boolean) => Promise<void>;
  onTogglePriority: (blockId: string, priority: boolean) => Promise<void>;
  onEdit: (block: RoutineBlock) => void;
  onDelete: (blockId: string) => Promise<void>;
  isCurrentTimeBlock?: boolean;
}

// Format time to 12-hour format
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

// Calculate duration between times
const getDuration = (start: string, end: string): string => {
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  
  let totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
  if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

export const RoutineBlockCard = ({
  block,
  onToggleComplete,
  onTogglePriority,
  onEdit,
  onDelete,
  isCurrentTimeBlock = false,
}: RoutineBlockCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(block.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleToggleComplete = async () => {
    await onToggleComplete(block.id, !block.completed);
  };

  const handleTogglePriority = async () => {
    await onTogglePriority(block.id, !block.priority);
  };

  const isSinglePoint = block.startTime === block.endTime;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={cn(
          "relative group",
          block.completed && "opacity-60"
        )}
      >
        {/* Current time indicator glow */}
        {isCurrentTimeBlock && !block.completed && (
          <motion.div
            className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ filter: "blur(8px)" }}
          />
        )}

        {/* Priority glow */}
        {block.priority && !block.completed && !isCurrentTimeBlock && (
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
            "relative flex items-stretch rounded-xl overflow-hidden",
            "border transition-all duration-300",
            block.color.bg,
            block.color.border,
            isCurrentTimeBlock && "ring-2 ring-primary/50",
            isHovered && "shadow-lg",
            block.isEditable && !block.completed && "border-dashed"
          )}
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Time column */}
          <div className={cn(
            "flex flex-col justify-center items-center px-4 py-3 min-w-[80px]",
            "border-r",
            block.color.border,
            "bg-black/5 dark:bg-white/5"
          )}>
            <span className={cn("text-sm font-semibold", block.color.text)}>
              {formatTime(block.startTime)}
            </span>
            {!isSinglePoint && (
              <>
                <div className="w-px h-2 bg-current opacity-20 my-1" />
                <span className="text-xs text-muted-foreground">
                  {getDuration(block.startTime, block.endTime)}
                </span>
              </>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex items-center gap-3 p-4">
            {/* Checkbox */}
            <motion.button
              onClick={handleToggleComplete}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex-shrink-0"
            >
              <AnimatePresence mode="wait">
                {block.completed ? (
                  <motion.div
                    key="completed"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="incomplete"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Circle className={cn("w-6 h-6", block.color.icon)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Icon & Title */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">{ROUTINE_ICONS[block.type]}</span>
                <span className={cn(
                  "font-medium truncate",
                  block.completed && "line-through text-muted-foreground"
                )}>
                  {block.title}
                </span>
                {block.isLocked && (
                  <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                )}
                {block.priority && (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 flex-shrink-0" />
                  </motion.div>
                )}
              </div>
              {block.notes && (
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {block.notes}
                </p>
              )}
            </div>

            {/* Editable indicator */}
            {block.isEditable && !block.completed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0.5 }}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30"
              >
                <Pencil className="w-3 h-3 text-violet-500" />
                <span className="text-xs text-violet-600 dark:text-violet-400">Editable</span>
              </motion.div>
            )}

            {/* Actions dropdown */}
            {(block.isEditable || !block.isLocked) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity",
                      "hover:bg-black/5 dark:hover:bg-white/5"
                    )}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {block.isEditable && (
                    <DropdownMenuItem onClick={() => onEdit(block)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit Block
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleTogglePriority}>
                    <Star className={cn(
                      "w-4 h-4 mr-2",
                      block.priority && "fill-amber-400 text-amber-400"
                    )} />
                    {block.priority ? "Remove Priority" : "Mark Priority"}
                  </DropdownMenuItem>
                  {!block.isLocked && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Block
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this routine block?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove "{block.title}" from today's routine. 
              Tomorrow it will reset to the default schedule.
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
