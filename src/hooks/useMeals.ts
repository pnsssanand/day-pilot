import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Meal, MealFormData } from "@/types/food";

export const useMeals = (selectedDate?: string) => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setMeals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let q;
    if (selectedDate) {
      q = query(
        collection(db, "meals"),
        where("userId", "==", user.uid),
        where("date", "==", selectedDate),
        orderBy("time", "asc")
      );
    } else {
      q = query(
        collection(db, "meals"),
        where("userId", "==", user.uid),
        orderBy("date", "desc"),
        orderBy("time", "asc")
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const mealsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Meal[];
        setMeals(mealsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching meals:", err);
        setError("Failed to load meals");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, selectedDate]);

  const addMeal = useCallback(
    async (mealData: MealFormData) => {
      if (!user) throw new Error("No user logged in");

      const newMeal = {
        ...mealData,
        userId: user.uid,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "meals"), newMeal);
    },
    [user]
  );

  const updateMeal = useCallback(async (mealId: string, updates: Partial<MealFormData>) => {
    const mealRef = doc(db, "meals", mealId);
    await updateDoc(mealRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }, []);

  const deleteMeal = useCallback(async (mealId: string) => {
    const mealRef = doc(db, "meals", mealId);
    await deleteDoc(mealRef);
  }, []);

  // Group meals by meal type
  const mealsByType = meals.reduce((acc, meal) => {
    if (!acc[meal.mealType]) acc[meal.mealType] = [];
    acc[meal.mealType].push(meal);
    return acc;
  }, {} as Record<string, Meal[]>);

  return {
    meals,
    mealsByType,
    loading,
    error,
    addMeal,
    updateMeal,
    deleteMeal,
  };
};
