
import { useAnnotations, AnnotationColor } from "@/context/AnnotationContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  MousePointer,
  Type,
  Square,
  MessageSquare,
  AlertCircle,
  Flag,
  HelpCircle,
  ZoomIn,
  ZoomOut,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ColorPicker from "./ColorPicker";

const AnnotationToolbar = () => {
  const {
    activeTool,
    setActiveTool,
    activeColor,
    setActiveColor,
    activeIcon,
    setActiveIcon,
    zoom,
    setZoom,
  } = useAnnotations();

  const toolOptions = [
    { id: "select", icon: MousePointer, label: "Select" },
    { id: "text", icon: Type, label: "Text Annotation" },
    { id: "rectangle", icon: Square, label: "Rectangle Annotation" },
  ];

  const iconOptions = [
    { id: "MessageSquare", icon: MessageSquare },
    { id: "AlertCircle", icon: AlertCircle },
    { id: "Flag", icon: Flag },
    { id: "HelpCircle", icon: HelpCircle },
  ];

  const handleZoom = (direction: "in" | "out") => {
    const step = 25;
    const newZoom = direction === "in" ? zoom + step : Math.max(25, zoom - step);
    setZoom(newZoom);
  };

  return (
    <div className="h-16 flex items-center px-4 bg-white border-b animate-fade-in">
      <TooltipProvider>
        <div className="flex items-center gap-1 mr-8">
          {toolOptions.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === tool.id ? "default" : "outline"}
                  size="icon"
                  onClick={() => setActiveTool(tool.id as any)}
                  className="h-9 w-9"
                >
                  <tool.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="h-8 w-px bg-gray-200 mx-2" />

        <ColorPicker
          activeColor={activeColor}
          setActiveColor={setActiveColor}
        />

        <div className="h-8 w-px bg-gray-200 mx-2" />

        <div className="flex items-center gap-1 mr-4">
          {iconOptions.map((iconOption) => (
            <Tooltip key={iconOption.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setActiveIcon(iconOption.id)}
                  className={cn(
                    "h-9 w-9 relative",
                    activeIcon === iconOption.id && "border-primary border-2"
                  )}
                >
                  <iconOption.icon className="h-4 w-4" />
                  {activeIcon === iconOption.id && (
                    <span className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                      <Check className="h-2 w-2 text-white" />
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Icon: {iconOption.id}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="h-8 w-px bg-gray-200 mx-2" />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleZoom("out")}
            className="h-9 w-9"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium w-16 text-center">{zoom}%</span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleZoom("in")}
            className="h-9 w-9"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default AnnotationToolbar;
