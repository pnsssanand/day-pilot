import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Camera, 
  Video, 
  Loader2, 
  Save, 
  Upload, 
  X, 
  Sparkles, 
  CheckCircle2,
  User,
  Image,
  Film,
  Pen,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

// Floating particles component for premium feel
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 3 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Premium card component with glass morphism and hover effects
const PremiumCard = ({ 
  children, 
  className, 
  icon: Icon, 
  title, 
  description,
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  icon?: React.ElementType;
  title?: string;
  description?: string;
  delay?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [2, -2]);
  const rotateY = useTransform(mouseX, [-100, 100], [-2, 2]);

  const springConfig = { stiffness: 300, damping: 30 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn("relative group", className)}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, hsl(var(--primary) / 0.4), hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.4))`,
          filter: "blur(12px)",
        }}
      />
      
      <div className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-card/90 backdrop-blur-xl",
        "border border-border/50",
        "shadow-lg shadow-black/5",
        "transition-all duration-500",
        isHovered && "border-primary/40 shadow-xl shadow-primary/10"
      )}>
        {/* Animated shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          }}
          animate={isHovered ? {
            x: ["-100%", "200%"],
          } : {}}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
        />

        {/* Card header with icon */}
        {(Icon || title) && (
          <div className="relative p-6 pb-2">
            <div className="flex items-start gap-4">
              {Icon && (
                <motion.div 
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl",
                    "bg-gradient-to-br from-primary/20 to-primary/5",
                    "border border-primary/20",
                  )}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Icon className="w-6 h-6 text-primary" />
                </motion.div>
              )}
              <div className="flex-1 min-w-0">
                {title && (
                  <h3 className="text-lg font-semibold text-foreground tracking-tight">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Card content */}
        <div className="relative p-6 pt-4">
          {children}
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none opacity-50">
          <div 
            className="absolute -top-16 -right-16 w-32 h-32 rounded-full"
            style={{ 
              background: `radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)` 
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Animated avatar with ring effect
const AnimatedAvatar = ({ 
  src, 
  fallback, 
  uploading, 
  progress,
  onUploadClick,
}: { 
  src?: string; 
  fallback: string;
  uploading: boolean;
  progress: number;
  onUploadClick: () => void;
}) => {
  return (
    <motion.div 
      className="relative group cursor-pointer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onUploadClick}
    >
      {/* Animated gradient ring */}
      <motion.div
        className="absolute -inset-1.5 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--primary) / 0.3), hsl(var(--primary)))",
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Progress overlay when uploading */}
      {uploading && (
        <motion.div
          className="absolute -inset-1.5 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${progress * 3.14} 314`}
              className="transition-all duration-300"
            />
          </svg>
        </motion.div>
      )}

      {/* Avatar container */}
      <div className={cn(
        "relative rounded-full overflow-hidden",
        "border-4 border-background",
        "shadow-xl shadow-black/10",
        "w-32 h-32"
      )}>
        <Avatar className="w-full h-full">
          <AvatarImage src={src} className="object-cover" />
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-4xl font-bold">
            {fallback}
          </AvatarFallback>
        </Avatar>

        {/* Hover overlay */}
        <motion.div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "bg-black/60 backdrop-blur-sm",
            "opacity-0 group-hover:opacity-100",
            "transition-opacity duration-300"
          )}
        >
          {uploading ? (
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
              <span className="text-white text-sm mt-2 block">{progress}%</span>
            </div>
          ) : (
            <div className="text-center">
              <Camera className="w-8 h-8 text-white mx-auto" />
              <span className="text-white text-xs mt-1 block">Change</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Camera badge */}
      <motion.div
        className={cn(
          "absolute -bottom-1 -right-1",
          "w-10 h-10 rounded-full",
          "bg-background border-2 border-background",
          "shadow-lg",
          "flex items-center justify-center"
        )}
        whileHover={{ scale: 1.15 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className={cn(
          "w-full h-full rounded-full",
          "bg-gradient-to-br from-primary to-primary/80",
          "flex items-center justify-center"
        )}>
          <Camera className="w-4 h-4 text-primary-foreground" />
        </div>
      </motion.div>
    </motion.div>
  );
};

// Premium input with floating label and animations
const PremiumInput = ({
  id,
  value,
  onChange,
  placeholder,
  icon: Icon,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: React.ElementType;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative group">
      {/* Glow effect on focus */}
      <motion.div
        className="absolute -inset-0.5 rounded-xl pointer-events-none"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.4), hsl(var(--primary) / 0.1))",
          filter: "blur(8px)",
        }}
        animate={{ opacity: isFocused ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className={cn(
        "relative flex items-center gap-3",
        "px-4 py-4",
        "rounded-xl",
        "bg-background/80 backdrop-blur-sm",
        "border-2 transition-all duration-300",
        isFocused 
          ? "border-primary/50 shadow-lg shadow-primary/10" 
          : "border-border/50 hover:border-border"
      )}>
        {Icon && (
          <motion.div
            animate={{
              color: isFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
            }}
          >
            <Icon className="w-5 h-5 transition-colors duration-300" />
          </motion.div>
        )}
        
        <div className="flex-1 relative">
          <motion.label
            htmlFor={id}
            className={cn(
              "absolute left-0 transition-all duration-300 pointer-events-none origin-left",
            )}
            animate={{
              y: (isFocused || hasValue) ? -24 : 0,
              scale: (isFocused || hasValue) ? 0.85 : 1,
              color: isFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
            }}
          >
            {placeholder}
          </motion.label>
          <Input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "border-0 p-0 h-auto bg-transparent",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "text-foreground text-lg",
              "placeholder:text-transparent"
            )}
          />
        </div>

        <AnimatePresence>
          {hasValue && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="text-success"
            >
              <CheckCircle2 className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Premium save button with advanced animations
const PremiumSaveButton = ({
  onClick,
  saving,
  disabled,
}: {
  onClick: () => void;
  saving: boolean;
  disabled?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.5))",
          filter: "blur(16px)",
        }}
        animate={{ opacity: isHovered && !disabled ? 0.6 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <Button
        onClick={onClick}
        disabled={disabled || saving}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative overflow-hidden",
          "px-10 py-7 h-auto",
          "rounded-2xl",
          "bg-gradient-to-r from-primary via-primary to-primary/90",
          "hover:from-primary/95 hover:via-primary/90 hover:to-primary/80",
          "text-primary-foreground text-lg font-semibold",
          "shadow-xl shadow-primary/30",
          "transition-all duration-500",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        )}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
          }}
          animate={isHovered && !disabled ? {
            x: ["-100%", "200%"],
          } : {}}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        />

        <span className="relative flex items-center gap-3">
          <AnimatePresence mode="wait">
            {saving ? (
              <motion.div
                key="loading"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                exit={{ scale: 0 }}
                transition={{ 
                  scale: { type: "spring", stiffness: 400 },
                  rotate: { duration: 1, repeat: Infinity, ease: "linear" }
                }}
              >
                <Loader2 className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="save"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Save className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
          <span>{saving ? "Saving..." : "Save Changes"}</span>
          {!saving && !disabled && (
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
          )}
        </span>
      </Button>
    </motion.div>
  );
};

