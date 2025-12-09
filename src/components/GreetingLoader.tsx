import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Sun, Moon, Sunrise, Sparkles, Star, Zap } from "lucide-react";

interface GreetingLoaderProps {
  onComplete: () => void;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning", icon: Sunrise, emoji: "☀️" };
  if (hour < 18) return { text: "Good afternoon", icon: Sun, emoji: "🌤️" };
  return { text: "Good evening", icon: Moon, emoji: "🌙" };
};

// Floating particle component
const FloatingParticle = ({ delay, duration, size, left, top }: { 
  delay: number; 
  duration: number;
  size: number;
  left: string;
  top: string;
}) => (
  <motion.div
    className="absolute rounded-full bg-primary/20"
    style={{ 
      width: size, 
      height: size, 
      left, 
      top,
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 0.8, 0],
      scale: [0, 1.5, 0],
      y: [0, -100],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

export const GreetingLoader = ({ onComplete }: GreetingLoaderProps) => {
  const { userProfile } = useAuth();
  const greeting = getGreeting();
  const Icon = greeting.icon;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 2500);
      }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.08) 0%, hsl(var(--background)) 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.2}
            duration={3 + Math.random() * 2}
            size={4 + Math.random() * 8}
            left={`${Math.random() * 100}%`}
            top={`${60 + Math.random() * 40}%`}
          />
        ))}
      </div>

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
        />
        
        {/* Extra decorative orbs */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--warning) / 0.2) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center px-4"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Profile Image with premium glow effect */}
        <motion.div
          className="relative mb-10"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
        >
          {/* Animated ring */}
          <motion.div
            className="absolute -inset-4 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--primary) / 0.2), hsl(var(--primary)))",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Glow effect */}
          <motion.div 
            className="absolute -inset-6 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Profile image container */}
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-background shadow-2xl">
            {userProfile?.photoUrl ? (
              <motion.img
                src={userProfile.photoUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                <motion.span 
                  className="text-5xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 400 }}
                >
                  {userProfile?.displayName?.charAt(0).toUpperCase() || "?"}
                </motion.span>
              </div>
            )}
          </div>
          
          {/* Time of day icon badge */}
          <motion.div
            className="absolute -bottom-2 -right-2 bg-background rounded-full p-3 shadow-xl border-2 border-background"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.9, type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <Icon className="w-7 h-7 text-warning drop-shadow-lg" />
            </motion.div>
          </motion.div>

          {/* Sparkle decorations */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${20 + i * 30}%`,
                left: i % 2 === 0 ? "-20%" : "100%",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: 1 + i * 0.3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
          ))}
        </motion.div>

        {/* Greeting text with staggered animation */}
        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {greeting.text},
          </motion.h1>
          
          <motion.div
            className="relative inline-block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.1, type: "spring", stiffness: 200 }}
          >
            <motion.p
              className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
            >
              {userProfile?.displayName || "there"}!
            </motion.p>
            
            {/* Underline animation */}
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            />
          </motion.div>
        </motion.div>

        {/* Motivational subtitle */}
        <motion.p
          className="mt-6 text-lg text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          Ready to make today productive?
        </motion.p>

        {/* Premium loading indicator */}
        <motion.div
          className="mt-10 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.8 }}
        >
          <motion.div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-primary/60"
                animate={{
                  y: [0, -12, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
