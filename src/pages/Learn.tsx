import { format } from "date-fns";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Lightbulb, Brain, Sparkles, CheckCircle } from "lucide-react";
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

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Learning tips to show randomly
  const learningTips = [
    "Break complex topics into smaller chunks for easier absorption",
    "Practice active recall instead of passive reading",
    "Teach others what you learn to reinforce understanding",
    "Take short breaks to improve focus and retention",
    "Connect new knowledge to things you already know",
  ];
  const randomTip = learningTips[Math.floor(Math.random() * learningTips.length)];

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
                  y: [0, -3, 0],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </motion.div>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Things to Learn</h1>
                <p className="text-muted-foreground">
                  {totalCount === 0 
                    ? "Track your learning journey" 
                    : `${totalCount} learning ${totalCount === 1 ? "goal" : "goals"} in progress`
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
                className="grid grid-cols-3 gap-3 mb-6"
              >
                <div className="p-4 rounded-xl bg-card border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Learning</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{totalCount - completedCount}</p>
                </div>
                
                <div className="p-4 rounded-xl bg-card border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-xs text-muted-foreground">Learned</span>
                  </div>
                  <p className="text-2xl font-bold text-success">{completedCount}</p>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/50 dark:border-emerald-800/50">
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">Progress</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{Math.round(progressPercent)}%</p>
                </div>
              </motion.div>
            )}

            {/* Learning Tip Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/50 dark:border-emerald-800/50"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-800/30 flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-0.5">
                    Learning Tip
                  </p>
                  <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
                    {randomTip}
                  </p>
                </div>
              </div>
            </motion.div>
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
            title="Learning Goals"
          />
        </motion.div>
      </main>
    </div>
  );
};

export default Learn;
