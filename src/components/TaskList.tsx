import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Inbox, Star, BookOpen, Loader2, Sparkles, Clock } from "lucide-react";
import { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";
import { TaskModal } from "./TaskModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  selectedDate: string;
  onToggleComplete: (taskId: string, completed: boolean) => Promise<void>;
  onTogglePriority: (taskId: string, priority: boolean) => Promise<void>;
  onAddTask: (task: any) => Promise<void>;
  onUpdateTask: (taskId: string, updates: any) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  viewMode?: "date" | "priority" | "learn";
  title?: string;
}

const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00"
];

// Premium empty state illustrations
const EmptyStateIllustration = ({ viewMode }: { viewMode: string }) => {
  if (viewMode === "priority") {
    return (
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
          <Star className="w-10 h-10 text-amber-500" />
        </div>
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-5 h-5 text-amber-400" />
        </motion.div>
      </div>
    );
  }
  
  if (viewMode === "learn") {
    return (
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-emerald-500" />
        </div>
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-5 h-5 text-emerald-400" />
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
        <Inbox className="w-10 h-10 text-primary" />
      </div>
      <motion.div
        className="absolute -bottom-1 -right-1"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
          <Plus className="w-4 h-4 text-primary" />
        </div>
      </motion.div>
    </div>
  );
};

export const TaskList = ({
  tasks,
  loading,
  selectedDate,
  onToggleComplete,
  onTogglePriority,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  viewMode = "date",
  title,
}: TaskListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [quickAddTime, setQuickAddTime] = useState<string | null>(null);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleAdd = (time?: string) => {
    setEditingTask(null);
    setQuickAddTime(time || null);
    setIsModalOpen(true);
  };

  const handleSave = async (taskData: any) => {
    if (editingTask) {
      await onUpdateTask(editingTask.id, taskData);
    } else {
      await onAddTask(taskData);
    }
    // Modal closes itself on success via onClose callback
  };
  
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setQuickAddTime(null);
  };

  // Group tasks by time slot
  const tasksByTime = tasks.reduce((acc, task) => {
    const timeKey = task.time || "unscheduled";
    if (!acc[timeKey]) acc[timeKey] = [];
    acc[timeKey].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const unscheduledTasks = tasksByTime["unscheduled"] || [];
  const scheduledTimes = TIME_SLOTS.filter((time) => tasksByTime[time]?.length > 0);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  const getEmptyMessage = () => {
    if (viewMode === "priority") {
      return {
        title: "No priority tasks yet",
        subtitle: "Star tasks to see them here for focused work",
      };
    }
    if (viewMode === "learn") {
      return {
        title: "No learning goals yet",
        subtitle: "Add topics you want to learn and track your progress",
      };
    }
    return {
      title: "No tasks for this day",
      subtitle: "Add your first task to start planning your day",
    };
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          {title && <h2 className="text-lg font-semibold text-foreground">{title}</h2>}
          {totalCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {completedCount} of {totalCount} completed
            </p>
          )}
        </div>
        <Button 
          onClick={() => handleAdd()} 
          className="gap-2 rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Empty state */}
      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <EmptyStateIllustration viewMode={viewMode} />
          
          <h3 className="text-lg font-semibold text-foreground mt-6 mb-1">
            {getEmptyMessage().title}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xs">
            {getEmptyMessage().subtitle}
          </p>
          
          <Button 
            onClick={() => handleAdd()} 
            className="rounded-xl gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Your First Task
          </Button>
        </motion.div>
      )}

      {/* Quick add time slots (only for date view with no tasks) */}
      {viewMode === "date" && tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <p className="text-sm text-muted-foreground mb-3 text-center">Quick add by time</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {["06:00", "08:00", "10:00", "12:00", "14:00", "18:00"].map((time) => (
              <Button
                key={time}
                variant="outline"
                className="h-auto py-3 flex flex-col items-center gap-1 rounded-xl hover:border-primary/50 hover:bg-primary/5"
                onClick={() => handleAdd(time)}
              >
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium">{time}</span>
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Unscheduled tasks */}
      {unscheduledTasks.length > 0 && viewMode === "date" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">Anytime</h3>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {unscheduledTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onTogglePriority={onTogglePriority}
                  onEdit={handleEdit}
                  onDelete={onDeleteTask}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Scheduled tasks by time */}
      {viewMode === "date" && scheduledTimes.map((time) => (
        <div key={time} className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary">{time}</span>
            <div className="flex-1 h-px bg-border" />
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-muted-foreground hover:text-primary"
              onClick={() => handleAdd(time)}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-2 pl-4 border-l-2 border-primary/20">
            <AnimatePresence mode="popLayout">
              {tasksByTime[time].map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onTogglePriority={onTogglePriority}
                  onEdit={handleEdit}
                  onDelete={onDeleteTask}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}

      {/* Non-date views (priority/learn) show all tasks */}
      {viewMode !== "date" && tasks.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onTogglePriority={onTogglePriority}
                onEdit={handleEdit}
                onDelete={onDeleteTask}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
          setQuickAddTime(null);
        }}
        onSave={handleSave}
        task={editingTask}
        defaultDate={selectedDate}
        defaultTime={quickAddTime}
      />
    </div>
  );
};
