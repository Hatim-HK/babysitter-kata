import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TimePicker = ({ value, onChange, placeholder }: TimePickerProps) => {
  const [open, setOpen] = useState(false);

  // Generate time options for babysitting hours (5PM to 4AM)
  const generateTimeOptions = () => {
    const options = [];
    
    // Evening hours (5PM - 11PM)
    for (let hour = 17; hour <= 23; hour++) {
      const displayHour = hour > 12 ? hour - 12 : hour;
      const period = 'PM';
      options.push({
        value: `${displayHour}:00 ${period}`,
        display: `${displayHour}:00 ${period}`,
        sortOrder: hour
      });
      options.push({
        value: `${displayHour}:30 ${period}`,
        display: `${displayHour}:30 ${period}`,
        sortOrder: hour + 0.5
      });
    }
    
    // Midnight and early morning hours (12AM - 4AM, excluding 4:30AM)
    for (let hour = 0; hour <= 4; hour++) {
      const displayHour = hour === 0 ? 12 : hour;
      const period = 'AM';
      options.push({
        value: `${displayHour}:00 ${period}`,
        display: `${displayHour}:00 ${period}`,
        sortOrder: hour + 24
      });
      // Skip 4:30 AM
      if (hour < 4) {
        options.push({
          value: `${displayHour}:30 ${period}`,
          display: `${displayHour}:30 ${period}`,
          sortOrder: hour + 24.5
        });
      }
    }
    
    return options.sort((a, b) => a.sortOrder - b.sortOrder);
  };

  const timeOptions = generateTimeOptions();

  const handleTimeSelect = (timeValue: string) => {
    onChange(timeValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal pl-10 pr-4 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-colors",
            !value && "text-white/60"
          )}
        >
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <span className="flex-1">{value || placeholder || "Select time"}</span>
          <ChevronDown className="h-4 w-4 text-white/60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-slate-800 border-slate-600" align="start">
        <div className="max-h-64 overflow-y-auto">
          <div className="p-2">
            <div className="text-sm font-medium text-white mb-2 px-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-400" />
              Select Time
            </div>
            <div className="space-y-1">
              {timeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTimeSelect(option.value)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm rounded-md hover:bg-slate-700 transition-colors text-white",
                    value === option.value && "bg-purple-600 text-white font-medium"
                  )}
                >
                  {option.display}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimePicker;