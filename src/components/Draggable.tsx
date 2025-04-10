
import { useState, useRef, ReactNode } from "react";

interface DraggableProps {
  children: ReactNode;
  initialPosition: { x: number; y: number };
  onDragEnd: (x: number, y: number) => void;
  enabled: boolean;
}

const Draggable = ({ children, initialPosition, onDragEnd, enabled }: DraggableProps) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; lastX: number; lastY: number }>({
    startX: 0,
    startY: 0,
    lastX: initialPosition.x,
    lastY: initialPosition.y
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!enabled) return;
    e.stopPropagation();
    e.preventDefault();
    
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      lastX: position.x,
      lastY: position.y
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    const newX = dragRef.current.lastX + deltaX;
    const newY = dragRef.current.lastY + deltaY;

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    onDragEnd(position.x, position.y);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: enabled ? (isDragging ? "grabbing" : "grab") : "default",
        userSelect: "none",
        touchAction: "none",
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};

export default Draggable;
