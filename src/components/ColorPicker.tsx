
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, CircleDot } from "lucide-react";
import { AnnotationColor } from "@/context/AnnotationContext";

interface ColorPickerProps {
  activeColor: AnnotationColor;
  setActiveColor: (color: AnnotationColor) => void;
}

const ColorPicker = ({ activeColor, setActiveColor }: ColorPickerProps) => {
  const [open, setOpen] = useState(false);

  const colorOptions: { name: AnnotationColor; label: string }[] = [
    { name: "red", label: "Red" },
    { name: "orange", label: "Orange" },
    { name: "yellow", label: "Yellow" },
    { name: "green", label: "Green" },
    { name: "blue", label: "Blue" },
    { name: "purple", label: "Purple" },
    { name: "pink", label: "Pink" },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          className="flex items-center gap-2 w-32"
        >
          <span 
            className="w-4 h-4 rounded-full" 
            style={{backgroundColor: `var(--annotation-${activeColor})`}}
          />
          <span className="capitalize flex-1 text-left">{activeColor}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-32">
        <div className="flex flex-col">
          {colorOptions.map((color) => (
            <Button
              key={color.name}
              variant="ghost"
              className="justify-start gap-2 rounded-none"
              onClick={() => {
                setActiveColor(color.name);
                setOpen(false);
              }}
            >
              <span 
                className="w-4 h-4 rounded-full" 
                style={{backgroundColor: `var(--annotation-${color.name})`}}
              />
              <span className="flex-1 text-left">{color.label}</span>
              {activeColor === color.name && <Check className="h-4 w-4" />}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
