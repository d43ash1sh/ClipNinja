// src/components/layout/header.tsx
"use client";

import Link from 'next/link';
import { ClipNinjaLogo } from '@/components/ui/clipninja-logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="ClipNinja Home">
          <ClipNinjaLogo className="h-8 w-8" />
          <span className="font-bold text-xl text-gradient">ClipNinja</span>
        </Link>
      </div>
    </header>
  );
}
