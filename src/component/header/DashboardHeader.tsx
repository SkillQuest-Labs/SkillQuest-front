import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";

export const DashboardHeader = () => {
  const [hoveringHeader, setHoveringHeader] = useState(false);
  const [hoveringTrigger, setHoveringTrigger] = useState(false);
  const { isCollapsed: sidebarCollapse } = useSidebarStore();

  const shouldShow = hoveringHeader || hoveringTrigger;

  return (
    <>
      <div
        onMouseEnter={() => setHoveringTrigger(true)}
        onMouseLeave={() => setHoveringTrigger(false)}
        className={`fixed top-0 z-40 h-20 ${
          sidebarCollapse ? "left-20 w-[calc(100%-5rem)]" : "left-[260px] w-[calc(100%-260px)]"
        }`}
      />
      <header
        onMouseEnter={() => setHoveringHeader(true)}
        onMouseLeave={() => setHoveringHeader(false)}
        className={`fixed top-0 z-50 transition-all duration-300 ease-in-out overflow-hidden ${
          sidebarCollapse ? "left-20 w-[calc(100%-5rem)]" : "left-[260px] w-[calc(100%-260px)]"
        } ${shouldShow ? "h-16 opacity-100" : "h-0 opacity-0"}`}
      >
        <nav className="flex justify-end items-center gap-4 px-6 py-4 h-full">
          <Button
            variant="ghost"
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-200"
          >
            <Pencil size={18} color="white" />
            Edit Dashboard
          </Button>
        </nav>
      </header>
    </>
  );
};
