import { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Plus,
  Loader2,
  Star,
  Clock,
  CheckCircle2,
  Sparkles,
  Briefcase,
} from "lucide-react";
import { useCompanyTasks } from "@/hooks/useTasks";
import { Task } from "@/types/task";
import { Navbar } from "@/components/Navbar";
import { CompanyTaskCard } from "@/components/CompanyTaskCard";
import { CompanyTaskModal } from "@/components/CompanyTaskModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Company = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    togglePriority,
    completeAndDelete,
  } = useCompanyTasks();

  const handleAdd = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSave = async (taskData: any) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    } else {
      await addTask(taskData);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    const date = task.date || "No Date";
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const sortedDates = Object.keys(tasksByDate).sort();
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const priorityCount = tasks.filter((t) => t.priority).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-100 dark:bg-cyan-900/30">
                <Building2 className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Company Tasks</h1>
                <p className="text-sm text-muted-foreground">
                  Your business & office work
                </p>
              </div>
            </div>
            <Button onClick={handleAdd} className="gap-2 rounded-xl shadow-md">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>

          {/* Stats Card */}
          {tasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-6 p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border border-cyan-200/50 dark:border-cyan-800/30"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-500" />
                <span className="text-lg font-semibold text-foreground">
                  {tasks.length}
                </span>
                <span className="text-sm text-muted-foreground">active tasks</span>
              </div>
              {priorityCount > 0 && (
                <>
                  <div className="w-px h-6 bg-border" />
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="text-lg font-semibold text-foreground">
                      {priorityCount}
                    </span>
                    <span className="text-sm text-muted-foreground">priority</span>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </motion.section>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading company tasks...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-cyan-500" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </motion.div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No company tasks yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Add your business and office tasks here. Complete them with a satisfying tick!
            </p>
            <Button onClick={handleAdd} className="gap-2 rounded-xl">
              <Plus className="w-4 h-4" />
              Add First Company Task
            </Button>
          </motion.div>
        )}

        {/* Tasks by Date */}
        {!loading && !error && tasks.length > 0 && (
          <div className="space-y-6">
            {sortedDates.map((date) => {
              const isToday = date === todayStr;
              const displayDate = isToday
                ? "Today"
                : format(new Date(date), "EEEE, MMM d");

              return (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <h3 className={cn(
                      "text-sm font-medium",
                      isToday ? "text-primary" : "text-muted-foreground"
                    )}>
                      {displayDate}
                    </h3>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">
                      {tasksByDate[date].length} tasks
                    </span>
                  </div>

                  <div className="space-y-2 ml-6 pl-4 border-l-2 border-cyan-200/50 dark:border-cyan-800/30">
                    <AnimatePresence mode="popLayout">
                      {tasksByDate[date].map((task) => (
                        <CompanyTaskCard
                          key={task.id}
                          task={task}
                          onEdit={handleEdit}
                          onDelete={deleteTask}
                          onTogglePriority={togglePriority}
                          onComplete={completeAndDelete}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        {!loading && tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-4 rounded-xl bg-muted/30 border border-border/50 text-center"
          >
            <p className="text-sm text-muted-foreground">
              ✅ Tick a task to mark it done and clear it from the list.
              <br />
              ⭐ Starred tasks also appear in Priority.
            </p>
          </motion.div>
        )}

        {/* Task Modal */}
        <CompanyTaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleSave}
          task={editingTask}
        />
      </main>
    </div>
  );
};

export default Company;
