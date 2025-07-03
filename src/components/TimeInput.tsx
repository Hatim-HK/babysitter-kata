import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Clock, Edit3 } from 'lucide-react';
import TimePicker from './TimePicker';

interface TimeInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TimeInput = ({ id, value, onChange, placeholder }: TimeInputProps) => {
  const [useManualInput, setUseManualInput] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow digits, colon, space, A, M, P (case insensitive)
    const cleanValue = inputValue.replace(/[^0-9: APMapm]/g, '');
    
    onChange(cleanValue);
  };

  const toggleInputMode = () => {
    setUseManualInput(!useManualInput);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {useManualInput ? (
            <div className="relative">
              <Input
                id={id}
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="pl-10 pr-3 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 transition-colors"
              />
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            </div>
          ) : (
            <TimePicker
              value={value}
              onChange={onChange}
              placeholder={placeholder}
            />
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleInputMode}
          className="ml-2 h-10 px-3 text-white/70 hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/40 transition-colors"
          title={useManualInput ? "Use time picker" : "Type manually"}
        >
          {useManualInput ? <Clock className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
        </Button>
      </div>
      {useManualInput && (
        <div className="text-xs text-white/60 bg-white/5 p-2 rounded border border-white/10">
          💡 Enter time in format: 5:00 PM or 12:30 AM
        </div>
      )}
    </div>
  );
};

export default TimeInput;