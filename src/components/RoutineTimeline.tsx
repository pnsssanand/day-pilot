import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Clock,
  Loader2,
  RotateCcw,
  Sparkles,
  Sun,
  Coffee,
  Briefcase,
  Moon,
  Dumbbell,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { RoutineBlock, RoutineBlockFormData, ROUTINE_COLORS } from "@/types/routine";
import { RoutineBlockCard } from "./RoutineBlockCard";
import { RoutineBlockModal } from "./RoutineBlockModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface RoutineTimelineProps {
  blocks: RoutineBlock[];
  loading: boolean;
  selectedDate: string;
  onToggleComplete: (blockId: string, completed: boolean) => Promise<void>;
  onTogglePriority: (blockId: string, priority: boolean) => Promise<void>;
  onToggleLock: (blockId: string, isLocked: boolean) => Promise<void>;
  onUpdateBlock: (blockId: string, updates: Partial<RoutineBlockFormData>) => Promise<void>;
  onDeleteBlock: (blockId: string) => Promise<void>;
  onResetToDefault: () => Promise<void>;
  stats: {
    total: number;
    completed: number;
    progress: number;
  };
}

// Get current time block based on current time
const getCurrentTimeBlock = (blocks: RoutineBlock[]): string | null => {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  for (const block of blocks) {
    const start = block.startTime;
    const end = block.endTime;

    // Handle overnight blocks (e.g., 23:00 - 08:00)
    if (end < start) {
      if (currentTime >= start || currentTime < end) {
        return block.id;
      }
    } else {
      if (currentTime >= start && currentTime < end) {
        return block.id;
      }
    }
  }
  return null;
};

// Group blocks by time period
const groupBlocksByPeriod = (blocks: RoutineBlock[]) => {
  const morning: RoutineBlock[] = [];
  const afternoon: RoutineBlock[] = [];
  const evening: RoutineBlock[] = [];
  const night: RoutineBlock[] = [];

  blocks.forEach((block) => {
    const hour = parseInt(block.startTime.split(":")[0]);
    if (hour >= 5 && hour < 12) {
      morning.push(block);
    } else if (hour >= 12 && hour < 17) {
      afternoon.push(block);
    } else if (hour >= 17 && hour < 21) {
      evening.push(block);
    } else {
      night.push(block);
    }
  });

  return { morning, afternoon, evening, night };
};

// Period section component
const PeriodSection = ({
  title,
  icon: Icon,
  iconColor,
  blocks,
  currentBlockId,
  onToggleComplete,
  onTogglePriority,
  onToggleLock,
  onEdit,
  onDelete,
}: {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  blocks: RoutineBlock[];
  currentBlockId: string | null;
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
  onTogglePriority: (id: string, priority: boolean) => Promise<void>;
  onToggleLock: (id: string, isLocked: boolean) => Promise<void>;
  onEdit: (block: RoutineBlock) => void;
  onDelete: (id: string) => Promise<void>;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const completedCount = blocks.filter((b) => b.completed).length;

  if (blocks.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <motion.button
          className="w-full flex items-center justify-between py-3 px-1 group"
          whileHover={{ x: 2 }}
        >
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", iconColor)}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="font-medium text-foreground">{title}</span>
            <span className="text-sm text-muted-foreground">
              {completedCount}/{blocks.length}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </motion.div>
        </motion.button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          className="space-y-3 ml-6 pl-4 border-l-2 border-border/50"
        >
          <AnimatePresence mode="popLayout">
            {blocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
              >
                <RoutineBlockCard
                  block={block}
                  onToggleComplete={onToggleComplete}
                  onTogglePriority={onTogglePriority}
                  onToggleLock={onToggleLock}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isCurrentTimeBlock={block.id === currentBlockId}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const RoutineTimeline = ({
  blocks,
  loading,
  selectedDate,
  onToggleComplete,
  onTogglePriority,
  onToggleLock,
  onUpdateBlock,
  onDeleteBlock,
  onResetToDefault,
  stats,
}: RoutineTimelineProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<RoutineBlock | null>(null);
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Update current time block every minute
  useEffect(() => {
    const updateCurrentBlock = () => {
      setCurrentBlockId(getCurrentTimeBlock(blocks));
    };

    updateCurrentBlock();
    const interval = setInterval(updateCurrentBlock, 60000);
    return () => clearInterval(interval);
  }, [blocks]);

  const handleEdit = (block: RoutineBlock) => {
    setEditingBlock(block);
    setIsModalOpen(true);
  };

  const handleSave = async (data: RoutineBlockFormData) => {
    if (editingBlock) {
      await onUpdateBlock(editingBlock.id, data);
    }
    setIsModalOpen(false);
    setEditingBlock(null);
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await onResetToDefault();
    } finally {
      setIsResetting(false);
    }
  };

  const periods = groupBlocksByPeriod(blocks);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading your routine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Daily Routine</h3>
              <p className="text-sm text-muted-foreground">
                {stats.completed} of {stats.total} blocks completed
              </p>
            </div>
          </div>
          <div className="text-right">
            <motion.span 
              className="text-3xl font-bold text-primary"
              key={stats.progress}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {stats.progress}%
            </motion.span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${stats.progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Sparkle on complete */}
        {stats.progress === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 right-3"
          >
            <Sparkles className="w-6 h-6 text-primary" />
          </motion.div>
        )}
      </motion.div>

      {/* Reset Button */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={isResetting}
          className="text-muted-foreground hover:text-foreground gap-2"
        >
          <RotateCcw className={cn("w-4 h-4", isResetting && "animate-spin")} />
          Reset to Default
        </Button>
      </div>

      {/* Timeline by Period */}
      <div className="space-y-6">
        <PeriodSection
          title="Morning"
          icon={Sun}
          iconColor="bg-amber-100 dark:bg-amber-900/30 text-amber-500"
          blocks={periods.morning}
          currentBlockId={currentBlockId}
          onToggleComplete={onToggleComplete}
          onTogglePriority={onTogglePriority}
          onToggleLock={onToggleLock}
          onEdit={handleEdit}
          onDelete={onDeleteBlock}
        />

        <PeriodSection
          title="Afternoon"
          icon={Coffee}
          iconColor="bg-orange-100 dark:bg-orange-900/30 text-orange-500"
          blocks={periods.afternoon}
          currentBlockId={currentBlockId}
          onToggleComplete={onToggleComplete}
          onTogglePriority={onTogglePriority}
          onToggleLock={onToggleLock}
          onEdit={handleEdit}
          onDelete={onDeleteBlock}
        />

        <PeriodSection
          title="Evening"
          icon={Dumbbell}
          iconColor="bg-rose-100 dark:bg-rose-900/30 text-rose-500"
          blocks={periods.evening}
          currentBlockId={currentBlockId}
          onToggleComplete={onToggleComplete}
          onTogglePriority={onTogglePriority}
          onToggleLock={onToggleLock}
          onEdit={handleEdit}
          onDelete={onDeleteBlock}
        />

        <PeriodSection
          title="Night"
          icon={Moon}
          iconColor="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500"
          blocks={periods.night}
          currentBlockId={currentBlockId}
          onToggleComplete={onToggleComplete}
          onTogglePriority={onTogglePriority}
          onToggleLock={onToggleLock}
          onEdit={handleEdit}
          onDelete={onDeleteBlock}
        />
      </div>

      {/* Edit Modal */}
      <RoutineBlockModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBlock(null);
        }}
        onSave={handleSave}
        block={editingBlock}
      />
    </div>
  );
};
