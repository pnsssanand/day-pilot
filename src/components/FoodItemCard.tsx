import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
  Pencil,
  Trash2,
  MoreHorizontal,
  Flame,
  Dumbbell,
} from "lucide-react";
import { DailyMenuItem } from "@/types/nutrition";
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

interface FoodItemCardProps {
  item: DailyMenuItem;
  onEdit: (item: DailyMenuItem) => void;
  onDelete: (itemId: string) => Promise<void>;
}

// Format time to 12-hour format
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const FoodItemCard = ({ item, onEdit, onDelete }: FoodItemCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(item.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Determine if this is a high-protein item (>15g)
  const isHighProtein = item.totalProtein >= 15;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative group"
      >
        {/* High protein glow */}
        {isHighProtein && (
          <motion.div
            className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-emerald-400/20 via-emerald-200/10 to-emerald-400/20"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
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
            isHighProtein && "border-emerald-200/50 dark:border-emerald-800/50",
            isHovered && "shadow-lg border-primary/20"
          )}
          animate={{ y: isHovered ? -1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Time badge */}
          <div className="flex flex-col items-center min-w-[60px] py-1 px-2 rounded-lg bg-muted/50">
            <Clock className="w-3.5 h-3.5 text-muted-foreground mb-0.5" />
            <span className="text-xs font-medium text-foreground">
              {formatTime(item.time)}
            </span>
          </div>

          {/* Food info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground truncate">
                {item.foodName}
              </span>
              {isHighProtein && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  High Protein
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-sm text-muted-foreground">
                {item.quantity} {item.unit}
              </span>
              {item.notes && (
                <span className="text-xs text-muted-foreground/70 truncate">
                  · {item.notes}
                </span>
              )}
            </div>
          </div>

          {/* Nutrition badges */}
          <div className="flex items-center gap-2">
            {/* Protein badge */}
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg",
              "bg-emerald-50 dark:bg-emerald-900/20"
            )}>
              <Dumbbell className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                {Math.round(item.totalProtein)}g
              </span>
            </div>

            {/* Calories badge */}
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg",
              "bg-orange-50 dark:bg-orange-900/20"
            )}>
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">
                {Math.round(item.totalCalories)}
              </span>
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
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Item
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </motion.div>

      {/* Delete confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from daily menu?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove "{item.foodName}" from your daily menu. 
              You can always add it back later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
