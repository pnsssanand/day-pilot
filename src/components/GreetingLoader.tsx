import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Sun, Moon, Sunrise } from "lucide-react";

interface GreetingLoaderProps {
  onComplete: () => void;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning", icon: Sunrise };
  if (hour < 18) return { text: "Good afternoon", icon: Sun };
  return { text: "Good evening", icon: Moon };
};

export const GreetingLoader = ({ onComplete }: GreetingLoaderProps) => {
  const { userProfile } = useAuth();
  const greeting = getGreeting();
  const Icon = greeting.icon;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-greeting"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 2000);
      }}
    >
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-primary/5"
          initial={{ scale: 0 }}
          animate={{ scale: 1.5 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-primary/5"
          initial={{ scale: 0 }}
          animate={{ scale: 1.5 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
        />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Profile Image with glow */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-soft" />
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-card shadow-elevated bg-card">
            {userProfile?.photoUrl ? (
              <img
                src={userProfile.photoUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-hero text-primary-foreground">
                <span className="text-3xl font-bold">
                  {userProfile?.displayName?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
            )}
          </div>
          <motion.div
            className="absolute -bottom-2 -right-2 bg-card rounded-full p-2 shadow-card"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.8, type: "spring" }}
          >
            <Icon className="w-5 h-5 text-warning" />
          </motion.div>
        </motion.div>

        {/* Greeting text */}
        <motion.div
          className="text-center"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {greeting.text},
          </h1>
          <motion.p
            className="text-2xl md:text-3xl font-semibold text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            {userProfile?.displayName || "there"}!
          </motion.p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          className="mt-12 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.2 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
