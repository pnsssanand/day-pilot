import { useState, useEffect } from "react";
import { format, isToday, isTomorrow, addDays } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Sun, 
  Moon, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  LayoutGrid,
  Clock,
  ListTodo
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { TaskList } from "@/components/TaskList";
import { RoutineTimeline } from "@/components/RoutineTimeline";
import { GreetingLoader } from "@/components/GreetingLoader";
import { useTasks } from "@/hooks/useTasks";
import { useRoutine } from "@/hooks/useRoutine";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [showGreeting, setShowGreeting] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [viewMode, setViewMode] = useState<"routine" | "tasks">("routine");
  const { userProfile } = useAuth();

  const {
    tasks,
    loading: tasksLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    togglePriority,
  } = useTasks(selectedDate);

  const {
    routineBlocks,
    loading: routineLoading,
    updateBlock,
    toggleComplete: toggleRoutineComplete,
    togglePriority: toggleRoutinePriority,
    toggleLock: toggleRoutineLock,
    deleteBlock,
    resetToDefault,
    stats: routineStats,
  } = useRoutine(selectedDate);

  // Check if we should show greeting (only once per session)
  useEffect(() => {
    const hasSeenGreeting = sessionStorage.getItem("dayPilot_hasSeenGreeting");
    if (hasSeenGreeting) {
      setShowGreeting(false);
    }
  }, []);

  const handleGreetingComplete = () => {
    sessionStorage.setItem("dayPilot_hasSeenGreeting", "true");
    setShowGreeting(false);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getDateLabel = () => {
    const date = new Date(selectedDate);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEEE");
  };

  const navigateDate = (direction: number) => {
    const currentDate = new Date(selectedDate);
    const newDate = addDays(currentDate, direction);
    setSelectedDate(format(newDate, "yyyy-MM-dd"));
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const quickDates = [
    { label: "Today", date: format(new Date(), "yyyy-MM-dd") },
    { label: "Tomorrow", date: format(addDays(new Date(), 1), "yyyy-MM-dd") },
    { label: format(addDays(new Date(), 2), "EEE"), date: format(addDays(new Date(), 2), "yyyy-MM-dd") },
  ];

  return (
    <>
      <AnimatePresence>
        {showGreeting && userProfile && (
          <GreetingLoader onComplete={handleGreetingComplete} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto px-4 py-6 max-w-3xl">
          {/* Premium Welcome Header */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <motion.p 
                  className="text-muted-foreground text-sm mb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {format(new Date(), "EEEE, MMMM d")}
                </motion.p>
                <h1 className="text-2xl font-bold text-foreground">
                  {getGreeting()}{userProfile?.displayName ? `, ${userProfile.displayName.split(' ')[0]}` : ''}
                </h1>
              </div>
              {new Date().getHours() < 18 ? (
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                  <Sun className="w-5 h-5 text-amber-500" />
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                  <Moon className="w-5 h-5 text-indigo-500" />
                </div>
              )}
            </div>

            {/* Daily Progress Card */}
            {totalTasks > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Daily Progress</p>
                      <p className="text-lg font-semibold text-foreground">
                        {completedTasks} of {totalTasks} tasks
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-primary">{Math.round(progressPercent)}%</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                  />
                </div>

                {/* Decorative sparkle */}
                {progressPercent === 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-3 right-3"
                  >
                    <Sparkles className="w-5 h-5 text-primary" />
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.section>

          {/* Date Navigation */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-6"
          >
            {/* Date Header with Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateDate(-1)}
                className="h-10 w-10 rounded-xl hover:bg-primary/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground">{getDateLabel()}</h2>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedDate), "MMMM d, yyyy")}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateDate(1)}
                className="h-10 w-10 rounded-xl hover:bg-primary/10"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Quick Date Selection */}
            <div className="flex items-center gap-2">
              {quickDates.map(({ label, date }) => (
                <Button
                  key={date}
                  variant={selectedDate === date ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "flex-1 h-10 rounded-xl font-medium transition-all",
                    selectedDate === date 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "hover:bg-primary/10 hover:border-primary/30"
                  )}
                >
                  {label}
                </Button>
              ))}

              {/* Calendar Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:border-primary/30"
                  >
                    <CalendarIcon className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={new Date(selectedDate)}
                    onSelect={(date) => date && setSelectedDate(format(date, "yyyy-MM-dd"))}
                    initialFocus
                    className="rounded-xl"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </motion.section>

          {/* View Mode Tabs */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "routine" | "tasks")} className="w-full">
              <TabsList className="w-full h-12 bg-muted/50 p-1 rounded-xl mb-6">
                <TabsTrigger 
                  value="routine" 
                  className="flex-1 h-full rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Clock className="w-4 h-4" />
                  Daily Routine
                </TabsTrigger>
                <TabsTrigger 
                  value="tasks" 
                  className="flex-1 h-full rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <ListTodo className="w-4 h-4" />
                  My Tasks
                </TabsTrigger>
              </TabsList>

              {/* Routine Timeline View */}
              <TabsContent value="routine" className="mt-0">
                <RoutineTimeline
                  blocks={routineBlocks}
                  loading={routineLoading}
                  selectedDate={selectedDate}
                  onToggleComplete={toggleRoutineComplete}
                  onTogglePriority={toggleRoutinePriority}
                  onToggleLock={toggleRoutineLock}
                  onUpdateBlock={updateBlock}
                  onDeleteBlock={deleteBlock}
                  onResetToDefault={resetToDefault}
                  stats={routineStats}
                />
              </TabsContent>

              {/* Tasks View */}
              <TabsContent value="tasks" className="mt-0">
                <TaskList
                  tasks={tasks}
                  loading={tasksLoading}
                  selectedDate={selectedDate}
                  onToggleComplete={toggleComplete}
                  onTogglePriority={togglePriority}
                  onAddTask={addTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  viewMode="date"
                />
              </TabsContent>
            </Tabs>
          </motion.section>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
