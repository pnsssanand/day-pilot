import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  ShoppingBag,
  Plus,
  Dumbbell,
  Flame,
  Loader2,
  Sparkles,
  Sun,
  Coffee,
  Moon,
} from "lucide-react";
import { useDailyMenu, useShoppingReminder } from "@/hooks/useDailyMenu";
import { DailyMenuItem, DailyMenuFormData } from "@/types/nutrition";
import { FoodItemCard } from "@/components/FoodItemCard";
import { FoodItemModal } from "@/components/FoodItemModal";
import { ShoppingReminderList } from "@/components/ShoppingReminderList";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Period section for grouping food items
const PeriodSection = ({
  title,
  icon: Icon,
  iconColor,
  items,
  onEdit,
  onDelete,
}: {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  items: DailyMenuItem[];
  onEdit: (item: DailyMenuItem) => void;
  onDelete: (itemId: string) => Promise<void>;
}) => {
  if (items.length === 0) return null;

  const totalProtein = items.reduce((sum, item) => sum + item.totalProtein, 0);
  const totalCalories = items.reduce((sum, item) => sum + item.totalCalories, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-lg", iconColor)}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-medium text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground">
            ({items.length} items)
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <Dumbbell className="w-3 h-3" />
            {Math.round(totalProtein)}g
          </span>
          <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
            <Flame className="w-3 h-3" />
            {Math.round(totalCalories)}
          </span>
        </div>
      </div>
      <div className="space-y-2 ml-6 pl-4 border-l-2 border-border/50">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <FoodItemCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Food = () => {
  const [activeTab, setActiveTab] = useState<"menu" | "shopping">("menu");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DailyMenuItem | null>(null);

  // Daily menu hook
  const {
    menuItems,
    loading: menuLoading,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    dailyTotals,
    groupedItems,
  } = useDailyMenu();

  // Shopping reminder hook
  const {
    items: shoppingItems,
    loading: shoppingLoading,
    stats: shoppingStats,
    addItem: addShoppingItem,
    updateItem: updateShoppingItem,
    toggleNeedToBuy,
    deleteItem: deleteShoppingItem,
    clearCompleted,
  } = useShoppingReminder();

  const handleEdit = (item: DailyMenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleSave = async (data: DailyMenuFormData) => {
    if (editingItem) {
      await updateMenuItem(editingItem.id, data);
    } else {
      await addMenuItem(data);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <UtensilsCrossed className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Nutrition</h1>
              <p className="text-sm text-muted-foreground">
                Your daily protein & meal planner
              </p>
            </div>
          </div>
        </motion.section>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "menu" | "shopping")}>
          <TabsList className="w-full h-12 bg-muted/50 p-1 rounded-xl mb-6">
            <TabsTrigger
              value="menu"
              className="flex-1 h-full rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <UtensilsCrossed className="w-4 h-4" />
              Daily Menu
            </TabsTrigger>
            <TabsTrigger
              value="shopping"
              className="flex-1 h-full rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Shopping List
              {shoppingStats.needToBuy > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                  {shoppingStats.needToBuy}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Daily Menu Tab */}
          <TabsContent value="menu" className="mt-0 space-y-6">
            {/* Daily Totals Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-orange-500/10 border border-emerald-500/20 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Today's Nutrition
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                        <Dumbbell className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          {dailyTotals.totalProtein}g
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">
                          protein
                        </span>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                        <Flame className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {dailyTotals.totalCalories}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">
                          kcal
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {dailyTotals.totalProtein >= 100 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Goal Hit!
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Protein goal progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Protein Goal (100g)</span>
                  <span>{Math.min(100, Math.round((dailyTotals.totalProtein / 100) * 100))}%</span>
                </div>
                <div className="h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (dailyTotals.totalProtein / 100) * 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Add Button */}
            <div className="flex justify-end">
              <Button onClick={handleAdd} className="gap-2 rounded-xl shadow-md">
                <Plus className="w-4 h-4" />
                Add Food Item
              </Button>
            </div>

            {/* Loading State */}
            {menuLoading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading your menu...</p>
              </div>
            )}

            {/* Empty State */}
            {!menuLoading && menuItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-orange-100 dark:from-emerald-900/30 dark:to-orange-900/30 flex items-center justify-center mb-6">
                  <UtensilsCrossed className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Start Your Daily Menu
                </h3>
                <p className="text-muted-foreground mb-6 max-w-xs">
                  Add your regular meals and the app will calculate protein & calories automatically
                </p>
                <Button onClick={handleAdd} className="gap-2 rounded-xl">
                  <Plus className="w-4 h-4" />
                  Add First Food Item
                </Button>
              </motion.div>
            )}

            {/* Food Items by Period */}
            {!menuLoading && menuItems.length > 0 && (
              <div className="space-y-6">
                <PeriodSection
                  title="Morning"
                  icon={Coffee}
                  iconColor="bg-amber-100 dark:bg-amber-900/30 text-amber-500"
                  items={groupedItems.morning}
                  onEdit={handleEdit}
                  onDelete={deleteMenuItem}
                />
                <PeriodSection
                  title="Afternoon"
                  icon={Sun}
                  iconColor="bg-orange-100 dark:bg-orange-900/30 text-orange-500"
                  items={groupedItems.afternoon}
                  onEdit={handleEdit}
                  onDelete={deleteMenuItem}
                />
                <PeriodSection
                  title="Evening"
                  icon={Moon}
                  iconColor="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500"
                  items={groupedItems.evening}
                  onEdit={handleEdit}
                  onDelete={deleteMenuItem}
                />
              </div>
            )}

            {/* Info Card */}
            {!menuLoading && menuItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center"
              >
                <p className="text-sm text-muted-foreground">
                  ✨ Your daily menu repeats automatically every day.
                  <br />
                  Edit any item to update your routine.
                </p>
              </motion.div>
            )}
          </TabsContent>

          {/* Shopping List Tab */}
          <TabsContent value="shopping" className="mt-0">
            <ShoppingReminderList
              items={shoppingItems}
              loading={shoppingLoading}
              stats={shoppingStats}
              onAddItem={addShoppingItem}
              onUpdateItem={updateShoppingItem}
              onToggleNeedToBuy={toggleNeedToBuy}
              onDeleteItem={deleteShoppingItem}
              onClearCompleted={clearCompleted}
            />
          </TabsContent>
        </Tabs>

        {/* Food Item Modal */}
        <FoodItemModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
          item={editingItem}
        />
      </main>
    </div>
  );
};

export default Food;
