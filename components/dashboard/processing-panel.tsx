"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProcessingJob {
  id: string;
  name: string;
  status: "pending" | "processing" | "completed" | "error";
  progress: number;
  eta?: number; // seconds remaining
  error?: string;
}

interface ProcessingPanelProps {
  jobs: ProcessingJob[];
  onJobClick?: (jobId: string) => void;
}

export function ProcessingPanel({ jobs, onJobClick }: ProcessingPanelProps) {
  const [localJobs, setLocalJobs] = useState(jobs);

  useEffect(() => {
    setLocalJobs(jobs);
  }, [jobs]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "text-blue-400";
      case "completed":
        return "text-green-400";
      case "error":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Loader className="w-4 h-4 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (localJobs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Processamentos em andamento</h3>

      <div className="space-y-3">
        {localJobs.map((job) => (
          <div
            key={job.id}
            onClick={() => onJobClick?.(job.id)}
            className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 flex-1">
                <div className={getStatusColor(job.status)}>
                  {getStatusIcon(job.status)}
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{job.name}</p>
                  <p className="text-xs text-slate-400">
                    {job.status === "processing" && `${job.progress}%${job.eta ? ` • ${Math.ceil(job.eta / 60)}m restantes` : ""}`}
                    {job.status === "completed" && "Concluído"}
                    {job.status === "error" && job.error}
                  </p>
                </div>
              </div>
            </div>

            {job.status === "processing" && (
              <Progress value={job.progress} className="h-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
