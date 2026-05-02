import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ConverterTool } from "@/components/tools/converter-tool";

export default function ConverterPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        <ConverterTool />
      </main>
    </div>
  );
}
