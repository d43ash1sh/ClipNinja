// src/app/actions.ts
"use server";

import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

// Set FFMPEG and FFPROBE paths if they are in specific locations (especially for packaged environments)
// In Vercel, ffmpeg is usually available in PATH. For local dev, ensure it's in PATH.
if (process.env.FFMPEG_PATH) {
  ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
}
if (process.env.FFPROBE_PATH) {
  ffmpeg.setFfprobePath(process.env.FFPROBE_PATH);
}

interface ClipData {
  youtubeUrl: string;
  startTime: string; 
  endTime: string;   
}

interface ClipResult {
  success: boolean;
  filePath?: string; // This will be the unique filename, not the full path
  error?: string;
  thumbnailUrl?: string;
}

// Helper to parse time string to seconds
// Formats supported:
// - HH:MM:SS (e.g., "01:20:30")
// - HH:MM    (e.g., "01:20", interpreted as 1 hour 20 minutes 0 seconds)
// - SS       (e.g., "90", interpreted as 90 total seconds)
// To specify only minutes and seconds, use the HH:MM:SS format e.g. "00:15:30".
const parseTimeToSeconds = (timeStr: string): number => {
  const partsStr = timeStr.split(':');
  const parts = partsStr.map(Number);

  if (parts.some(isNaN)) {
    throw new Error('Time parts must be numbers.');
  }
  if (parts.some(p => p < 0)) {
    throw new Error('Time parts cannot be negative.');
  }

  if (parts.length === 3) { // HH:MM:SS
    if (parts[1] >= 60 || parts[2] >= 60) throw new Error('Minutes and seconds must be less than 60 for HH:MM:SS format.');
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) { // Interpreted as HH:MM
    if (parts[1] >= 60) throw new Error('Minutes must be less than 60 for HH:MM format.');
    return parts[0] * 3600 + parts[1] * 60; // Seconds are 0
  } else if (parts.length === 1) { // Interpreted as SS (total seconds)
    return parts[0];
  }
  throw new Error('Invalid time format. Use HH:MM:SS, HH:MM (for hours and minutes), or SS (for total seconds).');
};

export async function processVideoClipping(data: ClipData): Promise<ClipResult> {
  try {
    const { youtubeUrl, startTime: startTimeStr, endTime: endTimeStr } = data;

    if (!ytdl.validateURL(youtubeUrl)) {
      return { success: false, error: "Invalid YouTube URL." };
    }

    const videoInfo = await ytdl.getInfo(youtubeUrl);
    const videoDuration = parseInt(videoInfo.videoDetails.lengthSeconds, 10);
    const thumbnailUrl = videoInfo.videoDetails.thumbnails?.[videoInfo.videoDetails.thumbnails.length -1]?.url || videoInfo.videoDetails.thumbnail?.thumbnails?.[videoInfo.videoDetails.thumbnail.thumbnails.length -1]?.url || `https://i.ytimg.com/vi/${videoInfo.videoDetails.videoId}/hqdefault.jpg`;

    let startTimeInSeconds: number;
    let endTimeInSeconds: number;

    try {
        startTimeInSeconds = parseTimeToSeconds(startTimeStr);
        endTimeInSeconds = parseTimeToSeconds(endTimeStr);
    } catch (parseError: any) {
        return { success: false, error: parseError.message || "Invalid start or end time format." };
    }
    
    if (isNaN(startTimeInSeconds) || isNaN(endTimeInSeconds)) {
      // This case should ideally be caught by parseTimeToSeconds throwing an error
      return { success: false, error: "Invalid start or end time resulting in NaN." };
    }

    if (startTimeInSeconds < 0 || endTimeInSeconds < 0) {
        // This should also be caught by parseTimeToSeconds
        return { success: false, error: "Time values cannot be negative." };
    }
    
    if (startTimeInSeconds >= endTimeInSeconds) {
      return { success: false, error: "End time must be after start time." };
    }

    if (endTimeInSeconds > videoDuration) {
        // Format videoDuration into HH:MM:SS for user display
        const d = new Date(0);
        d.setSeconds(videoDuration);
        const videoDurationFormatted = d.toISOString().slice(11,19);
        return { success: false, error: `End time exceeds video duration (${videoDurationFormatted}).`};
    }
    
    const durationOfClip = endTimeInSeconds - startTimeInSeconds;
    if (durationOfClip <= 0) {
        // This should be caught by startTimeInSeconds >= endTimeInSeconds
        return { success: false, error: "Clip duration must be positive."};
    }
    if (durationOfClip > 300) { // Max 5 minutes
        return { success: false, error: "Clip duration cannot exceed 5 minutes."};
    }

    const tempDir = path.join(os.tmpdir(), 'clipninja-clips');
    await fs.mkdir(tempDir, { recursive: true });
    
    const uniqueFilename = `clip-${uuidv4()}.mp4`;
    const outputPath = path.join(tempDir, uniqueFilename);

    const videoStream = ytdl(youtubeUrl, {
      quality: 'highestvideo', 
      filter: format => format.hasVideo && format.hasAudio && format.container === 'mp4',
    });
    
    await new Promise<void>((resolve, reject) => {
      ffmpeg(videoStream)
        .setStartTime(startTimeInSeconds)
        .setDuration(durationOfClip)
        .outputOptions('-movflags faststart') 
        .format('mp4')
        .on('error', (err) => {
          console.error('FFMPEG Error:', err.message);
          if (err.message.includes('Premature end of stream')) {
             reject(new Error(`FFMPEG processing failed: The video stream ended unexpectedly. This can happen with live streams or certain protected content.`));
          } else {
            reject(new Error(`FFMPEG processing failed: ${err.message}`));
          }
        })
        .on('end', () => {
          console.log('FFMPEG processing finished.');
          resolve();
        })
        .save(outputPath);
    });

    return { success: true, filePath: uniqueFilename, thumbnailUrl };

  } catch (error) {
    console.error("Error processing video:", error);
    let userFriendlyError: string;

    if (error instanceof Error) {
      const message = error.message.toLowerCase(); 
      if (message.includes('no such file or directory, ffmpeg')) {
        userFriendlyError = "FFMPEG not found. Please ensure FFMPEG is installed and in your system's PATH.";
      } else if (
        message.includes('could not extract functions') || 
        message.includes('no formats found') || 
        message.includes('unavailable video') ||
        message.includes('private video') ||
        message.includes('video is unavailable') ||
        message.includes('login required') ||
        message.includes('age restricted') || 
        message.includes('region-locked') || 
        message.includes('copyright') || 
        message.includes('failed to find animation function')
      ) {
        userFriendlyError = "Failed to process the video. It might be private, age-restricted, region-locked, deleted, require login, or use an unsupported format. Please check the URL or try a different video.";
      } else if (message.includes('premature end of stream') && message.includes('ffmpeg')) {
          userFriendlyError = "Failed to clip: The video stream ended unexpectedly during processing. This can occur with live streams or certain protected content.";
      } else {
        userFriendlyError = error.message; // Use the error message directly if it's not one of the known issues.
      }
    } else {
      userFriendlyError = "An unknown error occurred during processing.";
    }
    return { success: false, error: userFriendlyError };
  }
}