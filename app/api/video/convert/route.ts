import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { videoProcessor } from '@/lib/video-processor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const format = formData.get('format') as string;

    if (!file || !format) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save uploaded file temporarily
    const tempInputPath = path.join(process.cwd(), 'temp', `input-${Date.now()}.mp4`);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(tempInputPath, buffer);

    try {
      // Process video
      const outputBuffer = await videoProcessor.convertVideo(tempInputPath, format);

      // Cleanup
      await unlink(tempInputPath);

      const mimeTypes: Record<string, string> = {
        mp4: 'video/mp4',
        mov: 'video/quicktime',
        webm: 'video/webm',
        avi: 'video/x-msvideo',
        mkv: 'video/x-matroska'
      };

      return new NextResponse(outputBuffer, {
        headers: {
          'Content-Type': mimeTypes[format.toLowerCase()] || 'application/octet-stream',
          'Content-Disposition': `attachment; filename="converted-video.${format.toLowerCase()}"`
        }
      });
    } catch (error) {
      await unlink(tempInputPath);
      throw error;
    }
  } catch (error) {
    console.error('Convert video error:', error);
    return NextResponse.json({ error: 'Failed to process video' }, { status: 500 });
  }
}
