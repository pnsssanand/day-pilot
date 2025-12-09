import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DailyMenuItem, 
  DailyMenuFormData, 
  FOOD_UNITS, 
  FOOD_TIME_SLOTS,
  lookupNutrition 
} from "@/types/nutrition";
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
  Loader2,
  Dumbbell,
  Flame,
  Sparkles,
  AlertCircle,
  Check,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FoodItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DailyMenuFormData) => Promise<void>;
  onAddCustomFood?: (food: { foodName: string; proteinPerUnit: number; caloriesPerUnit: number; defaultUnit: string }) => Promise<void>;
  getNutritionInfo: (foodName: string) => { proteinPerUnit: number; caloriesPerUnit: number; defaultUnit: string; isFromReference: boolean } | null;
  item?: DailyMenuItem | null;
}

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const FoodItemModal = ({
  isOpen,
  onClose,
  onSave,
  onAddCustomFood,
  getNutritionInfo,
  item,
}: FoodItemModalProps) => {
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("piece");
  const [time, setTime] = useState("09:00");
  const [notes, setNotes] = useState("");
  const [proteinPerUnit, setProteinPerUnit] = useState(0);
  const [caloriesPerUnit, setCaloriesPerUnit] = useState(0);
  const [isFromReference, setIsFromReference] = useState(false);
  const [needsCustomNutrition, setNeedsCustomNutrition] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nutritionLookedUp, setNutritionLookedUp] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (item) {
      setFoodName(item.foodName);
      setQuantity(item.quantity);
      setUnit(item.unit);
      setTime(item.time);
      setNotes(item.notes || "");
      setProteinPerUnit(item.proteinPerUnit);
      setCaloriesPerUnit(item.caloriesPerUnit);
      setIsFromReference(item.isFromReference);
      setNeedsCustomNutrition(false);
      setNutritionLookedUp(true);
    } else {
      setFoodName("");
      setQuantity(1);
      setUnit("piece");
      setTime("09:00");
      setNotes("");
      setProteinPerUnit(0);
      setCaloriesPerUnit(0);
      setIsFromReference(false);
      setNeedsCustomNutrition(false);
      setNutritionLookedUp(false);
    }
  }, [item, isOpen]);

  // Look up nutrition when food name changes
  useEffect(() => {
    if (!foodName.trim() || item) return;

    const timeoutId = setTimeout(() => {
      const nutrition = getNutritionInfo(foodName);
      if (nutrition) {
        setProteinPerUnit(nutrition.proteinPerUnit);
        setCaloriesPerUnit(nutrition.caloriesPerUnit);
        setUnit(nutrition.defaultUnit);
        setIsFromReference(nutrition.isFromReference);
        setNeedsCustomNutrition(false);
        setNutritionLookedUp(true);
      } else {
        setProteinPerUnit(0);
        setCaloriesPerUnit(0);
        setIsFromReference(false);
        setNeedsCustomNutrition(true);
        setNutritionLookedUp(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [foodName, getNutritionInfo, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;
    if (needsCustomNutrition && (proteinPerUnit === 0 && caloriesPerUnit === 0)) return;

    setSaving(true);
    try {
      // If custom nutrition, save it for future use
      if (needsCustomNutrition && onAddCustomFood) {
        await onAddCustomFood({
          foodName: foodName.trim(),
          proteinPerUnit,
          caloriesPerUnit,
          defaultUnit: unit,
        });
      }

      await onSave({
        foodName: foodName.trim(),
        quantity,
        unit,
        time,
        notes: notes.trim() || null,
        proteinPerUnit,
        caloriesPerUnit,
        isFromReference,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const totalProtein = Math.round(proteinPerUnit * quantity);
  const totalCalories = Math.round(caloriesPerUnit * quantity);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">🍽️</span>
            <span>{item ? "Edit Food Item" : "Add Food to Menu"}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Food Name Input */}
          <div className="space-y-2">
            <Label htmlFor="foodName" className="text-sm font-medium">
              Food Name
            </Label>
            <div className="relative">
              <Input
                id="foodName"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g., Boiled Eggs, Chicken Breast, Oats..."
                className="h-12 rounded-xl border-border/50 focus:border-primary/50 pr-10"
                autoFocus
              />
              {nutritionLookedUp && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Check className="w-5 h-5 text-emerald-500" />
                </motion.div>
              )}
            </div>
            {needsCustomNutrition && foodName && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Not in database. Please enter nutrition info below.</span>
              </motion.div>
            )}
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0.5"
                step="0.5"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FOOD_UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Time
            </Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue>{formatTime(time)}</SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {FOOD_TIME_SLOTS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {formatTime(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Nutrition Input (when not in reference) */}
          <AnimatePresence>
            {(needsCustomNutrition || item) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 rounded-xl bg-muted/50 border border-border/50"
              >
                <p className="text-sm font-medium text-foreground">
                  Nutrition per {unit}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-emerald-500" />
                      Protein (g)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={proteinPerUnit}
                      onChange={(e) => setProteinPerUnit(parseFloat(e.target.value) || 0)}
                      className="h-10 rounded-xl"
                      disabled={isFromReference && !item}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      Calories
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={caloriesPerUnit}
                      onChange={(e) => setCaloriesPerUnit(parseFloat(e.target.value) || 0)}
                      className="h-10 rounded-xl"
                      disabled={isFromReference && !item}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Calculated Totals Preview */}
          {(proteinPerUnit > 0 || caloriesPerUnit > 0) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-950/30 dark:to-orange-950/30 border border-emerald-200/50 dark:border-emerald-800/30"
            >
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Dumbbell className="w-4 h-4 text-emerald-500" />
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {totalProtein}g
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Protein</span>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {totalCalories}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Calories</span>
              </div>
            </motion.div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Eat with black coffee, Add salt..."
              className="rounded-xl min-h-[60px] resize-none border-border/50"
            />
          </div>

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              type="submit"
              disabled={saving || !foodName.trim()}
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
                  {item ? "Update Item" : "Add to Daily Menu"}
                </span>
              )}
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