const Profile = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || "");
  const [photoUrl, setPhotoUrl] = useState(userProfile?.photoUrl || "");
  const [videoUrl, setVideoUrl] = useState(userProfile?.videoUrl || "");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [photoProgress, setPhotoProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Sync with userProfile when it loads
  useEffect(() => {
    if (userProfile?.displayName) {
      setDisplayName(userProfile.displayName);
    }
    if (userProfile?.photoUrl) {
      setPhotoUrl(userProfile.photoUrl);
    }
    if (userProfile?.videoUrl) {
      setVideoUrl(userProfile.videoUrl);
    }
  }, [userProfile]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingPhoto(true);
    setPhotoProgress(0);

    try {
      const result = await uploadToCloudinary(file, setPhotoProgress);
      setPhotoUrl(result.secure_url);
      toast({
        title: "✨ Photo uploaded!",
        description: "Your profile photo looks amazing.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
      setPhotoProgress(0);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a video under 50MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingVideo(true);
    setVideoProgress(0);

    try {
      const result = await uploadToCloudinary(file, setVideoProgress);
      setVideoUrl(result.secure_url);
      toast({
        title: "🎬 Video uploaded!",
        description: "Your profile video is ready.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingVideo(false);
      setVideoProgress(0);
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a display name.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const updateData: { displayName: string; photoUrl?: string; videoUrl?: string } = {
        displayName: displayName.trim(),
      };
      
      if (photoUrl) {
        updateData.photoUrl = photoUrl;
      }
      if (videoUrl) {
        updateData.videoUrl = videoUrl;
      }
      
      await updateUserProfile(updateData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      toast({
        title: "🎉 Profile saved!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast({
        title: "Save failed",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <FloatingParticles />
      </div>

      <Navbar />

      <main className="relative container mx-auto px-4 py-8 md:py-12 max-w-2xl">
        {/* Page header with premium styling */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
          >
            <Shield className="w-4 h-4" />
            <span>Profile Settings</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Make it{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                yours
              </span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              />
            </span>
          </motion.h1>
          <motion.p 
            className="text-lg text-muted-foreground max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Personalize your DayPilot experience with your photo, video, and display name.
          </motion.p>
        </motion.div>

        <div className="space-y-8">
          {/* Profile Photo Card */}
          <PremiumCard
            icon={Image}
            title="Profile Photo"
            description="This image will be shown in your greeting and navigation."
            delay={0.1}
          >
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <AnimatedAvatar
                src={photoUrl}
                fallback={displayName?.charAt(0).toUpperCase() || "?"}
                uploading={uploadingPhoto}
                progress={photoProgress}
                onUploadClick={() => photoInputRef.current?.click()}
              />

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div className="space-y-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className={cn(
                        "gap-2 w-full sm:w-auto h-12 px-6",
                        "border-2 border-dashed",
                        "hover:border-primary hover:bg-primary/5",
                        "transition-all duration-300"
                      )}
                    >
                      {uploadingPhoto ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                      {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                    </Button>
                  </motion.div>

                  <AnimatePresence>
                    {photoUrl && !uploadingPhoto && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPhotoUrl("")}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Remove photo
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {uploadingPhoto && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-2"
                    >
                      <Progress value={photoProgress} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {photoProgress}% uploaded
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-sm text-muted-foreground">
                  Recommended: Square image, at least 200×200px
                </p>
              </div>
            </div>
          </PremiumCard>

          {/* Profile Video Card */}
          <PremiumCard
            icon={Film}
            title="Profile Video"
            description="Add a short video introduction to make your profile unique."
            delay={0.2}
          >
            <div className="space-y-5">
              <AnimatePresence mode="wait">
                {videoUrl ? (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative rounded-2xl overflow-hidden bg-black aspect-video group shadow-2xl"
                  >
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                    <motion.div
                      className="absolute top-3 right-3"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-10 w-10 rounded-full shadow-lg"
                        onClick={() => setVideoUrl("")}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => !uploadingVideo && videoInputRef.current?.click()}
                    className={cn(
                      "relative rounded-2xl aspect-video",
                      "border-2 border-dashed border-border/50",
                      "bg-muted/20 backdrop-blur-sm",
                      "flex flex-col items-center justify-center gap-4",
                      "cursor-pointer group",
                      "hover:border-primary/50 hover:bg-primary/5",
                      "transition-all duration-500"
                    )}
                  >
                    <motion.div
                      className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Video className="w-10 h-10 text-primary" />
                    </motion.div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground text-lg">
                        Drop your video here
                      </p>
                      <p className="text-muted-foreground">
                        or click to browse (max 50MB)
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />

              <AnimatePresence>
                {uploadingVideo && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Uploading video...</span>
                      <span className="font-semibold text-primary">{videoProgress}%</span>
                    </div>
                    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${videoProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {videoUrl && !uploadingVideo && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={() => videoInputRef.current?.click()}
                    className="gap-2 h-12"
                  >
                    <Video className="w-5 h-5" />
                    Replace Video
                  </Button>
                </motion.div>
              )}
            </div>
          </PremiumCard>

          {/* Display Name Card */}
          <PremiumCard
            icon={Pen}
            title="Display Name"
            description="This is how you'll be greeted every time you open DayPilot."
            delay={0.3}
          >
            <PremiumInput
              id="displayName"
              value={displayName}
              onChange={setDisplayName}
              placeholder="Enter your name"
              icon={User}
            />
          </PremiumCard>

          {/* Save Button Section */}
          <motion.div 
            className="flex flex-col items-center gap-4 pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {saveSuccess ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-success/10 text-success font-semibold text-lg border border-success/20"
                >
                  <motion.div
                    initial={{ rotate: -180 }}
                    animate={{ rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </motion.div>
                  Saved successfully!
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="button">
                  <PremiumSaveButton
                    onClick={handleSave}
                    saving={saving}
                    disabled={!displayName.trim()}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-sm text-muted-foreground text-center">
              Your profile is securely stored and encrypted
            </p>
          </motion.div>
        </div>

        {/* Bottom spacing for mobile */}
        <div className="h-24" />
      </main>
    </div>
  );
};

export default Profile;
