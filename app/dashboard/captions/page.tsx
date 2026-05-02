import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { CaptionsTool } from "@/components/tools/captions-tool";

export default function CaptionsPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        <CaptionsTool />
      </main>
    </div>
  );
}
