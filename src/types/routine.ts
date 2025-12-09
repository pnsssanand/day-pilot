// Daily Routine Types for DayPilot

export type RoutineBlockType = 
  | "wake-up"
  | "work"
  | "meal"
  | "editable"
  | "rest"
  | "gym"
  | "sleep";

export interface RoutineBlock {
  id: string;
  title: string;
  startTime: string; // HH:mm format (24-hour)
  endTime: string;   // HH:mm format (24-hour)
  type: RoutineBlockType;
  isLocked: boolean; // Locked blocks cannot be deleted
  isEditable: boolean; // Can the title/time be edited?
  completed: boolean;
  notes: string | null;
  priority: boolean;
  color: RoutineBlockColor;
}

export interface RoutineBlockColor {
  bg: string;
  border: string;
  text: string;
  icon: string;
}

// Color schemes for each block type
export const ROUTINE_COLORS: Record<RoutineBlockType, RoutineBlockColor> = {
  "wake-up": {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800/50",
    text: "text-amber-700 dark:text-amber-300",
    icon: "text-amber-500",
  },
  work: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800/50",
    text: "text-blue-700 dark:text-blue-300",
    icon: "text-blue-500",
  },
  meal: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800/50",
    text: "text-orange-700 dark:text-orange-300",
    icon: "text-orange-500",
  },
  editable: {
    bg: "bg-violet-50/50 dark:bg-violet-950/20",
    border: "border-dashed border-violet-300 dark:border-violet-700/50",
    text: "text-violet-700 dark:text-violet-300",
    icon: "text-violet-500",
  },
  rest: {
    bg: "bg-teal-50 dark:bg-teal-950/30",
    border: "border-teal-200 dark:border-teal-800/50",
    text: "text-teal-700 dark:text-teal-300",
    icon: "text-teal-500",
  },
  gym: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    border: "border-rose-200 dark:border-rose-800/50",
    text: "text-rose-700 dark:text-rose-300",
    icon: "text-rose-500",
  },
  sleep: {
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    border: "border-indigo-200 dark:border-indigo-800/50",
    text: "text-indigo-700 dark:text-indigo-300",
    icon: "text-indigo-500",
  },
};

// Block type icons (emoji)
export const ROUTINE_ICONS: Record<RoutineBlockType, string> = {
  "wake-up": "☀️",
  work: "💼",
  meal: "🍽️",
  editable: "✏️",
  rest: "☕",
  gym: "🏋️",
  sleep: "🌙",
};

// Default daily routine structure
export const DEFAULT_ROUTINE: Omit<RoutineBlock, "id">[] = [
  {
    title: "Wake Up",
    startTime: "08:00",
    endTime: "08:00",
    type: "wake-up",
    isLocked: true,
    isEditable: false,
    completed: false,
    notes: null,
    priority: false,
    color: ROUTINE_COLORS["wake-up"],
  },
  {
    title: "Tatkal Booking Work",
    startTime: "08:00",
    endTime: "12:00",
    type: "work",
    isLocked: true,
    isEditable: false,
    completed: false,
    notes: null,
    priority: false,
    color: ROUTINE_COLORS.work,
  },
  {
    title: "Fresh Up & Lunch",
    startTime: "12:00",
    endTime: "14:00",
    type: "meal",
    isLocked: true,
    isEditable: false,
    completed: false,
    notes: null,
    priority: false,
    color: ROUTINE_COLORS.meal,
  },
  {
    title: "Work Block 1",
    startTime: "14:00",
    endTime: "15:00",
    type: "editable",
    isLocked: false,
    isEditable: true,
    completed: false,
    notes: null,
    priority: false,
    color: ROUTINE_COLORS.editable,
  },
  {
    title: "Work Block 2",
    startTime: "15:00",
    endTime: "16:00",
    type: "editable",
    isLocked: false,
    isEditable: true,
    completed: false,
    notes: null,
    priority: false,
    color: ROUTINE_COLORS.editable,
  },
  {
    title: "Work Block 3",
    startTime: "16:00",
    endTime: "17:00",
    type: "editable",
    isLocked: false,
    isEditable: true,
    completed: false,
    notes: null,
    priority: false,
    color: ROUTINE_COLORS.editable,
  },
  {
    title: "Rest Hour",
    startTime: "17:00",
    endTime: "18:00",
    type: "rest",
    isLocked: false,
    isEditable: true,
    completed: false,
    notes: null,
    priority: false,
    color: ROUTINE_COLORS.rest,
  },
  {
    title: "Gym Time",
    startTime: "18:00",
    endTime: "19:30",
    type: "gym",
    isLocked: true,
    isEditable: false,
    completed: false,
    notes: null,
    priority: false,
    color: ROUTINE_COLORS.gym,
  },
  {
    title: "Dinner Time",
    startTime: "19:30",
    endTime: "20:30",
    type: "meal",
    isLocked: true,
    isEditable: false,
    completed: false,
    notes: null,
    priority: false,
    color: ROUTINE_COLORS.meal,
  },
  {
    title: "Evening Work",
    startTime: "20:30",
    endTime: "23:00",
    type: "editable",
    isLocked: false,
    isEditable: true,
    completed: false,
    notes: null,
    priority: false,
    color: ROUTINE_COLORS.editable,
  },
  {
    title: "Sleeping Time",
    startTime: "23:00",
    endTime: "08:00",
    type: "sleep",
    isLocked: true,
    isEditable: false,
    completed: false,
    notes: null,
    priority: false,
    color: ROUTINE_COLORS.sleep,
  },
];

// Form data for editing routine blocks
export interface RoutineBlockFormData {
  title: string;
  startTime: string;
  endTime: string;
  notes: string | null;
  priority: boolean;
}
