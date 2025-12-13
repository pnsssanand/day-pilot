import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Sun, Moon, Sunrise } from "lucide-react";

interface GreetingLoaderProps {
  onComplete: () => void;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning", icon: Sunrise, emoji: "☀️" };
  if (hour < 18) return { text: "Good afternoon", icon: Sun, emoji: "🌤️" };
  return { text: "Good evening", icon: Moon, emoji: "🌙" };
};

export const GreetingLoader = ({ onComplete }: GreetingLoaderProps) => {
  const { userProfile } = useAuth();
  const greeting = getGreeting();
  const Icon = greeting.icon;

  // Trigger completion after animation duration
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="relative z-10 flex flex-col items-center px-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Profile Image */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
        >
          {/* Subtle ring */}
          <motion.div
            className="absolute -inset-2 rounded-full border-2 border-primary/20"
          />
          
          {/* Profile image container */}
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-primary/10 shadow-lg">
            {userProfile?.photoUrl ? (
              <motion.img
                src={userProfile.photoUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                <motion.span 
                  className="text-4xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
                >
                  {userProfile?.displayName?.charAt(0).toUpperCase() || "?"}
                </motion.span>
              </div>
            )}
          </div>
          
          {/* Time of day icon badge */}
          <motion.div
            className="absolute -bottom-1 -right-1 bg-background rounded-full p-2 shadow-md border border-border"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6, type: "spring", stiffness: 300 }}
          >
            <Icon className="w-5 h-5 text-primary" />
          </motion.div>
        </motion.div>

        {/* Greeting text */}
        <motion.div
          className="text-center"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-semibold text-foreground mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {greeting.text},
          </motion.h1>
          
          <motion.p
            className="text-2xl md:text-3xl font-bold text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {userProfile?.displayName || "there"}!
          </motion.p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="mt-4 text-base text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          Ready to make today productive?
        </motion.p>

        {/* Simple loading dots */}
        <motion.div
          className="mt-8 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.2 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/60"
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
