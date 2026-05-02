import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { videoProcessor } from '@/lib/video-processor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;

    if (!file || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save uploaded file temporarily
    const tempInputPath = path.join(process.cwd(), 'temp', `input-${Date.now()}.mp4`);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(tempInputPath, buffer);

    try {
      // Process video
      const outputBuffer = await videoProcessor.trimVideo(tempInputPath, startTime, endTime);

      // Cleanup
      await unlink(tempInputPath);

      return new NextResponse(outputBuffer, {
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Disposition': 'attachment; filename="trimmed-video.mp4"'
        }
      });
    } catch (error) {
      await unlink(tempInputPath);
      throw error;
    }
  } catch (error) {
    console.error('Trim video error:', error);
    return NextResponse.json({ error: 'Failed to process video' }, { status: 500 });
  }
}
