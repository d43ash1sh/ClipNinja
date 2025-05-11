// src/components/ui/clipninja-logo.tsx
import type { SVGProps } from 'react';

export function ClipNinjaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M14.5 17.5L10 13L14.5 8.5" stroke="url(#logoGradient)"/>
      <path d="M19.5 17.5L15 13L19.5 8.5" stroke="url(#logoGradient)"/>
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="url(#logoGradient)"/>
      <path d="M7 9L7 15" stroke="url(#logoGradient)"/>
    </svg>
  );
}
