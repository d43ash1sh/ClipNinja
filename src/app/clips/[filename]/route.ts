// src/app/clips/[filename]/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename;

  if (!filename || typeof filename !== 'string' || !filename.match(/^clip-[0-9a-fA-F-]+\.mp4$/)) {
    return new NextResponse('Invalid filename', { status: 400 });
  }

  const tempDir = path.join(os.tmpdir(), 'clipninja-clips');
  const filePath = path.join(tempDir, filename);

  try {
    await fs.access(filePath); // Check if file exists
    const fileStat = await fs.stat(filePath);
    const fileStream = await fs.readFile(filePath); // Read entire file into buffer for simplicity

    // For actual streaming of large files, you'd use fs.createReadStream and pipe it.
    // However, Next.js Route Handlers with ReadableStream can be tricky.
    // Sending buffer for files up to a certain size is okay for serverless.

    // Cleanup: Delete file after serving? Or have a cron job.
    // For now, let's not delete immediately to allow multiple downloads / retries.
    // fs.unlink(filePath).catch(err => console.error("Failed to delete temp file:", err));


    return new NextResponse(fileStream, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': fileStat.size.toString(),
        'Content-Disposition': `attachment; filename="${filename}"`, // Suggests download
      },
    });

  } catch (error) {
    console.error(`Error serving file ${filename}:`, error);
    return new NextResponse('File not found or error reading file', { status: 404 });
  }
}
