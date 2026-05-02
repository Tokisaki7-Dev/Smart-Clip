import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AudioExtractorTool } from "@/components/tools/audio-extractor-tool";

export default function AudioPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        <AudioExtractorTool />
      </main>
    </div>
  );
}
