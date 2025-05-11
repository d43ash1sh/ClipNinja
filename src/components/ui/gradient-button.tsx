// src/components/ui/gradient-button.tsx
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const gradientButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, size, asChild = false, isLoading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="inline-block"
      >
        <Comp
          className={cn(
            gradientButtonVariants({ size, className }),
            "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--accent)/0.5)]"
          )}
          ref={ref}
          disabled={isLoading || props.disabled}
          {...props}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          <span className="relative z-10">{children}</span>
        </Comp>
      </motion.div>
    );
  }
);
GradientButton.displayName = "GradientButton";

export { GradientButton, gradientButtonVariants };
