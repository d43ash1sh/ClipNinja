// src/app/how-it-works/page.tsx
"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Youtube, Link as LinkIcon, Clock, Scissors, DownloadCloud } from 'lucide-react';

const steps = [
  {
    icon: Youtube,
    title: '1. Find Your Video',
    description: 'Grab the URL of the YouTube video you want to clip. Make sure it\'s a public video!',
  },
  {
    icon: LinkIcon,
    title: '2. Paste the URL',
    description: 'Head back to ClipNinja and paste the YouTube URL into the input field on our homepage.',
  },
  {
    icon: Clock,
    title: '3. Set Timestamps',
    description: "Specify start/end times. Use HH:MM (e.g., '01:20' for 1h 20m), SS (e.g., '75' for 75s), or HH:MM:SS (e.g., '00:15:30' for 15m 30s).",
  },
  {
    icon: Scissors,
    title: '4. Clip It!',
    description: 'Hit the "Clip Now" button. Our ninjas will get to work, processing your video in seconds.',
  },
  {
    icon: DownloadCloud,
    title: '5. Preview & Download',
    description: 'Once ready, you can preview your masterpiece and download it directly to your device.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gradient">How ClipNinja Works</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Clipping YouTube videos has never been easier. Follow these simple steps to get your perfect clip.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {steps.map((step, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="h-full glassmorphism hover:shadow-primary/30 transition-shadow duration-300">
              <CardHeader className="items-center">
                <step.icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl text-center">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">{step.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}