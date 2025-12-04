import { format } from "date-fns";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { TaskList } from "@/components/TaskList";
import { usePriorityTasks, useTasks } from "@/hooks/useTasks";

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
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-warning fill-warning" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Priority Tasks</h1>
              <p className="text-muted-foreground">
                {tasks.length} starred {tasks.length === 1 ? "task" : "tasks"}
              </p>
            </div>
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
            title="All Priority Tasks"
          />
        </motion.div>
      </main>
    </div>
  );
};

export default Priority;
