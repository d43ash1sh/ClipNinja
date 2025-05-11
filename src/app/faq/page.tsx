// src/app/faq/page.tsx
"use client";

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is ClipNinja free to use?",
    answer: "Yes, ClipNinja is completely free to use for extracting clips from YouTube videos.",
  },
  {
    question: "What video formats can I download?",
    answer: "Currently, ClipNinja provides clips in MP4 format, which is widely compatible across devices and platforms.",
  },
  {
    question: "Is there a limit on video length or clip duration?",
    answer: "While there's no strict limit on the original video length, we recommend shorter clips for faster processing. Clip duration is currently limited to 5 minutes to ensure server stability and quick processing times.",
  },
  {
    question: "Can I clip private or unlisted YouTube videos?",
    answer: "No, ClipNinja can only process publicly available YouTube videos. Private or unlisted videos cannot be accessed.",
  },
  {
    question: "What happens if the YouTube URL is invalid or the video is unavailable?",
    answer: "ClipNinja will display an error message if the YouTube URL is invalid, the video is private, region-restricted, or has been removed.",
  },
  {
    question: "Do I need to install any software?",
    answer: "No, ClipNinja is a web-based tool. All processing happens on our servers. You just need a modern web browser. (Note: For local development of this app, developers need FFMPEG installed).",
  },
   {
    question: "How long are my clips stored?",
    answer: "Clipped videos are stored temporarily to allow you to download them. They are typically removed from our servers after a short period (e.g., a few hours). We recommend downloading your clip immediately after it's processed.",
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gradient">Frequently Asked Questions</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions? We've got answers! If you don't find what you're looking for, feel free to reach out.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card/50 border border-border/50 rounded-lg p-2 glassmorphism">
              <AccordionTrigger className="text-lg hover:no-underline px-4 py-3 text-left text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-0 pb-3 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
}
