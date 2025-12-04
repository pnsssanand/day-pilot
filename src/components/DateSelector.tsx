import { format, addDays, isToday, isTomorrow, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const dayAfter = addDays(today, 2);
  const selected = parseISO(selectedDate);

  const quickDates = [
    { date: today, label: "Today" },
    { date: tomorrow, label: "Tomorrow" },
    { date: dayAfter, label: format(dayAfter, "EEE") },
  ];

  const getDateLabel = () => {
    if (isToday(selected)) return "Today";
    if (isTomorrow(selected)) return "Tomorrow";
    return format(selected, "EEEE, MMMM d");
  };

  const navigateDate = (direction: number) => {
    const newDate = addDays(selected, direction);
    onDateChange(format(newDate, "yyyy-MM-dd"));
  };

  return (
    <div className="space-y-4">
      {/* Date navigation header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateDate(-1)}
          className="h-9 w-9"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">{getDateLabel()}</h2>
          <p className="text-sm text-muted-foreground">
            {format(selected, "MMMM d, yyyy")}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateDate(1)}
          className="h-9 w-9"
          aria-label="Next day"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Quick date buttons */}
      <div className="flex items-center gap-2">
        {quickDates.map(({ date, label }) => (
          <Button
            key={label}
            variant={format(date, "yyyy-MM-dd") === selectedDate ? "default" : "outline"}
            size="sm"
            onClick={() => onDateChange(format(date, "yyyy-MM-dd"))}
            className={cn(
              "flex-1",
              format(date, "yyyy-MM-dd") === selectedDate && "btn-primary"
            )}
          >
            {label}
          </Button>
        ))}

        {/* Calendar picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="px-3">
              <CalendarIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={(date) => date && onDateChange(format(date, "yyyy-MM-dd"))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
