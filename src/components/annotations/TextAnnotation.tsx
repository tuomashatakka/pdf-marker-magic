
import { useAnnotations, Annotation } from "@/context/AnnotationContext";
import { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, AlertCircle, Flag, HelpCircle, MessageCircle, GripVertical 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Draggable from "@/components/Draggable";

interface TextAnnotationProps {
  annotation: Annotation;
}

const TextAnnotation = ({ annotation }: TextAnnotationProps) => {
  const { selectedAnnotation, selectAnnotation, updateAnnotation } = useAnnotations();
  const isSelected = selectedAnnotation?.id === annotation.id;

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "MessageSquare":
        return <MessageSquare className="h-4 w-4 text-white" />;
      case "AlertCircle":
        return <AlertCircle className="h-4 w-4 text-white" />;
      case "Flag":
        return <Flag className="h-4 w-4 text-white" />;
      case "HelpCircle":
        return <HelpCircle className="h-4 w-4 text-white" />;
      default:
        return <MessageCircle className="h-4 w-4 text-white" />;
    }
  };

  const handleDragEnd = (x: number, y: number) => {
    updateAnnotation(annotation.id, {
      position: { ...annotation.position, x, y }
    });
  };

  return (
    <Draggable
      initialPosition={{ x: annotation.position.x, y: annotation.position.y }}
      onDragEnd={handleDragEnd}
      enabled={true}
    >
      <div 
        className={cn(
          "absolute flex items-start group",
          isSelected && "z-10"
        )}
        onClick={(e) => {
          e.stopPropagation();
          selectAnnotation(annotation);
          
          // If this is a text annotation with a range, try to highlight it
          if (annotation.textRange && annotation.textContent) {
            // This is a simplified approach - a real implementation would need to find the exact elements
            const selection = window.getSelection();
            if (selection) {
              selection.removeAllRanges();
              // We'd need more complex logic to find the exact range
            }
          }
        }}
      >
        <div 
          className={cn(
            "flex items-center justify-center rounded-full w-8 h-8 shadow cursor-grab",
            isSelected ? "ring-2 ring-white" : ""
          )}
          style={{ backgroundColor: `var(--annotation-${annotation.color})` }}
        >
          {getIconComponent(annotation.icon || "MessageCircle")}
        </div>
        
        {isSelected && (
          <div className="ml-2 p-2 bg-white rounded shadow-lg text-xs">
            <p className="text-gray-600 font-medium">
              {annotation.content || "Add your comment here..."}
            </p>
            {annotation.textContent && (
              <div className="mt-2 p-1 bg-gray-100 rounded text-xs italic">
                "{annotation.textContent}"
              </div>
            )}
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default TextAnnotation;
