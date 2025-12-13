import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  DailyMenuItem, 
  DailyMenuFormData, 
  FOOD_UNITS, 
  FOOD_TIME_SLOTS,
  lookupNutrition,
  calculateNutrition,
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FoodItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DailyMenuFormData) => Promise<void>;
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
  item,
}: FoodItemModalProps) => {
  const { toast } = useToast();
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("piece");
  const [time, setTime] = useState("09:00");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Check if food is found in database
  const nutritionInfo = useMemo(() => {
    if (!foodName.trim()) return null;
    return lookupNutrition(foodName);
  }, [foodName]);

  const isFromReference = !!nutritionInfo;

  // Auto-calculate nutrition based on food, quantity, and unit
  const calculatedNutrition = useMemo(() => {
    if (!foodName.trim()) {
      return { totalProtein: 0, totalCalories: 0, proteinPer100g: 0, caloriesPer100g: 0, isFromReference: false };
    }
    return calculateNutrition(foodName, quantity, unit);
  }, [foodName, quantity, unit]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFoodName(item.foodName);
        setQuantity(item.quantity);
        setUnit(item.unit);
        setTime(item.time);
        setNotes(item.notes || "");
        setValidationError(null);
      } else {
        setFoodName("");
        setQuantity(1);
        setUnit("piece");
        setTime("09:00");
        setNotes("");
        setValidationError(null);
      }
    }
  }, [item, isOpen]);

  // Auto-set default unit when food is recognized
  useEffect(() => {
    if (nutritionInfo && !item) {
      const validUnit = FOOD_UNITS.includes(nutritionInfo.defaultUnit as any) 
        ? nutritionInfo.defaultUnit 
        : "piece";
      setUnit(validUnit);
    }
  }, [nutritionInfo, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    // Validate required fields
    if (!foodName.trim()) {
      setValidationError("Please enter a food name");
      return;
    }
    
    if (quantity <= 0) {
      setValidationError("Quantity must be greater than 0");
      return;
    }
    
    if (!time) {
      setValidationError("Please select a time");
      return;
    }
    
    // Check if food is recognized
    if (!isFromReference) {
      setValidationError("Food not found in database. Please check the spelling or try a different name.");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        foodName: foodName.trim(),
        quantity,
        unit,
        time,
        notes: notes.trim() || null,
        totalProtein: calculatedNutrition.totalProtein,
        totalCalories: calculatedNutrition.totalCalories,
        proteinPer100g: calculatedNutrition.proteinPer100g,
        caloriesPer100g: calculatedNutrition.caloriesPer100g,
        isFromReference: true,
      });
      
      toast({
        title: item ? "Food item updated" : "Food item added",
        description: `${foodName} has been ${item ? "updated" : "added"} to your daily menu.`,
      });
      
      onClose();
    } catch (error) {
      console.error("Error saving food item:", error);
      setValidationError("Failed to save food item. Please try again.");
      toast({
        title: "Error",
        description: "Failed to save food item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

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
              {isFromReference && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Check className="w-5 h-5 text-emerald-500" />
                </motion.div>
              )}
            </div>
            {foodName.trim() && !isFromReference && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Food not found. Try: eggs, chicken, rice, oats, banana...</span>
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
                  <SelectValue placeholder="Select unit" />
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

          {/* Auto-Calculated Nutrition Display */}
          {isFromReference && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-950/30 dark:to-orange-950/30 border border-emerald-200/50 dark:border-emerald-800/30"
            >
              <p className="text-xs text-muted-foreground text-center mb-3">
                Auto-calculated nutrition for {quantity} {unit}
              </p>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <Dumbbell className="w-4 h-4 text-emerald-500" />
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {calculatedNutrition.totalProtein}g
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Protein</span>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {calculatedNutrition.totalCalories}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Calories</span>
                </div>
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

          {/* Validation Error */}
          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{validationError}</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              type="submit"
              disabled={saving || !foodName.trim() || quantity <= 0 || !time || !isFromReference}
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
