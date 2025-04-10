
import { Button } from "@/components/ui/button";
import { PanelRightOpen, PanelRightClose } from "lucide-react";

interface HeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
  sidebarOpen: boolean;
}

const Header = ({ setSidebarOpen, sidebarOpen }: HeaderProps) => {
  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-white">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-900">PDF Marker Magic</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Hide annotations" : "Show annotations"}
        >
          {sidebarOpen ? (
            <PanelRightClose className="h-5 w-5" />
          ) : (
            <PanelRightOpen className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
