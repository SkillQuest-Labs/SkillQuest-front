import { CalendarWorkSession } from "@/modules/sessions/CalendarWorkSession";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";

export const WorkSession = () => {
  const { isCollapsed } = useSidebarStore();

  return (
    <div
      className={`p-4 md:p-8 min-h-screen h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-300 ${
        isCollapsed ? "pl-20" : "pl-64"
      } flex flex-col min-h-0`}
    >
      <CalendarWorkSession />
    </div>
  );
};
