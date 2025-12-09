import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Pencil, 
  Trash2, 
  Flame,
  ImageIcon,
  MoreVertical
} from "lucide-react";
import { 
  Meal, 
  MEAL_TYPE_LABELS, 
  MEAL_TYPE_ICONS, 
  MEAL_TYPE_COLORS 
} from "@/types/food";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

interface MealCardProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
  onDelete: (mealId: string) => Promise<void>;
}

export const MealCard = ({ meal, onEdit, onDelete }: MealCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(meal.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, x: -20 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.5 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ filter: "blur(6px)" }}
        />

        <div
          className={cn(
            "relative overflow-hidden rounded-2xl",
            "bg-card/90 backdrop-blur-sm",
            "border border-border/50",
            "transition-all duration-300",
            isHovered && "border-primary/30 shadow-lg"
          )}
        >
          {/* Image section */}
          {meal.imageUrl && !imageError ? (
            <div className="relative aspect-video overflow-hidden">
              <motion.img
                src={meal.imageUrl}
                alt={meal.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Meal type badge on image */}
              <div className="absolute top-3 left-3">
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                  "bg-background/90 backdrop-blur-sm border",
                  MEAL_TYPE_COLORS[meal.mealType]
                )}>
                  {MEAL_TYPE_ICONS[meal.mealType]} {MEAL_TYPE_LABELS[meal.mealType]}
                </span>
              </div>

              {/* Actions overlay */}
              <motion.div
                className="absolute top-3 right-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(meal)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
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
            </div>
          ) : (
            /* No image header */
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <span className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border",
                MEAL_TYPE_COLORS[meal.mealType]
              )}>
                {MEAL_TYPE_ICONS[meal.mealType]} {MEAL_TYPE_LABELS[meal.mealType]}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(meal)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-foreground text-lg mb-1">
              {meal.name}
            </h3>

            {meal.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {meal.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {meal.time}
              </span>
              
              {meal.calories && (
                <span className="inline-flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  {meal.calories} cal
                </span>
              )}

              {!meal.imageUrl && (
                <span className="inline-flex items-center gap-1.5 text-muted-foreground/50">
                  <ImageIcon className="w-4 h-4" />
                  No image
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete meal?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{meal.name}". This action cannot be undone.
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
    </>
  );
};
