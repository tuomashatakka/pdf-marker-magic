
import { useAnnotations, Annotation } from "@/context/AnnotationContext";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, AlertCircle, Flag, HelpCircle, 
  Trash2, Calendar, X, MessageCircle 
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AnnotationSidebarProps {
  isOpen: boolean;
}

const AnnotationSidebar = ({ isOpen }: AnnotationSidebarProps) => {
  const { 
    annotations, 
    deleteAnnotation, 
    selectedAnnotation, 
    selectAnnotation,
    updateAnnotation
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

  const sortedAnnotations = [...annotations].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  if (!isOpen) return null;

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
                      Page {annotation.pageNumber}
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
                  {annotation.type === "text" ? (
                    <textarea
                      value={annotation.content}
                      onChange={(e) => 
                        handleCommentChange(annotation, e.target.value)
                      }
                      className="w-full text-sm resize-none border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px]"
                      placeholder="Add your comment here..."
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      Rectangle annotation
                    </div>
                  )}
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
