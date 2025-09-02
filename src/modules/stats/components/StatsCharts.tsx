import { TabPanel } from "./tab-panel/TabPanel";
import { chartTabs } from "./tab-panel/ChartTabs.const";
import { clsx } from "clsx";

type StatsChartsProps = {
  className?: string;
  defaultActiveTab?: string;
};

export const StatsCharts = ({ className, defaultActiveTab = "skill-experience" }: StatsChartsProps) => {
  return (
    <TabPanel
      tabs={chartTabs}
      defaultActiveTab={defaultActiveTab}
      variant="default"
      className={clsx("w-full", className)}
    />
  );
};
