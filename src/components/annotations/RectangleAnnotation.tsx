
import { useAnnotations, Annotation } from "@/context/AnnotationContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Draggable from "@/components/Draggable";
import ResizeHandles from "@/components/ResizeHandles";

interface RectangleAnnotationProps {
  annotation: Annotation;
}

const RectangleAnnotation = ({ annotation }: RectangleAnnotationProps) => {
  const { selectedAnnotation, selectAnnotation, updateAnnotation } = useAnnotations();
  const isSelected = selectedAnnotation?.id === annotation.id;

  const handleDragEnd = (x: number, y: number) => {
    updateAnnotation(annotation.id, {
      position: { 
        ...annotation.position, 
        x, 
        y 
      }
    });
  };

  const handleResize = (direction: string, movement: { x: number, y: number }) => {
    if (!annotation.position.width || !annotation.position.height) return;

    let newWidth = annotation.position.width;
    let newHeight = annotation.position.height;
    let newX = annotation.position.x;
    let newY = annotation.position.y;

    // Update width/height/position based on resize direction
    switch (direction) {
      case "top":
        newHeight -= movement.y;
        newY += movement.y;
        break;
      case "right":
        newWidth += movement.x;
        break;
      case "bottom":
        newHeight += movement.y;
        break;
      case "left":
        newWidth -= movement.x;
        newX += movement.x;
        break;
      case "top-left":
        newWidth -= movement.x;
        newHeight -= movement.y;
        newX += movement.x;
        newY += movement.y;
        break;
      case "top-right":
        newWidth += movement.x;
        newHeight -= movement.y;
        newY += movement.y;
        break;
      case "bottom-right":
        newWidth += movement.x;
        newHeight += movement.y;
        break;
      case "bottom-left":
        newWidth -= movement.x;
        newHeight += movement.y;
        newX += movement.x;
        break;
    }

    // Ensure minimum size
    const minSize = 20;
    if (newWidth < minSize || newHeight < minSize) return;

    updateAnnotation(annotation.id, {
      position: {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      }
    });
  };

  return (
    <Draggable
      initialPosition={{ x: annotation.position.x, y: annotation.position.y }}
      onDragEnd={handleDragEnd}
      enabled={true}
    >
      <div 
        className="absolute"
        onClick={(e) => {
          e.stopPropagation();
          selectAnnotation(annotation);
        }}
        style={{
          width: annotation.position.width,
          height: annotation.position.height
        }}
      >
        <div 
          className={cn(
            "w-full h-full border-2",
            isSelected ? "ring-2 ring-white" : ""
          )}
          style={{ 
            backgroundColor: `var(--annotation-${annotation.color}30)`, /* 30 for 30% opacity */
            borderColor: `var(--annotation-${annotation.color})`,
          }}
        />

        {/* Resize handles shown only when selected */}
        {isSelected && (
          <ResizeHandles onResize={handleResize} />
        )}
      </div>
    </Draggable>
  );
};

export default RectangleAnnotation;
