import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const TEMP_DIR = "/tmp/smartclip";
  let totalSize = 0;

  function getDirSize(dirPath: string) {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) getDirSize(filePath);
      else totalSize += stats.size;
    });
  }

  getDirSize(TEMP_DIR);
  const limit = 10 * 1024 * 1024 * 1024; // 10GB de limite simulado para o SaaS
  return NextResponse.json({ used: totalSize, limit, percentage: (totalSize / limit) * 100 });
}