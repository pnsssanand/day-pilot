import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Inbox, Star, BookOpen, Loader2 } from "lucide-react";
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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const EmptyIcon = viewMode === "priority" ? Star : viewMode === "learn" ? BookOpen : Inbox;

  return (
    <div className="space-y-6">
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div>
          {title && <h2 className="text-xl font-semibold text-foreground">{title}</h2>}
          {totalCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {completedCount} of {totalCount} completed
            </p>
          )}
        </div>
        <Button onClick={() => handleAdd()} className="btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-hero rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      )}

      {/* Empty state */}
      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <EmptyIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">No tasks yet</h3>
          <p className="text-muted-foreground mb-4">
            {viewMode === "priority"
              ? "Star tasks to see them here"
              : viewMode === "learn"
              ? "Add tasks with 'To Learn' category"
              : "Add your first task to get started"}
          </p>
          <Button onClick={() => handleAdd()} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </motion.div>
      )}

      {/* Quick add time slots (only for date view) */}
      {viewMode === "date" && tasks.length === 0 && (
        <div className="grid grid-cols-3 gap-2">
          {["06:00", "07:00", "08:00"].map((time) => (
            <Button
              key={time}
              variant="outline"
              className="h-auto py-3 flex flex-col items-center gap-1"
              onClick={() => handleAdd(time)}
            >
              <span className="text-xs text-muted-foreground">{time}</span>
              <Plus className="w-4 h-4" />
            </Button>
          ))}
        </div>
      )}

      {/* Unscheduled tasks */}
      {unscheduledTasks.length > 0 && viewMode === "date" && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Anytime
          </h3>
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
