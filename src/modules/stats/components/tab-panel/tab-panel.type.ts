export type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
};

export type TabPanelProps = {
  tabs: TabItem[];
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
  variant?: "default" | "pills" | "underline";
};
