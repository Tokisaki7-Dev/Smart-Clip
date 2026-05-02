import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { videoProcessor } from '@/lib/video-processor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const format = formData.get('format') as 'mp3' | 'wav';

    if (!file) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    // Save uploaded file temporarily
    const tempInputPath = path.join(process.cwd(), 'temp', `input-${Date.now()}.mp4`);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(tempInputPath, buffer);

    try {
      // Process video
      const outputBuffer = await videoProcessor.extractAudio(tempInputPath, format);

      // Cleanup
      await unlink(tempInputPath);

      const mimeTypes = {
        mp3: 'audio/mpeg',
        wav: 'audio/wav'
      };

      return new NextResponse(outputBuffer, {
        headers: {
          'Content-Type': mimeTypes[format],
          'Content-Disposition': `attachment; filename="extracted-audio.${format}"`
        }
      });
    } catch (error) {
      await unlink(tempInputPath);
      throw error;
    }
  } catch (error) {
    console.error('Extract audio error:', error);
    return NextResponse.json({ error: 'Failed to process video' }, { status: 500 });
  }
}
