
import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { nanoid } from "nanoid";

// Define annotation types
export type AnnotationTool = "select" | "text" | "rectangle" | "none";

export type AnnotationColor = 
  | "red" 
  | "orange" 
  | "yellow" 
  | "green" 
  | "blue" 
  | "purple" 
  | "pink";

export interface Annotation {
  id: string;
  type: "text" | "rectangle";
  position: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  content: string;
  color: AnnotationColor;
  icon?: string;
  createdAt: Date;
  pageNumber: number;
  // For text annotations
  textContent?: string;
  textRange?: {
    startOffset: number;
    endOffset: number;
  };
}

interface AnnotationContextType {
  annotations: Annotation[];
  activeTool: AnnotationTool;
  activeColor: AnnotationColor;
  activeIcon: string;
  zoom: number;
  selectedAnnotation: Annotation | null;
  addAnnotation: (annotation: Omit<Annotation, "id" | "createdAt" | "icon">) => void;
  updateAnnotation: (id: string, data: Partial<Annotation>) => void;
  deleteAnnotation: (id: string) => void;
  setActiveTool: (tool: AnnotationTool) => void;
  setActiveColor: (color: AnnotationColor) => void;
  setActiveIcon: (icon: string) => void;
  setZoom: (zoom: number) => void;
  selectAnnotation: (annotation: Annotation | null) => void;
}

const AnnotationContext = createContext<AnnotationContextType | undefined>(undefined);

export const useAnnotations = () => {
  const context = useContext(AnnotationContext);
  if (!context) {
    throw new Error("useAnnotations must be used within an AnnotationProvider");
  }
  return context;
};

export const AnnotationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeTool, setActiveTool] = useState<AnnotationTool>("select");
  const [activeColor, setActiveColor] = useState<AnnotationColor>("red");
  const [activeIcon, setActiveIcon] = useState<string>("MessageSquare");
  const [zoom, setZoom] = useState<number>(100);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);

  const addAnnotation = useCallback((annotationData: Omit<Annotation, "id" | "createdAt" | "icon">) => {
    const newAnnotation: Annotation = {
      ...annotationData,
      id: nanoid(),
      createdAt: new Date(),
      icon: activeIcon
    };
    setAnnotations((prev) => [...prev, newAnnotation]);
  }, [activeIcon]);

  const updateAnnotation = useCallback((id: string, data: Partial<Annotation>) => {
    setAnnotations((prev) =>
      prev.map((anno) => (anno.id === id ? { ...anno, ...data } : anno))
    );
    
    // Also update the selected annotation if it's the one being modified
    setSelectedAnnotation(current => {
      if (current?.id === id) {
        return { ...current, ...data };
      }
      return current;
    });
  }, []);

  const deleteAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((anno) => anno.id !== id));
    
    // Deselect if the deleted annotation was selected
    setSelectedAnnotation(current => current?.id === id ? null : current);
  }, []);

  const selectAnnotation = useCallback((annotation: Annotation | null) => {
    setSelectedAnnotation(annotation);
  }, []);

  return (
    <AnnotationContext.Provider
      value={{
        annotations,
        activeTool,
        activeColor,
        activeIcon,
        zoom,
        selectedAnnotation,
        addAnnotation,
        updateAnnotation,
        deleteAnnotation,
        setActiveTool,
        setActiveColor,
        setActiveIcon,
        setZoom,
        selectAnnotation,
      }}
    >
      {children}
    </AnnotationContext.Provider>
  );
};
