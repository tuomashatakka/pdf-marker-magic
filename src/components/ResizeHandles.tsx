
import { useRef } from "react";

interface ResizeHandlesProps {
  onResize: (direction: string, movement: { x: number, y: number }) => void;
}

const ResizeHandles = ({ onResize }: ResizeHandlesProps) => {
  const handleMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const movement = {
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY
      };
      
      onResize(direction, movement);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <>
      {/* Top */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-gray-400 rounded-full cursor-ns-resize"
        onMouseDown={(e) => handleMouseDown(e, 'top')}
      />
      
      {/* Right */}
      <div 
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-white border border-gray-400 rounded-full cursor-ew-resize"
        onMouseDown={(e) => handleMouseDown(e, 'right')}
      />
      
      {/* Bottom */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white border border-gray-400 rounded-full cursor-ns-resize"
        onMouseDown={(e) => handleMouseDown(e, 'bottom')}
      />
      
      {/* Left */}
      <div 
        className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-white border border-gray-400 rounded-full cursor-ew-resize"
        onMouseDown={(e) => handleMouseDown(e, 'left')}
      />
      
      {/* Top-left */}
      <div 
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-gray-400 rounded-full cursor-nwse-resize"
        onMouseDown={(e) => handleMouseDown(e, 'top-left')}
      />
      
      {/* Top-right */}
      <div 
        className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-gray-400 rounded-full cursor-nesw-resize"
        onMouseDown={(e) => handleMouseDown(e, 'top-right')}
      />
      
      {/* Bottom-right */}
      <div 
        className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white border border-gray-400 rounded-full cursor-nwse-resize"
        onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
      />
      
      {/* Bottom-left */}
      <div 
        className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white border border-gray-400 rounded-full cursor-nesw-resize"
        onMouseDown={(e) => handleMouseDown(e, 'bottom-left')}
      />
    </>
  );
};

export default ResizeHandles;
