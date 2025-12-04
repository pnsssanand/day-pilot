import { format } from "date-fns";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { TaskList } from "@/components/TaskList";
import { useLearnTasks, useTasks } from "@/hooks/useTasks";

const Learn = () => {
  const { tasks, loading } = useLearnTasks();
  const today = format(new Date(), "yyyy-MM-dd");
  
  const {
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    togglePriority,
  } = useTasks();

  // Custom add task that defaults to "learn" category
  const handleAddTask = async (taskData: any) => {
    await addTask({
      ...taskData,
      category: "learn",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Things to Learn</h1>
              <p className="text-muted-foreground">
                {tasks.length} learning {tasks.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          {/* Learning Tips */}
          <div className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              <strong>Tip:</strong> Break down complex topics into smaller, manageable learning tasks. 
              Mark them with priority stars for topics you want to focus on first!
            </p>
          </div>

          {/* Task List */}
          <TaskList
            tasks={tasks}
            loading={loading}
            selectedDate={today}
            onToggleComplete={toggleComplete}
            onTogglePriority={togglePriority}
            onAddTask={handleAddTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            viewMode="learn"
            title="Learning List"
          />
        </motion.div>
      </main>
    </div>
  );
};

export default Learn;
