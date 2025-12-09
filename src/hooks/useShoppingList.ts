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
import { ShoppingItem, ShoppingItemFormData } from "@/types/food";

export const useShoppingList = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<ShoppingItem[]>([]);
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

    const q = query(
      collection(db, "shoppingItems"),
      where("userId", "==", user.uid),
      orderBy("purchased", "asc"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const itemsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as ShoppingItem[];
        setItems(itemsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching shopping items:", err);
        setError("Failed to load shopping list");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addItem = useCallback(
    async (itemData: ShoppingItemFormData) => {
      if (!user) throw new Error("No user logged in");

      const newItem = {
        ...itemData,
        userId: user.uid,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "shoppingItems"), newItem);
    },
    [user]
  );

  const updateItem = useCallback(async (itemId: string, updates: Partial<ShoppingItemFormData>) => {
    const itemRef = doc(db, "shoppingItems", itemId);
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }, []);

  const deleteItem = useCallback(async (itemId: string) => {
    const itemRef = doc(db, "shoppingItems", itemId);
    await deleteDoc(itemRef);
  }, []);

  const togglePurchased = useCallback(async (itemId: string, purchased: boolean) => {
    const itemRef = doc(db, "shoppingItems", itemId);
    await updateDoc(itemRef, {
      purchased,
      updatedAt: Timestamp.now(),
    });
  }, []);

  const clearPurchased = useCallback(async () => {
    const purchasedItems = items.filter((item) => item.purchased);
    await Promise.all(purchasedItems.map((item) => deleteItem(item.id)));
  }, [items, deleteItem]);

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    const category = item.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  // Count stats
  const totalItems = items.length;
  const purchasedItems = items.filter((item) => item.purchased).length;
  const unpurchasedItems = totalItems - purchasedItems;

  return {
    items,
    itemsByCategory,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    togglePurchased,
    clearPurchased,
    stats: {
      total: totalItems,
      purchased: purchasedItems,
      unpurchased: unpurchasedItems,
    },
  };
};
