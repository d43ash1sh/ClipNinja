// src/components/ui/tooltip-wrapper.tsx
"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ReactNode } from 'react';

interface TooltipWrapperProps {
  children: ReactNode;
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export function TooltipWrapper({
  children,
  content,
  side,
  align,
}: TooltipWrapperProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align} className="bg-popover text-popover-foreground p-2 rounded-md shadow-lg text-xs">
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
