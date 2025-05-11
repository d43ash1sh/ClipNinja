// src/app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipNinjaLogo } from '@/components/ui/clipninja-logo';
import { AnimatedText } from '@/components/animated-text';
import { ClipForm, type ClipResult } from '@/components/clip-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Download, AlertTriangle } from 'lucide-react';

export default function HomePage() {
  const [clipResult, setClipResult] = useState<ClipResult | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    if (clipResult?.success && clipResult.filePath) {
      // Construct the URL to fetch the clip from the route handler
      const url = `/clips/${clipResult.filePath.split('/').pop()}`;
      setVideoSrc(url);
    } else {
      setVideoSrc(null);
    }
  }, [clipResult]);
  
  const heroTaglines = ["Trim it.", "Clip it.", "Download it."];

  return (
    <div className="flex flex-col items-center text-center space-y-12">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl space-y-6 pt-8"
      >
        <div className="flex justify-center items-center gap-4">
          <ClipNinjaLogo className="h-16 w-16 md:h-24 md:w-24" />
          <h1 className="text-5xl md:text-7xl font-extrabold text-gradient">
            ClipNinja
          </h1>
        </div>
        <p className="text-2xl md:text-3xl font-bold text-foreground">
          Extract YouTube Clips in Seconds
        </p>
        <AnimatedText texts={heroTaglines} className="text-xl md:text-2xl text-muted-foreground font-medium" />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-xl"
      >
        <ClipForm setClipResult={setClipResult} />
      </motion.section>

      {clipResult && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl mt-12"
        >
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="text-2xl text-gradient">Your Clip</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {clipResult.success && videoSrc ? (
                <>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                    <video
                      key={videoSrc} // Add key to force re-render when src changes
                      controls
                      src={videoSrc}
                      className="w-full h-full"
                      aria-label="Clipped video preview"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <GradientButton
                    asChild
                    size="lg"
                    className="w-full"
                  >
                    <a href={videoSrc} download={`clipninja_clip.mp4`}>
                      <Download className="mr-2 h-5 w-5" />
                      Download Clip
                    </a>
                  </GradientButton>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 bg-destructive/10 text-destructive rounded-md">
                  <AlertTriangle className="h-12 w-12 mb-2" />
                  <p className="font-semibold">Clipping Failed</p>
                  <p className="text-sm">{clipResult.error || "An unknown error occurred."}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>
      )}
    </div>
  );
}
