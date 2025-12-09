export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface Meal {
  id: string;
  name: string;
  description?: string;
  mealType: MealType;
  date: string; // YYYY-MM-DD format
  time: string; // HH:mm format
  imageUrl?: string;
  calories?: number;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type MealFormData = Omit<Meal, "id" | "userId" | "createdAt" | "updatedAt">;

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  category?: string;
  imageUrl?: string;
  purchased: boolean;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type ShoppingItemFormData = Omit<ShoppingItem, "id" | "userId" | "createdAt" | "updatedAt">;

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

export const MEAL_TYPE_ICONS: Record<MealType, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  snack: "🍿",
};

export const MEAL_TYPE_COLORS: Record<MealType, string> = {
  breakfast: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  lunch: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  dinner: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  snack: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800",
};

export const MEAL_TIME_DEFAULTS: Record<MealType, string> = {
  breakfast: "08:00",
  lunch: "13:00",
  dinner: "19:00",
  snack: "16:00",
};

export const SHOPPING_CATEGORIES = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Bakery",
  "Pantry",
  "Frozen",
  "Beverages",
  "Snacks",
  "Other",
] as const;

export const SHOPPING_UNITS = [
  "pcs",
  "kg",
  "g",
  "lbs",
  "oz",
  "liters",
  "ml",
  "dozen",
  "pack",
  "box",
  "bag",
  "bottle",
  "can",
] as const;
