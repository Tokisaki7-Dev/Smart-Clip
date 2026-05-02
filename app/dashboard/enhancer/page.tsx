import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { EnhancerTool } from "@/components/tools/enhancer-tool";

export default function EnhancerPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        <EnhancerTool />
      </main>
    </div>
  );
}
