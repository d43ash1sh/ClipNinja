import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
});

export const metadata: Metadata = {
  title: 'ClipNinja - Extract YouTube Clips in Seconds',
  description: 'Easily trim, clip, and download your favorite YouTube moments with ClipNinja.',
  icons: {
    icon: '/logo.svg', // Assuming a simple SVG logo is placed in public folder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${plusJakartaSans.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-foreground`}>
        <TooltipProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
