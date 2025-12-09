import { format } from "date-fns";
import { motion } from "framer-motion";
import { Star, Sparkles, Target, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { TaskList } from "@/components/TaskList";
import { usePriorityTasks, useTasks } from "@/hooks/useTasks";
import { cn } from "@/lib/utils";

const Priority = () => {
  const { tasks, loading } = usePriorityTasks();
  const today = format(new Date(), "yyyy-MM-dd");
  
  const {
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    togglePriority,
  } = useTasks();

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Premium Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                className="relative"
                animate={{ 
                  rotate: [0, -5, 5, 0],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 3 
                }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Star className="w-7 h-7 text-white fill-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity 
                  }}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </motion.div>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Priority Tasks</h1>
                <p className="text-muted-foreground">
                  {totalCount === 0 
                    ? "Focus on what matters most" 
                    : `${totalCount} important ${totalCount === 1 ? "task" : "tasks"} to focus on`
                  }
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            {totalCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-3"
              >
                <div className="p-4 rounded-xl bg-card border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Total</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{totalCount}</p>
                </div>
                
                <div className="p-4 rounded-xl bg-card border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-xs text-muted-foreground">Done</span>
                  </div>
                  <p className="text-2xl font-bold text-success">{completedCount}</p>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/50 dark:border-amber-800/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-amber-600 dark:text-amber-400">Progress</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{Math.round(progressPercent)}%</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Task List */}
          <TaskList
            tasks={tasks}
            loading={loading}
            selectedDate={today}
            onToggleComplete={toggleComplete}
            onTogglePriority={togglePriority}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            viewMode="priority"
            title="Priority Tasks"
          />
        </motion.div>
      </main>
    </div>
  );
};

export default Priority;
