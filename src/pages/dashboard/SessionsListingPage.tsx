import { SessionsListing } from "@/modules/sessions/SessionsListing";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";

export const SessionsListingPage = () => {
  const { isCollapsed } = useSidebarStore();

  return (
    <div
      data-sidebar={isCollapsed ? "collapsed" : "expanded"} // ← pour centrer la pagination fixe
      className={`p-4 md:p-8 min-h-screen ${
        isCollapsed ? "pl-20" : "pl-64"
      } bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-300`}
    >
      <SessionsListing />
    </div>
  );
};
