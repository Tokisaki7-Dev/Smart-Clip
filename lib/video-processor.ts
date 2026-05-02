import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const execAsync = promisify(exec);

export class VideoProcessor {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(process.cwd(), 'temp');
  }

  private async ensureTempDir() {
    try {
      await fs.access(this.tempDir);
    } catch {
      await fs.mkdir(this.tempDir, { recursive: true });
    }
  }

  private async cleanupFile(filePath: string) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn(`Failed to cleanup ${filePath}:`, error);
    }
  }

  private timeToSeconds(timeStr: string): number {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  async trimVideo(inputPath: string, startTime: string, endTime: string): Promise<Buffer> {
    await this.ensureTempDir();
    const outputPath = path.join(this.tempDir, `trim-${uuidv4()}.mp4`);

    try {
      const startSeconds = this.timeToSeconds(startTime);
      const endSeconds = this.timeToSeconds(endTime);
      const duration = endSeconds - startSeconds;

      const command = `ffmpeg -i "${inputPath}" -ss ${startSeconds} -t ${duration} -c copy -avoid_negative_ts make_zero "${outputPath}"`;

      await execAsync(command);

      const outputBuffer = await fs.readFile(outputPath);
      await this.cleanupFile(outputPath);

      return outputBuffer;
    } catch (error) {
      await this.cleanupFile(outputPath);
      throw error;
    }
  }

  async compressVideo(inputPath: string, preset: 'whatsapp' | 'high-quality', crf: number): Promise<Buffer> {
    await this.ensureTempDir();
    const outputPath = path.join(this.tempDir, `compress-${uuidv4()}.mp4`);

    try {
      let presetOptions = '';

      if (preset === 'whatsapp') {
        presetOptions = `-vf scale=720:-2 -c:v libx264 -crf ${crf} -preset fast -c:a aac -b:a 128k`;
      } else {
        presetOptions = `-c:v libx264 -crf ${crf} -preset slow -c:a aac -b:a 192k`;
      }

      const command = `ffmpeg -i "${inputPath}" ${presetOptions} "${outputPath}"`;

      await execAsync(command);

      const outputBuffer = await fs.readFile(outputPath);
      await this.cleanupFile(outputPath);

      return outputBuffer;
    } catch (error) {
      await this.cleanupFile(outputPath);
      throw error;
    }
  }

  async convertVideo(inputPath: string, format: string): Promise<Buffer> {
    await this.ensureTempDir();
    const outputPath = path.join(this.tempDir, `convert-${uuidv4()}.${format.toLowerCase()}`);

    try {
      let codecOptions = '';

      switch (format.toLowerCase()) {
        case 'mp4':
          codecOptions = '-c:v libx264 -c:a aac';
          break;
        case 'webm':
          codecOptions = '-c:v libvpx-vp9 -c:a libopus';
          break;
        case 'avi':
          codecOptions = '-c:v libx264 -c:a mp3';
          break;
        case 'mov':
          codecOptions = '-c:v libx264 -c:a aac';
          break;
        case 'mkv':
          codecOptions = '-c:v libx264 -c:a aac';
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      const command = `ffmpeg -i "${inputPath}" ${codecOptions} "${outputPath}"`;

      await execAsync(command);

      const outputBuffer = await fs.readFile(outputPath);
      await this.cleanupFile(outputPath);

      return outputBuffer;
    } catch (error) {
      await this.cleanupFile(outputPath);
      throw error;
    }
  }

  async extractAudio(inputPath: string, format: 'mp3' | 'wav'): Promise<Buffer> {
    await this.ensureTempDir();
    const outputPath = path.join(this.tempDir, `audio-${uuidv4()}.${format}`);

    try {
      let codecOptions = '';

      if (format === 'mp3') {
        codecOptions = '-c:a libmp3lame -b:a 320k';
      } else {
        codecOptions = '-c:a pcm_s16le';
      }

      const command = `ffmpeg -i "${inputPath}" -vn ${codecOptions} "${outputPath}"`;

      await execAsync(command);

      const outputBuffer = await fs.readFile(outputPath);
      await this.cleanupFile(outputPath);

      return outputBuffer;
    } catch (error) {
      await this.cleanupFile(outputPath);
      throw error;
    }
  }

  async enhanceVideo(inputPath: string, options: {
    sharpness: number;
    denoise: number;
    saturation: number;
    contrast: number;
  }): Promise<Buffer> {
    await this.ensureTempDir();
    const outputPath = path.join(this.tempDir, `enhance-${uuidv4()}.mp4`);

    try {
      const filters = [
        `unsharp=luma_msize_x=5:luma_msize_y=5:luma_amount=${options.sharpness}`,
        `hqdn3d=luma_spatial=${options.denoise}`,
        `eq=saturation=${options.saturation}:contrast=${options.contrast}`
      ].join(',');

      const command = `ffmpeg -i "${inputPath}" -vf "${filters}" -c:v libx264 -c:a copy "${outputPath}"`;

      await execAsync(command);

      const outputBuffer = await fs.readFile(outputPath);
      await this.cleanupFile(outputPath);

      return outputBuffer;
    } catch (error) {
      await this.cleanupFile(outputPath);
      throw error;
    }
  }

  async generateCaptions(inputPath: string): Promise<string> {
    // This would integrate with OpenAI Whisper API
    // For now, return a placeholder SRT
    const srtContent = `1
00:00:00,000 --> 00:00:05,000
Este é um exemplo de legenda gerada automaticamente.

2
00:00:05,000 --> 00:00:10,000
O vídeo foi processado com sucesso.
`;

    return srtContent;
  }

  async hardcodeCaptions(inputPath: string, srtPath: string): Promise<Buffer> {
    await this.ensureTempDir();
    const outputPath = path.join(this.tempDir, `captioned-${uuidv4()}.mp4`);

    try {
      const command = `ffmpeg -i "${inputPath}" -vf "subtitles=${srtPath}" -c:v libx264 -c:a copy "${outputPath}"`;

      await execAsync(command);

      const outputBuffer = await fs.readFile(outputPath);
      await this.cleanupFile(outputPath);

      return outputBuffer;
    } catch (error) {
      await this.cleanupFile(outputPath);
      throw error;
    }
  }
}

export const videoProcessor = new VideoProcessor();
