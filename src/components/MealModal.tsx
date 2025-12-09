import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { 
  X, 
  Loader2, 
  Upload, 
  Clock, 
  Calendar,
  Utensils,
  Image as ImageIcon,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useToast } from "@/hooks/use-toast";
import { 
  Meal, 
  MealFormData, 
  MealType, 
  MEAL_TYPE_LABELS, 
  MEAL_TYPE_ICONS,
  MEAL_TIME_DEFAULTS 
} from "@/types/food";
import { cn } from "@/lib/utils";

interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MealFormData) => Promise<void>;
  meal?: Meal | null;
  defaultDate?: string;
  defaultMealType?: MealType;
}

export const MealModal = ({
  isOpen,
  onClose,
  onSave,
  meal,
  defaultDate,
  defaultMealType,
}: MealModalProps) => {
  const { toast } = useToast();
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState(meal?.name || "");
  const [description, setDescription] = useState(meal?.description || "");
  const [mealType, setMealType] = useState<MealType>(meal?.mealType || defaultMealType || "lunch");
  const [date, setDate] = useState(meal?.date || defaultDate || format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState(meal?.time || MEAL_TIME_DEFAULTS[mealType]);
  const [imageUrl, setImageUrl] = useState(meal?.imageUrl || "");
  const [calories, setCalories] = useState<string>(meal?.calories?.toString() || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleMealTypeChange = (type: MealType) => {
    setMealType(type);
    if (!meal) {
      setTime(MEAL_TIME_DEFAULTS[type]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadToCloudinary(file, setUploadProgress);
      setImageUrl(result.secure_url);
      toast({
        title: "Image uploaded!",
        description: "Your meal photo has been added.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a meal name.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim() || undefined,
        mealType,
        date,
        time,
        imageUrl: imageUrl || undefined,
        calories: calories ? parseInt(calories) : undefined,
      });
      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: "Failed to save",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setMealType(defaultMealType || "lunch");
    setDate(defaultDate || format(new Date(), "yyyy-MM-dd"));
    setTime(MEAL_TIME_DEFAULTS[defaultMealType || "lunch"]);
    setImageUrl("");
    setCalories("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-xl border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Utensils className="w-5 h-5 text-primary" />
            {meal ? "Edit Meal" : "Add Meal"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Meal Type Selection */}
          <div className="space-y-2">
            <Label>Meal Type</Label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(MEAL_TYPE_LABELS) as MealType[]).map((type) => (
                <motion.button
                  key={type}
                  type="button"
                  onClick={() => handleMealTypeChange(type)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all",
                    mealType === type
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">{MEAL_TYPE_ICONS[type]}</span>
                  <span className="text-xs font-medium">{MEAL_TYPE_LABELS[type]}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Meal Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Grilled Chicken Salad"
              className="bg-background/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes about ingredients, recipe, etc."
              className="bg-background/50 resize-none"
              rows={2}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-background/50"
              />
            </div>
          </div>

          {/* Calories */}
          <div className="space-y-2">
            <Label htmlFor="calories" className="flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Calories (optional)
            </Label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="e.g., 450"
              className="bg-background/50"
              min="0"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Meal Photo (optional)
            </Label>
            
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <AnimatePresence mode="wait">
              {imageUrl ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative rounded-xl overflow-hidden aspect-video bg-muted group"
                >
                  <img
                    src={imageUrl}
                    alt="Meal preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setImageUrl("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => !uploading && imageInputRef.current?.click()}
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 p-6 rounded-xl",
                    "border-2 border-dashed border-border/50",
                    "bg-muted/20 cursor-pointer",
                    "hover:border-primary/50 hover:bg-primary/5",
                    "transition-all duration-300"
                  )}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <Progress value={uploadProgress} className="h-2 w-full max-w-xs" />
                      <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload a photo
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-primary"
              disabled={saving || uploading}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                meal ? "Update Meal" : "Add Meal"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
