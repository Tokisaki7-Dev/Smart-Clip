import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { CompressorTool } from "@/components/tools/compressor-tool";

export default function CompressorPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        <CompressorTool />
      </main>
    </div>
  );
}
