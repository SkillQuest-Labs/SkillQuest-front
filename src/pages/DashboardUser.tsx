import { Sidebar } from "@/component/sidebar/Sidebar";

export const DashboardUser = () => {
  return (
    <div>
      <Sidebar />
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold">Dashboard user</h1>
      </div>
    </div>
  );
};
