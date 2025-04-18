
import { useRef, useState, useEffect } from "react";
import { useAnnotations, Annotation, AnnotationColor } from "@/context/AnnotationContext";
import TextAnnotation from "./annotations/TextAnnotation";
import RectangleAnnotation from "./annotations/RectangleAnnotation";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useToast } from "@/hooks/use-toast";

// Set worker directly from the pdfjs-dist package
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer = () => {
  const { 
    annotations, 
    activeTool, 
    addAnnotation, 
    zoom,
    selectedAnnotation,
    selectAnnotation,
    updateAnnotation,
    activeColor
  } = useAnnotations();
  
  const { toast } = useToast();
  const viewerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentSelectionRange, setCurrentSelectionRange] = useState<Range | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfLoaded, setPdfLoaded] = useState<boolean>(false);
  
  // Using a different sample PDF that is more reliable
  const pdfSrc = "https://www.africau.edu/images/default/sample.pdf";
  
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPdfError(null);
    setPdfLoaded(true);
    toast({
      title: "PDF Loaded Successfully",
      description: `Loaded ${numPages} pages`,
    });
  }
  
  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF:", error);
    setPdfError("Failed to load PDF file. Please try again later.");
    setPdfLoaded(false);
    toast({
      title: "Error Loading PDF",
      description: "Could not load the PDF file. Please try again.",
      variant: "destructive",
    });
  }
  
  // Handle text selection for text annotations
  const handleTextSelection = (pageNumber: number) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || activeTool !== "text") return;
    
    const range = selection.getRangeAt(0);
    setCurrentSelectionRange(range);
    
    // Get position relative to the viewer
    if (!viewerRef.current) return;
    const rect = range.getBoundingClientRect();
    const viewerRect = viewerRef.current.getBoundingClientRect();
    
    const x = (rect.left - viewerRect.left) / (zoom / 100);
    const y = (rect.top - viewerRect.top) / (zoom / 100);
    
    const newAnnotation: Omit<Annotation, "id" | "createdAt" | "icon"> = {
      type: "text" as const,
      position: { 
        x, 
        y,
        width: (rect.width) / (zoom / 100),
        height: (rect.height) / (zoom / 100)
      },
      content: "Comment on: " + range.toString().substring(0, 50) + (range.toString().length > 50 ? "..." : ""),
      color: activeColor,
      pageNumber,
      textContent: range.toString(),
      textRange: {
        startOffset: range.startOffset,
        endOffset: range.endOffset
      }
    };
    
    addAnnotation(newAnnotation);
    window.getSelection()?.removeAllRanges();
  };
  
  const handleViewerClick = (e: React.MouseEvent, pageNumber: number) => {
    if (activeTool === "select" || activeTool === "none") {
      // In select mode, just deselect when clicking on the background
      selectAnnotation(null);
      return;
    }
    
    if (activeTool === "text") {
      return; // Text annotations are handled by handleTextSelection
    }
    
    if (!viewerRef.current || activeTool !== "rectangle") return;
    
    const rect = viewerRef.current.getBoundingClientRect();
    const pageContainer = (e.target as Element).closest('.react-pdf__Page');
    if (!pageContainer) return;
    
    const pageRect = pageContainer.getBoundingClientRect();
    
    // Calculate position within the current page
    const x = ((e.clientX - pageRect.left) / (zoom / 100));
    const y = ((e.clientY - pageRect.top) / (zoom / 100));
    
    addAnnotation({
      type: "rectangle",
      position: { x, y, width: 150, height: 100 },
      content: "",
      color: activeColor,
      pageNumber,
    });
  };
  
  // Function to highlight a text range when an annotation is selected
  useEffect(() => {
    if (selectedAnnotation?.type === "text" && selectedAnnotation.textRange) {
      // We'd need a more complex implementation to highlight the exact range
      // This is a simplified approach
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
    }
  }, [selectedAnnotation]);
  
  return (
    <div 
      ref={viewerRef}
      className="flex-1 overflow-auto bg-gray-100 p-4 min-h-0" 
    >
      <Document
        file={pdfSrc}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        className="flex flex-col items-center gap-5"
        loading={<div className="text-center py-10">Loading PDF...</div>}
        error={<div className="text-center py-10 text-red-500">{pdfError || "Failed to preview PDF"}</div>}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <div key={`page_${index + 1}`} className="relative" style={{ width: "100%" }}>
            <Page
              pageNumber={index + 1}
              scale={zoom / 100}
              className="shadow-md bg-white"
              onMouseUp={() => handleTextSelection(index + 1)}
              onClick={(e) => handleViewerClick(e, index + 1)}
              renderAnnotationLayer={false}
              renderTextLayer={true}
            />
            
            {/* Annotations for this page */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {annotations
                .filter(anno => anno.pageNumber === index + 1)
                .map(annotation => (
                  <div 
                    key={annotation.id} 
                    className="pointer-events-auto"
                    style={{ 
                      transform: `scale(${zoom / 100})`,
                      transformOrigin: '0 0',
                    }}
                  >
                    {annotation.type === "text" ? (
                      <TextAnnotation 
                        annotation={annotation} 
                      />
                    ) : (
                      <RectangleAnnotation 
                        annotation={annotation} 
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;
