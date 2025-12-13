// Nutrition Types for DayPilot Food Section

export interface NutritionInfo {
  proteinPer100g: number; // grams of protein per 100g
  caloriesPer100g: number; // calories per 100g
  defaultUnit: string; // default unit for this food
  gramsPerUnit?: number; // optional: grams per piece/cup/bowl etc.
}

export interface DailyMenuItem {
  id: string;
  foodName: string;
  quantity: number;
  unit: string;
  time: string; // HH:mm format
  notes: string | null;
  // Nutrition data (auto-calculated)
  totalProtein: number;
  totalCalories: number;
  // Reference nutrition per 100g (for recalculation)
  proteinPer100g: number;
  caloriesPer100g: number;
  // If true, this food was auto-matched from reference table
  isFromReference: boolean;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type DailyMenuFormData = Omit<DailyMenuItem, "id" | "userId" | "createdAt" | "updatedAt">;

// Unit to grams conversion mapping
export const UNIT_TO_GRAMS: Record<string, number> = {
  "g": 1,
  "100g": 100,
  "kg": 1000,
  "ml": 1, // approximate: 1ml ≈ 1g for water-based
  "100ml": 100,
  "liter": 1000,
  "piece": 50, // default, overridden per food
  "pieces": 50,
  "cup": 240,
  "bowl": 300,
  "glass": 250,
  "scoop": 30,
  "tbsp": 15,
  "tsp": 5,
  "slice": 30,
  "serving": 150,
};

// Common food nutrition reference table
// Values are per 100g for standardization
export const NUTRITION_REFERENCE: Record<string, NutritionInfo> = {
  // Eggs & Dairy (egg ~50g per piece)
  "egg": { proteinPer100g: 12, caloriesPer100g: 140, defaultUnit: "piece", gramsPerUnit: 50 },
  "eggs": { proteinPer100g: 12, caloriesPer100g: 140, defaultUnit: "piece", gramsPerUnit: 50 },
  "boiled egg": { proteinPer100g: 12, caloriesPer100g: 140, defaultUnit: "piece", gramsPerUnit: 50 },
  "boiled eggs": { proteinPer100g: 12, caloriesPer100g: 140, defaultUnit: "piece", gramsPerUnit: 50 },
  "scrambled eggs": { proteinPer100g: 10, caloriesPer100g: 150, defaultUnit: "piece", gramsPerUnit: 60 },
  "omelette": { proteinPer100g: 11, caloriesPer100g: 150, defaultUnit: "piece", gramsPerUnit: 110 },
  "milk": { proteinPer100g: 3.4, caloriesPer100g: 42, defaultUnit: "glass", gramsPerUnit: 250 },
  "paneer": { proteinPer100g: 18, caloriesPer100g: 265, defaultUnit: "100g" },
  "cottage cheese": { proteinPer100g: 11, caloriesPer100g: 98, defaultUnit: "100g" },
  "curd": { proteinPer100g: 3.5, caloriesPer100g: 60, defaultUnit: "bowl", gramsPerUnit: 200 },
  "yogurt": { proteinPer100g: 10, caloriesPer100g: 100, defaultUnit: "bowl", gramsPerUnit: 200 },
  "greek yogurt": { proteinPer100g: 10, caloriesPer100g: 100, defaultUnit: "bowl", gramsPerUnit: 200 },
  "cheese": { proteinPer100g: 25, caloriesPer100g: 400, defaultUnit: "slice", gramsPerUnit: 20 },
  "butter": { proteinPer100g: 1, caloriesPer100g: 720, defaultUnit: "tbsp", gramsPerUnit: 10 },
  
  // Meat & Poultry
  "chicken breast": { proteinPer100g: 31, caloriesPer100g: 165, defaultUnit: "100g" },
  "chicken": { proteinPer100g: 27, caloriesPer100g: 239, defaultUnit: "100g" },
  "grilled chicken": { proteinPer100g: 31, caloriesPer100g: 165, defaultUnit: "100g" },
  "chicken thigh": { proteinPer100g: 26, caloriesPer100g: 209, defaultUnit: "100g" },
  "mutton": { proteinPer100g: 25, caloriesPer100g: 294, defaultUnit: "100g" },
  "fish": { proteinPer100g: 22, caloriesPer100g: 130, defaultUnit: "100g" },
  "salmon": { proteinPer100g: 20, caloriesPer100g: 208, defaultUnit: "100g" },
  "tuna": { proteinPer100g: 30, caloriesPer100g: 130, defaultUnit: "100g" },
  "prawns": { proteinPer100g: 24, caloriesPer100g: 99, defaultUnit: "100g" },
  "shrimp": { proteinPer100g: 24, caloriesPer100g: 99, defaultUnit: "100g" },
  
  // Legumes & Pulses
  "dal": { proteinPer100g: 9, caloriesPer100g: 120, defaultUnit: "bowl", gramsPerUnit: 200 },
  "lentils": { proteinPer100g: 9, caloriesPer100g: 116, defaultUnit: "bowl", gramsPerUnit: 200 },
  "chickpeas": { proteinPer100g: 8.9, caloriesPer100g: 164, defaultUnit: "100g" },
  "chana": { proteinPer100g: 8.9, caloriesPer100g: 164, defaultUnit: "bowl", gramsPerUnit: 200 },
  "rajma": { proteinPer100g: 8.7, caloriesPer100g: 127, defaultUnit: "bowl", gramsPerUnit: 200 },
  "kidney beans": { proteinPer100g: 8.7, caloriesPer100g: 127, defaultUnit: "100g" },
  "moong dal": { proteinPer100g: 7, caloriesPer100g: 105, defaultUnit: "bowl", gramsPerUnit: 200 },
  "sprouts": { proteinPer100g: 4, caloriesPer100g: 31, defaultUnit: "bowl", gramsPerUnit: 100 },
  "soybean": { proteinPer100g: 36, caloriesPer100g: 446, defaultUnit: "100g" },
  "tofu": { proteinPer100g: 8, caloriesPer100g: 76, defaultUnit: "100g" },
  
  // Grains & Cereals
  "rice": { proteinPer100g: 2.7, caloriesPer100g: 130, defaultUnit: "bowl", gramsPerUnit: 200 },
  "brown rice": { proteinPer100g: 2.6, caloriesPer100g: 111, defaultUnit: "bowl", gramsPerUnit: 200 },
  "oats": { proteinPer100g: 13, caloriesPer100g: 389, defaultUnit: "bowl", gramsPerUnit: 40 },
  "oatmeal": { proteinPer100g: 5, caloriesPer100g: 150, defaultUnit: "bowl", gramsPerUnit: 250 },
  "wheat bread": { proteinPer100g: 9, caloriesPer100g: 250, defaultUnit: "slice", gramsPerUnit: 30 },
  "bread": { proteinPer100g: 8, caloriesPer100g: 250, defaultUnit: "slice", gramsPerUnit: 30 },
  "roti": { proteinPer100g: 8, caloriesPer100g: 200, defaultUnit: "piece", gramsPerUnit: 35 },
  "chapati": { proteinPer100g: 8, caloriesPer100g: 200, defaultUnit: "piece", gramsPerUnit: 35 },
  "paratha": { proteinPer100g: 6, caloriesPer100g: 260, defaultUnit: "piece", gramsPerUnit: 60 },
  "poha": { proteinPer100g: 2, caloriesPer100g: 130, defaultUnit: "bowl", gramsPerUnit: 250 },
  "upma": { proteinPer100g: 3, caloriesPer100g: 130, defaultUnit: "bowl", gramsPerUnit: 250 },
  "idli": { proteinPer100g: 4, caloriesPer100g: 80, defaultUnit: "piece", gramsPerUnit: 50 },
  "dosa": { proteinPer100g: 4, caloriesPer100g: 133, defaultUnit: "piece", gramsPerUnit: 100 },
  
  // Supplements & Protein
  "whey protein": { proteinPer100g: 80, caloriesPer100g: 400, defaultUnit: "scoop", gramsPerUnit: 30 },
  "protein shake": { proteinPer100g: 80, caloriesPer100g: 400, defaultUnit: "scoop", gramsPerUnit: 30 },
  "protein powder": { proteinPer100g: 80, caloriesPer100g: 400, defaultUnit: "scoop", gramsPerUnit: 30 },
  "peanut butter": { proteinPer100g: 25, caloriesPer100g: 590, defaultUnit: "tbsp", gramsPerUnit: 32 },
  "almonds": { proteinPer100g: 21, caloriesPer100g: 579, defaultUnit: "g" },
  "peanuts": { proteinPer100g: 26, caloriesPer100g: 567, defaultUnit: "g" },
  "walnuts": { proteinPer100g: 15, caloriesPer100g: 654, defaultUnit: "g" },
  "cashews": { proteinPer100g: 18, caloriesPer100g: 553, defaultUnit: "g" },
  
  // Fruits & Vegetables
  "banana": { proteinPer100g: 1.1, caloriesPer100g: 89, defaultUnit: "piece", gramsPerUnit: 120 },
  "apple": { proteinPer100g: 0.3, caloriesPer100g: 52, defaultUnit: "piece", gramsPerUnit: 180 },
  "mango": { proteinPer100g: 0.8, caloriesPer100g: 60, defaultUnit: "piece", gramsPerUnit: 200 },
  "orange": { proteinPer100g: 0.9, caloriesPer100g: 47, defaultUnit: "piece", gramsPerUnit: 130 },
  "spinach": { proteinPer100g: 2.9, caloriesPer100g: 23, defaultUnit: "100g" },
  "broccoli": { proteinPer100g: 2.8, caloriesPer100g: 34, defaultUnit: "100g" },
  "potato": { proteinPer100g: 2, caloriesPer100g: 77, defaultUnit: "piece", gramsPerUnit: 150 },
  "sweet potato": { proteinPer100g: 1.6, caloriesPer100g: 86, defaultUnit: "piece", gramsPerUnit: 130 },
  "avocado": { proteinPer100g: 2, caloriesPer100g: 160, defaultUnit: "piece", gramsPerUnit: 200 },
  
  // Beverages
  "black coffee": { proteinPer100g: 0.1, caloriesPer100g: 1, defaultUnit: "cup", gramsPerUnit: 240 },
  "coffee": { proteinPer100g: 0.1, caloriesPer100g: 1, defaultUnit: "cup", gramsPerUnit: 240 },
  "tea": { proteinPer100g: 0, caloriesPer100g: 1, defaultUnit: "cup", gramsPerUnit: 240 },
  "green tea": { proteinPer100g: 0, caloriesPer100g: 0, defaultUnit: "cup", gramsPerUnit: 240 },
  "buttermilk": { proteinPer100g: 3.3, caloriesPer100g: 40, defaultUnit: "glass", gramsPerUnit: 250 },
  "lassi": { proteinPer100g: 2.5, caloriesPer100g: 60, defaultUnit: "glass", gramsPerUnit: 250 },
  "coconut water": { proteinPer100g: 0.7, caloriesPer100g: 19, defaultUnit: "glass", gramsPerUnit: 250 },
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

// Calculate total grams based on quantity and unit
export const calculateGrams = (
  quantity: number, 
  unit: string, 
  foodGramsPerUnit?: number
): number => {
  // For gram-based units, calculate directly
  if (unit === "g") return quantity;
  if (unit === "100g") return quantity * 100;
  if (unit === "kg") return quantity * 1000;
  if (unit === "ml") return quantity;
  if (unit === "100ml") return quantity * 100;
  if (unit === "liter") return quantity * 1000;
  
  // For non-gram units, use food-specific grams or default mapping
  const gramsPerUnit = foodGramsPerUnit || UNIT_TO_GRAMS[unit] || 100;
  return quantity * gramsPerUnit;
};

// Calculate nutrition based on food, quantity, and unit
export const calculateNutrition = (
  foodName: string,
  quantity: number,
  unit: string
): { totalProtein: number; totalCalories: number; proteinPer100g: number; caloriesPer100g: number; isFromReference: boolean } => {
  const nutrition = lookupNutrition(foodName);
  
  if (!nutrition) {
    // Unknown food - return zero values
    return {
      totalProtein: 0,
      totalCalories: 0,
      proteinPer100g: 0,
      caloriesPer100g: 0,
      isFromReference: false,
    };
  }
  
  const totalGrams = calculateGrams(quantity, unit, nutrition.gramsPerUnit);
  
  const totalProtein = Math.round((totalGrams / 100) * nutrition.proteinPer100g * 10) / 10;
  const totalCalories = Math.round((totalGrams / 100) * nutrition.caloriesPer100g);
  
  return {
    totalProtein,
    totalCalories,
    proteinPer100g: nutrition.proteinPer100g,
    caloriesPer100g: nutrition.caloriesPer100g,
    isFromReference: true,
  };
};

// Custom food storage (user-defined foods)
export interface CustomFood {
  id: string;
  foodName: string;
  proteinPer100g: number;
  caloriesPer100g: number;
  defaultUnit: string;
  gramsPerUnit?: number;
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
