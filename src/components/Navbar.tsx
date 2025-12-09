import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Star,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Sparkles,
  UtensilsCrossed,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/dashboard", label: "Today", icon: Home },
  { path: "/priority", label: "Priority", icon: Star },
  { path: "/learn", label: "To Learn", icon: BookOpen },
  { path: "/food", label: "Food", icon: UtensilsCrossed },
  { path: "/company", label: "Company", icon: Building2 },
];

export const Navbar = () => {
  const { userProfile, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <motion.nav 
      className="sticky top-0 z-40 w-full"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-xl border-b border-border/50" />
      
      {/* Subtle gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="relative container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with hover animation */}
          <Link 
            to="/dashboard" 
            className="flex items-center gap-3 group"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <motion.div 
              className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Calendar className="w-5 h-5 text-primary-foreground" />
              
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                animate={{ 
                  boxShadow: logoHovered 
                    ? "0 0 25px hsl(var(--primary) / 0.5)" 
                    : "0 0 0px hsl(var(--primary) / 0)"
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            
            <motion.span 
              className="text-xl font-bold text-foreground hidden sm:block tracking-tight"
              animate={{ x: logoHovered ? 3 : 0 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Day<span className="text-primary">Pilot</span>
            </motion.span>
          </Link>

          {/* Desktop Navigation with pill indicator */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-muted/50 rounded-full backdrop-blur-sm border border-border/50">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link key={path} to={path}>
                  <motion.div
                    className={cn(
                      "relative px-4 py-2 rounded-full flex items-center gap-2 transition-colors duration-200",
                      isActive 
                        ? "text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    whileHover={{ scale: isActive ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Active background pill */}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-pill"
                        className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 rounded-full shadow-lg shadow-primary/25"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    
                    <span className="relative flex items-center gap-2 text-sm font-medium">
                      <Icon className="w-4 h-4" />
                      {label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* User dropdown with premium styling */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button 
                  className="relative rounded-full p-0.5 bg-gradient-to-br from-primary/20 to-primary/5 hover:from-primary/30 hover:to-primary/10 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Animated ring */}
                  <motion.div
                    className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-primary/50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    style={{ opacity: 0.3 }}
                  />
                  
                  <Avatar className="h-10 w-10 border-2 border-background relative">
                    <AvatarImage src={userProfile?.photoUrl} alt={userProfile?.displayName} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
                      {userProfile?.displayName?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                </motion.button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                align="end" 
                className="w-64 p-2 bg-card/95 backdrop-blur-xl border-border/50 shadow-xl"
                sideOffset={8}
              >
                {/* User info header */}
                <div className="px-3 py-3 mb-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={userProfile?.photoUrl} alt={userProfile?.displayName} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                        {userProfile?.displayName?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{userProfile?.displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{userProfile?.email}</p>
                    </div>
                  </div>
                </div>
                
                <DropdownMenuItem asChild>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2.5 transition-colors hover:bg-primary/5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Profile Settings</p>
                      <p className="text-xs text-muted-foreground">Manage your account</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="my-2" />
                
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2.5 text-destructive focus:text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Sign Out</p>
                    <p className="text-xs opacity-70">See you soon!</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden relative"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation with smooth animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-border/50">
                {navItems.map(({ path, label, icon: Icon }, index) => {
                  const isActive = location.pathname === path;
                  return (
                    <motion.div
                      key={path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={path}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                            isActive 
                              ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25" 
                              : "hover:bg-muted/50"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{label}</span>
                          {isActive && <Sparkles className="w-4 h-4 ml-auto" />}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
