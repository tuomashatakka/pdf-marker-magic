
import { useState } from "react";
import PDFViewer from "@/components/PDFViewer";
import AnnotationToolbar from "@/components/AnnotationToolbar";
import AnnotationSidebar from "@/components/AnnotationSidebar";
import { AnnotationProvider } from "@/context/AnnotationContext";
import Header from "@/components/Header";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AnnotationProvider>
      <div className="flex flex-col h-screen w-full bg-gray-50">
        <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Main content area */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <AnnotationToolbar />
            <div className="flex-1 relative overflow-auto">
              <PDFViewer />
            </div>
          </div>
          
          {/* Sidebar */}
          <AnnotationSidebar isOpen={sidebarOpen} />
        </div>
      </div>
    </AnnotationProvider>
  );
};

export default Index;
