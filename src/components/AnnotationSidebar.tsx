
import { useAnnotations, Annotation, AnnotationColor } from "@/context/AnnotationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, AlertCircle, Flag, HelpCircle, 
  Trash2, Calendar, X, MessageCircle,
  Move
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { Label } from "@/components/ui/label";

interface AnnotationSidebarProps {
  isOpen: boolean;
}

const AnnotationSidebar = ({ isOpen }: AnnotationSidebarProps) => {
  const { 
    annotations, 
    deleteAnnotation, 
    selectedAnnotation, 
    selectAnnotation,
    updateAnnotation,
    activeColor,
    activeIcon
  } = useAnnotations();

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "MessageSquare":
        return <MessageSquare className="h-4 w-4" />;
      case "AlertCircle":
        return <AlertCircle className="h-4 w-4" />;
      case "Flag":
        return <Flag className="h-4 w-4" />;
      case "HelpCircle":
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const handleCommentChange = (annotation: Annotation, content: string) => {
    updateAnnotation(annotation.id, { content });
  };

  const handleAnnotationPropertyChange = (annotation: Annotation, property: string, value: any) => {
    if (property.startsWith("position.")) {
      const positionProp = property.split(".")[1];
      updateAnnotation(annotation.id, { 
        position: { 
          ...annotation.position,
          [positionProp]: parseFloat(value)
        }
      });
    } else {
      updateAnnotation(annotation.id, { [property]: value });
    }
  };

  const sortedAnnotations = [...annotations].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  if (!isOpen) return null;

  const colorOptions: { name: AnnotationColor; label: string }[] = [
    { name: "red", label: "Red" },
    { name: "orange", label: "Orange" },
    { name: "yellow", label: "Yellow" },
    { name: "green", label: "Green" },
    { name: "blue", label: "Blue" },
    { name: "purple", label: "Purple" },
    { name: "pink", label: "Pink" },
  ];

  const iconOptions = [
    { id: "MessageSquare", icon: MessageSquare },
    { id: "AlertCircle", icon: AlertCircle },
    { id: "Flag", icon: Flag },
    { id: "HelpCircle", icon: HelpCircle },
  ];

  return (
    <div className="w-72 border-l bg-white shadow-sm overflow-hidden animate-fade-in flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-medium text-lg">Annotations</h2>
        <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
          {annotations.length}
        </span>
      </div>

      {annotations.length === 0 ? (
        <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center flex-1">
          <MessageSquare className="h-8 w-8 mb-2 text-gray-400" />
          <p className="font-medium">No annotations yet</p>
          <p className="text-sm">Use the toolbar to add annotations</p>
        </div>
      ) : (
        <div className="overflow-y-auto flex-1 p-4">
          <div className="space-y-4">
            {sortedAnnotations.map((annotation) => (
              <div
                key={annotation.id}
                className={cn(
                  "border rounded-md overflow-hidden animate-scale-in",
                  selectedAnnotation?.id === annotation.id ? 
                    "ring-2 ring-primary" : ""
                )}
                onClick={() => selectAnnotation(annotation)}
              >
                <div className="flex items-center justify-between p-3 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `var(--annotation-${annotation.color})` }}
                    >
                      {getIconComponent(annotation.icon || "MessageSquare")}
                    </div>
                    <span className="text-sm font-medium">
                      Page {annotation.pageNumber} - {annotation.type}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full hover:bg-red-50 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAnnotation(annotation.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-3 bg-white">
                  {/* Comment input for all annotation types */}
                  <textarea
                    value={annotation.content}
                    onChange={(e) => 
                      handleCommentChange(annotation, e.target.value)
                    }
                    className="w-full text-sm resize-none border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px]"
                    placeholder="Add your comment here..."
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  <Accordion type="single" collapsible className="mt-3 w-full">
                    <AccordionItem value="appearance">
                      <AccordionTrigger className="py-2 text-sm">
                        Appearance
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {/* Color selector */}
                          <div className="flex items-center gap-1">
                            <Label className="text-xs w-16">Color:</Label>
                            <div className="flex gap-1 flex-wrap">
                              {colorOptions.map((color) => (
                                <div
                                  key={color.name}
                                  className={cn(
                                    "w-4 h-4 rounded-full cursor-pointer",
                                    annotation.color === color.name && "ring-2 ring-offset-1"
                                  )}
                                  style={{ backgroundColor: `var(--annotation-${color.name})` }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAnnotationPropertyChange(annotation, "color", color.name);
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          
                          {/* Icon selector */}
                          <div className="flex items-center gap-1">
                            <Label className="text-xs w-16">Icon:</Label>
                            <div className="flex gap-1">
                              {iconOptions.map((iconOption) => (
                                <div
                                  key={iconOption.id}
                                  className={cn(
                                    "w-6 h-6 rounded cursor-pointer flex items-center justify-center border",
                                    annotation.icon === iconOption.id && "bg-primary/10 border-primary"
                                  )}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAnnotationPropertyChange(annotation, "icon", iconOption.id);
                                  }}
                                >
                                  <iconOption.icon className="h-4 w-4" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Position and size controls for rectangle annotations */}
                    {annotation.type === "rectangle" && (
                      <AccordionItem value="position">
                        <AccordionTrigger className="py-2 text-sm">
                          Position & Size
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs">X:</Label>
                              <Input
                                type="number"
                                value={Math.round(annotation.position.x)}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => 
                                  handleAnnotationPropertyChange(annotation, "position.x", e.target.value)
                                }
                                className="h-7 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Y:</Label>
                              <Input
                                type="number"
                                value={Math.round(annotation.position.y)}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => 
                                  handleAnnotationPropertyChange(annotation, "position.y", e.target.value)
                                }
                                className="h-7 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Width:</Label>
                              <Input
                                type="number"
                                value={Math.round(annotation.position.width || 0)}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => 
                                  handleAnnotationPropertyChange(annotation, "position.width", e.target.value)
                                }
                                className="h-7 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Height:</Label>
                              <Input
                                type="number"
                                value={Math.round(annotation.position.height || 0)}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => 
                                  handleAnnotationPropertyChange(annotation, "position.height", e.target.value)
                                }
                                className="h-7 text-xs"
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                    
                    {/* Text content for text annotations */}
                    {annotation.type === "text" && annotation.textContent && (
                      <AccordionItem value="text">
                        <AccordionTrigger className="py-2 text-sm">
                          Selected Text
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="p-2 bg-gray-50 rounded text-xs italic">
                            "{annotation.textContent}"
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </div>
                
                <div className="flex items-center text-xs text-gray-500 px-3 py-2 bg-gray-50">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(annotation.createdAt, "MMM d, yyyy h:mm a")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnotationSidebar;
