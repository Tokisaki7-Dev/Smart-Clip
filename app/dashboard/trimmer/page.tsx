import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TrimmerTool } from "@/components/tools/trimmer-tool";

export default function TrimmerPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        <TrimmerTool />
      </main>
    </div>
  );
}
