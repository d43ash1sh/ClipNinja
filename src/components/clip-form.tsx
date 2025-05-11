// src/components/clip-form.tsx
"use client";

import { useState, type Dispatch, type SetStateAction } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientButton } from '@/components/ui/gradient-button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { Scissors } from 'lucide-react';
import { processVideoClipping } from '@/app/actions'; // Server Action

// Regex validates structure: HHH (total seconds), HHH:MM, or HHH:MM:SS
// Further validation for M/S < 60 is handled in .refine if needed or by server
const timeSchema = z.string()
  .regex(/^(\d+)(?::([0-5]\d)(?::([0-5]\d))?)?$/, {
    message: "Use SS (e.g. 90), HH:MM (e.g. 01:20), or HH:MM:SS (e.g. 00:15:30). Minutes/seconds must be 00-59."
  })
  .refine(timeStr => { // Ensures parts are valid numbers, though regex mostly covers this for positive integers.
    const parts = timeStr.split(':').map(Number);
    if (parts.some(isNaN) || parts.some(p => p < 0)) return false;
    // Additional specific component validation (M<60, S<60) is implicitly handled by regex for M,S parts
    // and by server-side parseTimeToSeconds for all cases.
    return true; 
  }, {
    // This message might be redundant if regex message is specific enough.
    message: "Time components must be valid non-negative numbers and minutes/seconds (if present) 00-59."
  });


// Client-side parser to match server-side logic for form validation (endTime > startTime)
const clientParseTimeToSeconds = (timeStr: string): number => {
  const partsStr = timeStr.split(':');
  const parts = partsStr.map(Number);

  if (parts.some(isNaN) || parts.some(p => p < 0)) {
    // This indicates a failure that should ideally be caught by `timeSchema`'s regex or refine.
    // Returning NaN ensures `formSchema.refine` will fail if this occurs.
    return NaN; 
  }

  if (parts.length === 3) { // HH:MM:SS
    if (parts[1] >= 60 || parts[2] >= 60) return NaN; // Invalid M/S values
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) { // HH:MM
    if (parts[1] >= 60) return NaN; // Invalid M values
    return parts[0] * 3600 + parts[1] * 60;
  } else if (parts.length === 1) { // SS
    return parts[0];
  }
  return NaN; // Invalid structure not caught by above
};

const formSchema = z.object({
  youtubeUrl: z.string().url({ message: "Please enter a valid YouTube URL." }),
  startTime: timeSchema,
  endTime: timeSchema,
}).refine(data => {
  const startTime = clientParseTimeToSeconds(data.startTime);
  const endTime = clientParseTimeToSeconds(data.endTime);
  // Check if parsing failed (NaN) or if logic is violated
  if (isNaN(startTime) || isNaN(endTime)) {
    // This implies a Zod validation issue with `timeSchema` not catching something,
    // or an unexpected non-string input. Form validation should ideally prevent this.
    return false; 
  }
  return endTime > startTime;
}, {
  message: "End time must be after start time. Ensure time formats are valid.",
  path: ["endTime"], // Apply error to endTime field
});

type FormData = z.infer<typeof formSchema>;

export interface ClipResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

interface ClipFormProps {
  setClipResult: Dispatch<SetStateAction<ClipResult | null>>;
}

export function ClipForm({ setClipResult }: ClipFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      youtubeUrl: "",
      startTime: "00:00:00", // 0 seconds
      endTime: "00:00:10",   // 10 seconds
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setClipResult(null);

    toast({
      title: "Processing Clip",
      description: "Your video is being processed. Please wait...",
    });

    try {
      const result = await processVideoClipping(data);
      setClipResult(result);
      if (result.success) {
        toast({
          title: "Clip Ready!",
          description: "Your clip has been processed successfully.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to process the clip.",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setClipResult({ success: false, error: errorMessage });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const timeInputTooltip = "Use HH:MM (e.g. 01:20 for 1hr 20min), SS (e.g. 75 for 75s), or HH:MM:SS (e.g. 01:20:30). For MM:SS only, use 00:MM:SS (e.g. 00:15:30).";


  return (
    <Card className="glassmorphism w-full shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
          <Scissors className="h-8 w-8 text-primary" />
          Create Your Clip
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Enter a YouTube URL, set your start and end times, and let the magic happen!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="youtubeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="youtubeUrl" className="text-lg">YouTube URL</FormLabel>
                  <TooltipWrapper content="Paste the full YouTube video URL here (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)">
                    <FormControl>
                      <Input
                        id="youtubeUrl"
                        placeholder="https://www.youtube.com/watch?v=..."
                        {...field}
                        className="text-base bg-input/70 border-border focus:ring-primary"
                      />
                    </FormControl>
                  </TooltipWrapper>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="startTime" className="text-lg">Start Time</FormLabel>
                    <TooltipWrapper content={timeInputTooltip}>
                      <FormControl>
                        <Input
                          id="startTime"
                          placeholder="e.g. 00:30 or 45"
                          {...field}
                          className="text-base bg-input/70 border-border focus:ring-primary"
                        />
                      </FormControl>
                    </TooltipWrapper>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="endTime" className="text-lg">End Time</FormLabel>
                    <TooltipWrapper content={timeInputTooltip}>
                      <FormControl>
                        <Input
                          id="endTime"
                          placeholder="e.g. 01:15 or 120"
                          {...field}
                          className="text-base bg-input/70 border-border focus:ring-primary"
                        />
                      </FormControl>
                    </TooltipWrapper>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <GradientButton type="submit" isLoading={isLoading} className="w-full text-lg py-6" size="lg">
              <Scissors className="mr-2 h-5 w-5" />
              Clip Now
            </GradientButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}