"use client";
import React, { useEffect, useState } from 'react';
import { Database } from 'lucide-react';

export function DiskUsageCounter() {
  const [usage, setUsage] = useState({ used: 0, limit: 1, percentage: 0 });

  const fetchUsage = async () => {
    const res = await fetch('/api/admin/disk-usage').then(r => r.json());
    setUsage(res);
  };

  useEffect(() => {
    fetchUsage();
    const interval = setInterval(fetchUsage, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-2 space-y-2">
      <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase font-bold">
        <span className="flex items-center gap-1"><Database size={10} /> Disco Temp</span>
        <span>{(usage.used / 1073741824).toFixed(1)}GB</span>
      </div>
      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${usage.percentage > 80 ? 'bg-red-500' : 'bg-blue-500'}`} 
          style={{ width: `${usage.percentage}%` }} 
        />
      </div>
    </div>
  );
}