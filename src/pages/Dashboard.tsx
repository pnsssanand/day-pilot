import { useState, useEffect } from "react";
import { format } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { DateSelector } from "@/components/DateSelector";
import { TaskList } from "@/components/TaskList";
import { GreetingLoader } from "@/components/GreetingLoader";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const [showGreeting, setShowGreeting] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const { userProfile } = useAuth();

  const {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    togglePriority,
  } = useTasks(selectedDate);

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
          {/* Date Selector */}
          <section className="mb-8">
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </section>

          {/* Task List */}
          <section>
            <TaskList
              tasks={tasks}
              loading={loading}
              selectedDate={selectedDate}
              onToggleComplete={toggleComplete}
              onTogglePriority={togglePriority}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              viewMode="date"
            />
          </section>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
