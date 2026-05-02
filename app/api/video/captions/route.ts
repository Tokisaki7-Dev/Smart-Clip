import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { videoProcessor } from '@/lib/video-processor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const hardcode = formData.get('hardcode') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    // Save uploaded file temporarily
    const tempInputPath = path.join(process.cwd(), 'temp', `input-${Date.now()}.mp4`);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(tempInputPath, buffer);

    try {
      if (hardcode) {
        // Generate captions and hardcode them
        const srtContent = await videoProcessor.generateCaptions(tempInputPath);
        const srtPath = path.join(process.cwd(), 'temp', `captions-${Date.now()}.srt`);
        await writeFile(srtPath, srtContent);

        const outputBuffer = await videoProcessor.hardcodeCaptions(tempInputPath, srtPath);

        // Cleanup
        await unlink(tempInputPath);
        await unlink(srtPath);

        return new NextResponse(outputBuffer, {
          headers: {
            'Content-Type': 'video/mp4',
            'Content-Disposition': 'attachment; filename="captioned-video.mp4"'
          }
        });
      } else {
        // Just return SRT file
        const srtContent = await videoProcessor.generateCaptions(tempInputPath);

        // Cleanup
        await unlink(tempInputPath);

        return new NextResponse(srtContent, {
          headers: {
            'Content-Type': 'text/plain',
            'Content-Disposition': 'attachment; filename="captions.srt"'
          }
        });
      }
    } catch (error) {
      await unlink(tempInputPath);
      throw error;
    }
  } catch (error) {
    console.error('Captions error:', error);
    return NextResponse.json({ error: 'Failed to process video' }, { status: 500 });
  }
}
