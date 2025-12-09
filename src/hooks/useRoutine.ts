import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { 
  RoutineBlock, 
  DEFAULT_ROUTINE, 
  RoutineBlockFormData,
  ROUTINE_COLORS 
} from "@/types/routine";
import { format } from "date-fns";

// Generate unique ID
const generateId = () => `routine_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useRoutine = (selectedDate: string) => {
  const { user } = useAuth();
  const [routineBlocks, setRoutineBlocks] = useState<RoutineBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate default routine with unique IDs
  const generateDefaultRoutine = useCallback((): RoutineBlock[] => {
    return DEFAULT_ROUTINE.map((block, index) => ({
      ...block,
      id: `${selectedDate}_block_${index}`,
      color: ROUTINE_COLORS[block.type],
    }));
  }, [selectedDate]);

  // Initialize or fetch routine for the selected date
  useEffect(() => {
    if (!user) {
      setRoutineBlocks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Document ID is based on user and date
    const routineDocId = `${user.uid}_${selectedDate}`;
    const routineRef = doc(db, "routines", routineDocId);

    // Check if routine exists for this date, if not create default
    const initializeRoutine = async () => {
      try {
        const docSnap = await getDoc(routineRef);
        
        if (!docSnap.exists()) {
          // Create default routine for this day
          const defaultBlocks = generateDefaultRoutine();
          await setDoc(routineRef, {
            userId: user.uid,
            date: selectedDate,
            blocks: defaultBlocks,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
        }
      } catch (err) {
        console.error("Error initializing routine:", err);
      }
    };

    initializeRoutine();

    // Real-time listener for routine updates
    const unsubscribe = onSnapshot(
      routineRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Ensure colors are properly restored
          const blocks = (data.blocks || []).map((block: RoutineBlock) => ({
            ...block,
            color: ROUTINE_COLORS[block.type] || block.color,
          }));
          setRoutineBlocks(blocks);
        } else {
          setRoutineBlocks(generateDefaultRoutine());
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching routine:", err);
        setError("Failed to load routine");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, selectedDate, generateDefaultRoutine]);

  // Update a routine block
  const updateBlock = useCallback(
    async (blockId: string, updates: Partial<RoutineBlockFormData>) => {
      if (!user) throw new Error("No user logged in");

      const routineDocId = `${user.uid}_${selectedDate}`;
      const routineRef = doc(db, "routines", routineDocId);

      // Find and update the block in the array
      const updatedBlocks = routineBlocks.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      );

      await updateDoc(routineRef, {
        blocks: updatedBlocks,
        updatedAt: Timestamp.now(),
      });
    },
    [user, selectedDate, routineBlocks]
  );

  // Toggle block completion
  const toggleComplete = useCallback(
    async (blockId: string, completed: boolean) => {
      await updateBlock(blockId, { completed } as any);
    },
    [updateBlock]
  );

  // Toggle block priority
  const togglePriority = useCallback(
    async (blockId: string, priority: boolean) => {
      await updateBlock(blockId, { priority } as any);
    },
    [updateBlock]
  );

  // Delete a routine block (only if not locked)
  const deleteBlock = useCallback(
    async (blockId: string) => {
      if (!user) throw new Error("No user logged in");

      const block = routineBlocks.find((b) => b.id === blockId);
      if (block?.isLocked) {
        throw new Error("Cannot delete locked routine block");
      }

      const routineDocId = `${user.uid}_${selectedDate}`;
      const routineRef = doc(db, "routines", routineDocId);

      const updatedBlocks = routineBlocks.filter((b) => b.id !== blockId);

      await updateDoc(routineRef, {
        blocks: updatedBlocks,
        updatedAt: Timestamp.now(),
      });
    },
    [user, selectedDate, routineBlocks]
  );

  // Add a new editable block
  const addBlock = useCallback(
    async (newBlock: Omit<RoutineBlock, "id" | "color">) => {
      if (!user) throw new Error("No user logged in");

      const routineDocId = `${user.uid}_${selectedDate}`;
      const routineRef = doc(db, "routines", routineDocId);

      const block: RoutineBlock = {
        ...newBlock,
        id: generateId(),
        color: ROUTINE_COLORS[newBlock.type],
      };

      // Insert in correct time order
      const updatedBlocks = [...routineBlocks, block].sort((a, b) => 
        a.startTime.localeCompare(b.startTime)
      );

      await updateDoc(routineRef, {
        blocks: updatedBlocks,
        updatedAt: Timestamp.now(),
      });
    },
    [user, selectedDate, routineBlocks]
  );

  // Reset routine to default (for next day or manual reset)
  const resetToDefault = useCallback(async () => {
    if (!user) throw new Error("No user logged in");

    const routineDocId = `${user.uid}_${selectedDate}`;
    const routineRef = doc(db, "routines", routineDocId);
    const defaultBlocks = generateDefaultRoutine();

    await setDoc(routineRef, {
      userId: user.uid,
      date: selectedDate,
      blocks: defaultBlocks,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }, [user, selectedDate, generateDefaultRoutine]);

  // Get completion stats
  const stats = {
    total: routineBlocks.length,
    completed: routineBlocks.filter((b) => b.completed).length,
    progress: routineBlocks.length > 0 
      ? Math.round((routineBlocks.filter((b) => b.completed).length / routineBlocks.length) * 100)
      : 0,
  };

  return {
    routineBlocks,
    loading,
    error,
    updateBlock,
    toggleComplete,
    togglePriority,
    deleteBlock,
    addBlock,
    resetToDefault,
    stats,
  };
};
