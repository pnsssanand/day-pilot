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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Simple query without composite index requirement
    // We filter priority tasks client-side to avoid index issues
    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const allTasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Task[];
        
        // Filter priority tasks and sort by date client-side
        const priorityTasks = allTasks
          .filter(task => task.priority === true)
          .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
        
        setTasks(priorityTasks);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching priority tasks:", err);
        setError("Failed to load priority tasks");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { tasks, loading, error };
};

export const useLearnTasks = () => {
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

    // Simple query without composite index requirement
    // We filter learn tasks client-side to avoid index issues
    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allTasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Task[];
        
        // Filter learn category tasks and sort by date client-side
        const learnTasks = allTasks
          .filter(task => task.category === "learn")
          .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
        
        setTasks(learnTasks);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching learn tasks:", err);
        setError("Failed to load learning tasks");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { tasks, loading, error };
};

export const useCompanyTasks = () => {
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

    // Query for company tasks
    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allTasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Task[];
        
        // Filter company category tasks, exclude completed, sort by date
        const companyTasks = allTasks
          .filter(task => task.category === "company" && !task.completed)
          .sort((a, b) => {
            // Sort by date first, then by time
            const dateCompare = (a.date || '').localeCompare(b.date || '');
            if (dateCompare !== 0) return dateCompare;
            return (a.time || '').localeCompare(b.time || '');
          });
        
        setTasks(companyTasks);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching company tasks:", err);
        setError("Failed to load company tasks");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addTask = useCallback(
    async (taskData: Omit<TaskFormData, "category">) => {
      if (!user) throw new Error("No user logged in");

      const newTask = {
        ...taskData,
        category: "company",
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

  const togglePriority = useCallback(
    async (taskId: string, priority: boolean) => {
      await updateTask(taskId, { priority });
    },
    [updateTask]
  );

  // Mark as complete (which effectively deletes from active view)
  const completeAndDelete = useCallback(async (taskId: string) => {
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    togglePriority,
    completeAndDelete,
  };
};
