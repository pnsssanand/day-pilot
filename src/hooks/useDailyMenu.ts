import { useState, useEffect, useCallback, useMemo } from "react";
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
import { 
  DailyMenuItem, 
  DailyMenuFormData, 
  lookupNutrition 
} from "@/types/nutrition";

export const useDailyMenu = () => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<DailyMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch daily menu items (recurring - not date-specific)
  useEffect(() => {
    if (!user) {
      setMenuItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(
      collection(db, "dailyMenu"),
      where("userId", "==", user.uid),
      orderBy("time", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as DailyMenuItem[];
        setMenuItems(items);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching daily menu:", err);
        setError("Failed to load daily menu");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Add a new menu item (nutrition values are pre-calculated in the form)
  const addMenuItem = useCallback(
    async (itemData: DailyMenuFormData) => {
      if (!user) throw new Error("No user logged in");

      const newItem = {
        ...itemData,
        userId: user.uid,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "dailyMenu"), newItem);
    },
    [user]
  );

  // Update a menu item (nutrition values are pre-calculated in the form)
  const updateMenuItem = useCallback(
    async (itemId: string, updates: Partial<DailyMenuFormData>) => {
      const itemRef = doc(db, "dailyMenu", itemId);
      
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    },
    []
  );

  // Delete a menu item
  const deleteMenuItem = useCallback(async (itemId: string) => {
    const itemRef = doc(db, "dailyMenu", itemId);
    await deleteDoc(itemRef);
  }, []);

  // Calculate daily totals
  const dailyTotals = useMemo(() => {
    const totalProtein = menuItems.reduce((sum, item) => sum + (item.totalProtein || 0), 0);
    const totalCalories = menuItems.reduce((sum, item) => sum + (item.totalCalories || 0), 0);
    return { totalProtein: Math.round(totalProtein * 10) / 10, totalCalories: Math.round(totalCalories) };
  }, [menuItems]);

  // Group items by time period
  const groupedItems = useMemo(() => {
    const morning: DailyMenuItem[] = [];
    const afternoon: DailyMenuItem[] = [];
    const evening: DailyMenuItem[] = [];

    menuItems.forEach((item) => {
      const hour = parseInt(item.time.split(":")[0]);
      if (hour < 12) {
        morning.push(item);
      } else if (hour < 17) {
        afternoon.push(item);
      } else {
        evening.push(item);
      }
    });

    return { morning, afternoon, evening };
  }, [menuItems]);

  return {
    menuItems,
    loading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    dailyTotals,
    groupedItems,
  };
};

// Simple shopping reminder hook
export const useShoppingReminder = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<{ id: string; name: string; quantity: string; needToBuy: boolean; createdAt: Date }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Simple query without complex ordering to avoid index issues
    const q = query(
      collection(db, "shoppingReminder"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const itemsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          quantity: doc.data().quantity,
          needToBuy: doc.data().needToBuy,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
        // Sort client-side: needToBuy first, then by date
        itemsData.sort((a, b) => {
          if (a.needToBuy !== b.needToBuy) return a.needToBuy ? -1 : 1;
          return b.createdAt.getTime() - a.createdAt.getTime();
        });
        setItems(itemsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching shopping reminders:", err);
        setError("Failed to load shopping list");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addItem = useCallback(
    async (name: string, quantity: string) => {
      if (!user) throw new Error("No user logged in");

      await addDoc(collection(db, "shoppingReminder"), {
        name,
        quantity,
        needToBuy: true,
        userId: user.uid,
        createdAt: Timestamp.now(),
      });
    },
    [user]
  );

  const updateItem = useCallback(
    async (itemId: string, updates: { name?: string; quantity?: string }) => {
      const itemRef = doc(db, "shoppingReminder", itemId);
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    },
    []
  );

  const toggleNeedToBuy = useCallback(async (itemId: string, needToBuy: boolean) => {
    const itemRef = doc(db, "shoppingReminder", itemId);
    await updateDoc(itemRef, {
      needToBuy,
      updatedAt: Timestamp.now(),
    });
  }, []);

  const deleteItem = useCallback(async (itemId: string) => {
    const itemRef = doc(db, "shoppingReminder", itemId);
    await deleteDoc(itemRef);
  }, []);

  const clearCompleted = useCallback(async () => {
    const completedItems = items.filter((item) => !item.needToBuy);
    await Promise.all(completedItems.map((item) => deleteItem(item.id)));
  }, [items, deleteItem]);

  const stats = useMemo(() => {
    const needToBuy = items.filter((i) => i.needToBuy).length;
    const bought = items.filter((i) => !i.needToBuy).length;
    return { needToBuy, bought, total: items.length };
  }, [items]);

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    toggleNeedToBuy,
    deleteItem,
    clearCompleted,
    stats,
  };
};
