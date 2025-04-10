
import { useRef, useState, useEffect } from "react";
import { useAnnotations, Annotation } from "@/context/AnnotationContext";
import TextAnnotation from "./annotations/TextAnnotation";
import RectangleAnnotation from "./annotations/RectangleAnnotation";

const PDFViewer = () => {
  const { 
    annotations, 
    activeTool, 
    addAnnotation, 
    zoom,
    selectedAnnotation,
    selectAnnotation
  } = useAnnotations();
  const viewerRef = useRef<HTMLDivElement>(null);
  
  // For demo purposes, using a placeholder PDF page
  const [pageHeight, setPageHeight] = useState(842); // A4 in pixels
  const [pageWidth, setPageWidth] = useState(595); // A4 in pixels
  const [pagesCount] = useState(3); // Demo with 3 pages
  
  const handleViewerClick = (e: React.MouseEvent) => {
    if (activeTool === "select" || activeTool === "none") {
      // In select mode, just deselect when clicking on the background
      selectAnnotation(null);
      return;
    }
    
    if (!viewerRef.current) return;
    
    const rect = viewerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Get current page number based on y position
    const scaledPageHeight = (pageHeight * zoom) / 100;
    const pageNumber = Math.floor(y / (scaledPageHeight + 20)) + 1;
    
    // Calculate position within the current page
    const yInPage = y - ((pageNumber - 1) * (scaledPageHeight + 20));
    
    if (activeTool === "text") {
      addAnnotation({
        type: "text",
        position: { x, y: yInPage },
        content: "Add your comment here...",
        color: "red",
        pageNumber,
      });
    } else if (activeTool === "rectangle") {
      addAnnotation({
        type: "rectangle",
        position: { x, y: yInPage, width: 150, height: 100 },
        content: "",
        color: "blue",
        pageNumber,
      });
    }
  };

  return (
    <div 
      ref={viewerRef}
      className="flex-1 overflow-auto bg-gray-100 p-4 min-h-0" 
      onClick={handleViewerClick}
    >
      <div className="flex flex-col items-center gap-5">
        {Array.from({ length: pagesCount }).map((_, index) => (
          <div 
            key={index}
            className="relative bg-white shadow-md" 
            style={{
              width: (pageWidth * zoom) / 100,
              height: (pageHeight * zoom) / 100,
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              marginBottom: zoom > 100 ? ((zoom - 100) / 5) : 0
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-400 text-lg">
                PDF Page {index + 1}
              </p>
            </div>
            
            {/* Annotations for this page */}
            {annotations
              .filter(anno => anno.pageNumber === index + 1)
              .map(annotation => 
                annotation.type === "text" ? (
                  <TextAnnotation 
                    key={annotation.id} 
                    annotation={annotation} 
                  />
                ) : (
                  <RectangleAnnotation 
                    key={annotation.id} 
                    annotation={annotation} 
                  />
                )
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PDFViewer;
