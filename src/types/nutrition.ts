// Nutrition Types for DayPilot Food Section

export interface NutritionInfo {
  proteinPerUnit: number; // grams of protein
  caloriesPerUnit: number; // calories
  defaultUnit: string; // default unit for this food
}

export interface DailyMenuItem {
  id: string;
  foodName: string;
  quantity: number;
  unit: string;
  time: string; // HH:mm format
  notes: string | null;
  // Nutrition data (calculated or user-provided)
  proteinPerUnit: number;
  caloriesPerUnit: number;
  totalProtein: number;
  totalCalories: number;
  // If true, this food was auto-matched from reference table
  isFromReference: boolean;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type DailyMenuFormData = Omit<DailyMenuItem, "id" | "userId" | "createdAt" | "updatedAt" | "totalProtein" | "totalCalories">;

// Common food nutrition reference table
// Values are per standard unit
export const NUTRITION_REFERENCE: Record<string, NutritionInfo> = {
  // Eggs & Dairy
  "egg": { proteinPerUnit: 6, caloriesPerUnit: 70, defaultUnit: "piece" },
  "eggs": { proteinPerUnit: 6, caloriesPerUnit: 70, defaultUnit: "piece" },
  "boiled egg": { proteinPerUnit: 6, caloriesPerUnit: 70, defaultUnit: "piece" },
  "boiled eggs": { proteinPerUnit: 6, caloriesPerUnit: 70, defaultUnit: "piece" },
  "scrambled eggs": { proteinPerUnit: 6, caloriesPerUnit: 90, defaultUnit: "piece" },
  "omelette": { proteinPerUnit: 12, caloriesPerUnit: 150, defaultUnit: "piece" },
  "milk": { proteinPerUnit: 3.4, caloriesPerUnit: 42, defaultUnit: "100ml" },
  "paneer": { proteinPerUnit: 18, caloriesPerUnit: 265, defaultUnit: "100g" },
  "cottage cheese": { proteinPerUnit: 11, caloriesPerUnit: 98, defaultUnit: "100g" },
  "curd": { proteinPerUnit: 3.5, caloriesPerUnit: 60, defaultUnit: "100g" },
  "yogurt": { proteinPerUnit: 10, caloriesPerUnit: 100, defaultUnit: "100g" },
  "greek yogurt": { proteinPerUnit: 10, caloriesPerUnit: 100, defaultUnit: "100g" },
  "cheese": { proteinPerUnit: 25, caloriesPerUnit: 400, defaultUnit: "100g" },
  "butter": { proteinPerUnit: 0.1, caloriesPerUnit: 72, defaultUnit: "10g" },
  
  // Meat & Poultry
  "chicken breast": { proteinPerUnit: 31, caloriesPerUnit: 165, defaultUnit: "100g" },
  "chicken": { proteinPerUnit: 27, caloriesPerUnit: 239, defaultUnit: "100g" },
  "grilled chicken": { proteinPerUnit: 31, caloriesPerUnit: 165, defaultUnit: "100g" },
  "chicken thigh": { proteinPerUnit: 26, caloriesPerUnit: 209, defaultUnit: "100g" },
  "mutton": { proteinPerUnit: 25, caloriesPerUnit: 294, defaultUnit: "100g" },
  "fish": { proteinPerUnit: 22, caloriesPerUnit: 130, defaultUnit: "100g" },
  "salmon": { proteinPerUnit: 20, caloriesPerUnit: 208, defaultUnit: "100g" },
  "tuna": { proteinPerUnit: 30, caloriesPerUnit: 130, defaultUnit: "100g" },
  "prawns": { proteinPerUnit: 24, caloriesPerUnit: 99, defaultUnit: "100g" },
  "shrimp": { proteinPerUnit: 24, caloriesPerUnit: 99, defaultUnit: "100g" },
  
  // Legumes & Pulses
  "dal": { proteinPerUnit: 9, caloriesPerUnit: 120, defaultUnit: "100g" },
  "lentils": { proteinPerUnit: 9, caloriesPerUnit: 116, defaultUnit: "100g" },
  "chickpeas": { proteinPerUnit: 8.9, caloriesPerUnit: 164, defaultUnit: "100g" },
  "chana": { proteinPerUnit: 8.9, caloriesPerUnit: 164, defaultUnit: "100g" },
  "rajma": { proteinPerUnit: 8.7, caloriesPerUnit: 127, defaultUnit: "100g" },
  "kidney beans": { proteinPerUnit: 8.7, caloriesPerUnit: 127, defaultUnit: "100g" },
  "moong dal": { proteinPerUnit: 7, caloriesPerUnit: 105, defaultUnit: "100g" },
  "sprouts": { proteinPerUnit: 4, caloriesPerUnit: 31, defaultUnit: "100g" },
  "soybean": { proteinPerUnit: 36, caloriesPerUnit: 446, defaultUnit: "100g" },
  "tofu": { proteinPerUnit: 8, caloriesPerUnit: 76, defaultUnit: "100g" },
  
  // Grains & Cereals
  "rice": { proteinPerUnit: 2.7, caloriesPerUnit: 130, defaultUnit: "100g" },
  "brown rice": { proteinPerUnit: 2.6, caloriesPerUnit: 111, defaultUnit: "100g" },
  "oats": { proteinPerUnit: 13, caloriesPerUnit: 389, defaultUnit: "100g" },
  "oatmeal": { proteinPerUnit: 5, caloriesPerUnit: 150, defaultUnit: "bowl" },
  "wheat bread": { proteinPerUnit: 4, caloriesPerUnit: 80, defaultUnit: "slice" },
  "bread": { proteinPerUnit: 3, caloriesPerUnit: 75, defaultUnit: "slice" },
  "roti": { proteinPerUnit: 3, caloriesPerUnit: 70, defaultUnit: "piece" },
  "chapati": { proteinPerUnit: 3, caloriesPerUnit: 70, defaultUnit: "piece" },
  "paratha": { proteinPerUnit: 4, caloriesPerUnit: 150, defaultUnit: "piece" },
  "poha": { proteinPerUnit: 2, caloriesPerUnit: 130, defaultUnit: "bowl" },
  "upma": { proteinPerUnit: 4, caloriesPerUnit: 160, defaultUnit: "bowl" },
  "idli": { proteinPerUnit: 2, caloriesPerUnit: 39, defaultUnit: "piece" },
  "dosa": { proteinPerUnit: 4, caloriesPerUnit: 133, defaultUnit: "piece" },
  
  // Supplements & Protein
  "whey protein": { proteinPerUnit: 24, caloriesPerUnit: 120, defaultUnit: "scoop" },
  "protein shake": { proteinPerUnit: 24, caloriesPerUnit: 120, defaultUnit: "scoop" },
  "protein powder": { proteinPerUnit: 24, caloriesPerUnit: 120, defaultUnit: "scoop" },
  "peanut butter": { proteinPerUnit: 8, caloriesPerUnit: 190, defaultUnit: "tbsp" },
  "almonds": { proteinPerUnit: 21, caloriesPerUnit: 579, defaultUnit: "100g" },
  "peanuts": { proteinPerUnit: 26, caloriesPerUnit: 567, defaultUnit: "100g" },
  "walnuts": { proteinPerUnit: 15, caloriesPerUnit: 654, defaultUnit: "100g" },
  "cashews": { proteinPerUnit: 18, caloriesPerUnit: 553, defaultUnit: "100g" },
  
  // Fruits & Vegetables
  "banana": { proteinPerUnit: 1.1, caloriesPerUnit: 89, defaultUnit: "piece" },
  "apple": { proteinPerUnit: 0.3, caloriesPerUnit: 52, defaultUnit: "piece" },
  "mango": { proteinPerUnit: 0.8, caloriesPerUnit: 60, defaultUnit: "piece" },
  "orange": { proteinPerUnit: 0.9, caloriesPerUnit: 47, defaultUnit: "piece" },
  "spinach": { proteinPerUnit: 2.9, caloriesPerUnit: 23, defaultUnit: "100g" },
  "broccoli": { proteinPerUnit: 2.8, caloriesPerUnit: 34, defaultUnit: "100g" },
  "potato": { proteinPerUnit: 2, caloriesPerUnit: 77, defaultUnit: "100g" },
  "sweet potato": { proteinPerUnit: 1.6, caloriesPerUnit: 86, defaultUnit: "100g" },
  "avocado": { proteinPerUnit: 2, caloriesPerUnit: 160, defaultUnit: "piece" },
  
  // Beverages
  "black coffee": { proteinPerUnit: 0.3, caloriesPerUnit: 2, defaultUnit: "cup" },
  "coffee": { proteinPerUnit: 0.3, caloriesPerUnit: 2, defaultUnit: "cup" },
  "tea": { proteinPerUnit: 0, caloriesPerUnit: 2, defaultUnit: "cup" },
  "green tea": { proteinPerUnit: 0, caloriesPerUnit: 0, defaultUnit: "cup" },
  "buttermilk": { proteinPerUnit: 3.3, caloriesPerUnit: 40, defaultUnit: "glass" },
  "lassi": { proteinPerUnit: 4, caloriesPerUnit: 100, defaultUnit: "glass" },
  "coconut water": { proteinPerUnit: 0.7, caloriesPerUnit: 46, defaultUnit: "glass" },
};

// Food units
export const FOOD_UNITS = [
  "piece",
  "pieces",
  "g",
  "100g",
  "kg",
  "ml",
  "100ml",
  "liter",
  "cup",
  "bowl",
  "glass",
  "scoop",
  "tbsp",
  "tsp",
  "slice",
  "serving",
] as const;

// Time slots for food
export const FOOD_TIME_SLOTS = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30", "22:00", "22:30", "23:00",
] as const;

// Helper function to look up nutrition info
export const lookupNutrition = (foodName: string): NutritionInfo | null => {
  const normalized = foodName.toLowerCase().trim();
  
  // Direct match
  if (NUTRITION_REFERENCE[normalized]) {
    return NUTRITION_REFERENCE[normalized];
  }
  
  // Partial match - find if food name contains any reference key
  for (const [key, value] of Object.entries(NUTRITION_REFERENCE)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  return null;
};

// Custom food storage (user-defined foods)
export interface CustomFood {
  id: string;
  foodName: string;
  proteinPerUnit: number;
  caloriesPerUnit: number;
  defaultUnit: string;
  userId: string;
  createdAt: Date;
}

// Shopping item for the reminder list
export interface ShoppingReminder {
  id: string;
  name: string;
  quantity: string; // e.g., "30", "1kg", "2 packs"
  needToBuy: boolean;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type ShoppingReminderFormData = Omit<ShoppingReminder, "id" | "userId" | "createdAt" | "updatedAt">;
