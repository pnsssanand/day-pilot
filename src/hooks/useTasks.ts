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
import { Task, TaskFormData } from "@/types/task";

export const useTasks = (selectedDate?: string) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let q;
    if (selectedDate) {
      q = query(
        collection(db, "tasks"),
        where("userId", "==", user.uid),
        where("date", "==", selectedDate),
        orderBy("time", "asc")
      );
    } else {
      q = query(
        collection(db, "tasks"),
        where("userId", "==", user.uid),
        orderBy("date", "asc")
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Task[];
        setTasks(tasksData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, selectedDate]);

  const addTask = useCallback(
    async (taskData: TaskFormData) => {
      if (!user) throw new Error("No user logged in");

      const newTask = {
        ...taskData,
        userId: user.uid,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "tasks"), newTask);
    },
    [user]
  );

  const updateTask = useCallback(async (taskId: string, updates: Partial<TaskFormData>) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);
  }, []);

  const toggleComplete = useCallback(
    async (taskId: string, completed: boolean) => {
      await updateTask(taskId, { completed });
    },
    [updateTask]
  );

  const togglePriority = useCallback(
    async (taskId: string, priority: boolean) => {
      await updateTask(taskId, { priority });
    },
    [updateTask]
  );

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    togglePriority,
  };
};

export const usePriorityTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      where("priority", "==", true),
      orderBy("date", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Task[];
      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { tasks, loading };
};

export const useLearnTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      where("category", "==", "learn"),
      orderBy("date", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Task[];
      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { tasks, loading };
};
