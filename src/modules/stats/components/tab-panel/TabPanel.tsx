import { cn } from "@/shared/utils/helpers";
import { useState } from "react";
import { Button } from "../../../../shared/components/ui/button";
import clsx from "clsx";
import type { TabItem, TabPanelProps } from "./tab-panel.type";

export const TabPanel = ({
  tabs,
  defaultActiveTab,
  onTabChange,
  className,
  tabsClassName,
  contentClassName,
  variant = "default",
}: TabPanelProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultActiveTab || tabs[0]?.id || "");

  const handleTabClick = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      onTabChange?.(tabId);
    }
  };

  const getTabStyles = (tab: TabItem, isActive: boolean) => {
    const baseStyles =
      "px-4 py-2 font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900";

    if (tab.disabled) {
      return cn(baseStyles, "text-gray-500 cursor-not-allowed opacity-50");
    }

    switch (variant) {
      case "pills":
        return cn(
          baseStyles,
          "rounded-full",
          isActive ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-slate-700",
        );
      case "underline":
        return cn(
          baseStyles,
          "border-b-2 rounded-none",
          isActive
            ? "border-blue-500 text-blue-400"
            : "border-transparent text-gray-400 hover:text-white hover:border-gray-600",
        );
      default:
        return cn(
          baseStyles,
          "rounded-lg",
          isActive ? "bg-slate-700 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-slate-800",
        );
    }
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      <div
        className={cn(
          "flex space-x-1 mb-4 flex-shrink-0",
          variant === "underline" ? "border-b border-slate-700" : "bg-slate-800 p-1 rounded-lg",
          tabsClassName,
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;

          return (
            <Button
              variant="ghost"
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={clsx(getTabStyles(tab, isActive), "cursor-pointer")}
              disabled={tab.disabled}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              <div className="flex items-center space-x-2">
                {Icon && <Icon className={cn("w-4 h-4", isActive ? "text-current" : "text-gray-500")} />}
                <span className="hidden sm:inline">{tab.label}</span>
              </div>
            </Button>
          );
        })}
      </div>

      <div
        className={cn("flex-1 min-h-0 transition-all duration-300 ease-in-out", contentClassName)}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        id={`tabpanel-${activeTab}`}
      >
        {activeTabContent}
      </div>
    </div>
  );
};
