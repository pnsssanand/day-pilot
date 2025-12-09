import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Plus,
  Trash2,
  ShoppingBag,
  Pencil,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  needToBuy: boolean;
}

interface ShoppingReminderListProps {
  items: ShoppingItem[];
  loading: boolean;
  stats: { needToBuy: number; bought: number; total: number };
  onAddItem: (name: string, quantity: string) => Promise<void>;
  onUpdateItem: (itemId: string, updates: { name?: string; quantity?: string }) => Promise<void>;
  onToggleNeedToBuy: (itemId: string, needToBuy: boolean) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  onClearCompleted: () => Promise<void>;
}

// Individual shopping item
const ShoppingReminderItem = ({
  item,
  onToggle,
  onUpdate,
  onDelete,
}: {
  item: ShoppingItem;
  onToggle: (needToBuy: boolean) => Promise<void>;
  onUpdate: (updates: { name?: string; quantity?: string }) => Promise<void>;
  onDelete: () => Promise<void>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editQuantity, setEditQuantity] = useState(item.quantity);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveEdit = async () => {
    if (editName.trim()) {
      await onUpdate({ name: editName.trim(), quantity: editQuantity.trim() });
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <motion.div
        layout
        className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-primary/20"
      >
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Item name"
          className="flex-1 h-9 rounded-lg text-sm"
          autoFocus
        />
        <Input
          value={editQuantity}
          onChange={(e) => setEditQuantity(e.target.value)}
          placeholder="Qty"
          className="w-20 h-9 rounded-lg text-sm"
        />
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveEdit}>
          <Check className="w-4 h-4 text-emerald-500" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsEditing(false)}>
          <X className="w-4 h-4 text-muted-foreground" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
        "bg-card border border-border/50",
        !item.needToBuy && "opacity-50 bg-muted/30"
      )}
    >
      {/* Checkbox */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggle(!item.needToBuy)}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
          item.needToBuy
            ? "border-muted-foreground/30 hover:border-primary"
            : "border-emerald-500 bg-emerald-500"
        )}
      >
        {!item.needToBuy && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </motion.button>

      {/* Item info */}
      <div className="flex-1 min-w-0">
        <span className={cn(
          "font-medium text-sm",
          !item.needToBuy && "line-through text-muted-foreground"
        )}>
          {item.name}
        </span>
        {item.quantity && (
          <span className="ml-2 text-xs text-muted-foreground">
            ({item.quantity})
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 rounded-lg"
          onClick={() => {
            setEditName(item.name);
            setEditQuantity(item.quantity);
            setIsEditing(true);
          }}
        >
          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 rounded-lg hover:text-destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
};

export const ShoppingReminderList = ({
  items,
  loading,
  stats,
  onAddItem,
  onUpdateItem,
  onToggleNeedToBuy,
  onDeleteItem,
  onClearCompleted,
}: ShoppingReminderListProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsAdding(true);
    try {
      await onAddItem(newName.trim(), newQuantity.trim());
      setNewName("");
      setNewQuantity("");
      setShowAddForm(false);
    } finally {
      setIsAdding(false);
    }
  };

  const handleClearCompleted = async () => {
    setIsClearing(true);
    try {
      await onClearCompleted();
    } finally {
      setIsClearing(false);
      setShowClearDialog(false);
    }
  };

  const needToBuyItems = items.filter((i) => i.needToBuy);
  const boughtItems = items.filter((i) => !i.needToBuy);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading shopping list...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Shopping Reminder</h3>
            <p className="text-sm text-muted-foreground">
              {stats.needToBuy} items to buy
              {stats.bought > 0 && ` · ${stats.bought} bought`}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          size="sm"
          className="gap-2 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="flex items-center gap-2 p-4 rounded-xl bg-muted/30 border border-dashed border-primary/30"
          >
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Item name (e.g., Eggs, Paneer)"
              className="flex-1 h-10 rounded-lg"
              autoFocus
            />
            <Input
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              placeholder="Qty (e.g., 30, 1kg)"
              className="w-28 h-10 rounded-lg"
            />
            <Button type="submit" size="sm" disabled={isAdding || !newName.trim()}>
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAddForm(false);
                setNewName("");
                setNewQuantity("");
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {items.length === 0 && !showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">No items yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add items you need to buy as reminders
          </p>
          <Button onClick={() => setShowAddForm(true)} className="gap-2 rounded-xl">
            <Plus className="w-4 h-4" />
            Add First Item
          </Button>
        </motion.div>
      )}

      {/* Need to Buy Section */}
      {needToBuyItems.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground px-1">
            Need to Buy ({needToBuyItems.length})
          </h4>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {needToBuyItems.map((item) => (
                <ShoppingReminderItem
                  key={item.id}
                  item={item}
                  onToggle={(needToBuy) => onToggleNeedToBuy(item.id, needToBuy)}
                  onUpdate={(updates) => onUpdateItem(item.id, updates)}
                  onDelete={() => onDeleteItem(item.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Bought Section */}
      {boughtItems.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-sm font-medium text-muted-foreground">
              Bought ({boughtItems.length})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-destructive"
              onClick={() => setShowClearDialog(true)}
            >
              Clear All
            </Button>
          </div>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {boughtItems.map((item) => (
                <ShoppingReminderItem
                  key={item.id}
                  item={item}
                  onToggle={(needToBuy) => onToggleNeedToBuy(item.id, needToBuy)}
                  onUpdate={(updates) => onUpdateItem(item.id, updates)}
                  onDelete={() => onDeleteItem(item.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Clear Completed Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear bought items?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all {boughtItems.length} bought items from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearCompleted}
              disabled={isClearing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isClearing ? "Clearing..." : "Clear All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
