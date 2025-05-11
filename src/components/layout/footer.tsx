// src/components/layout/footer.tsx
import Link from 'next/link';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';

const socialLinks = [
  {
    href: 'https://github.com/d43ash1sh',
    icon: Github,
    label: 'GitHub',
    ariaLabel: "Debashish's GitHub profile"
  },
  {
    href: 'https://twitter.com/d43ash1sh',
    icon: Twitter,
    label: 'Twitter',
    ariaLabel: "Debashish's Twitter profile"
  },
  {
    href: 'https://linkedin.com/in/d43ash1sh',
    icon: Linkedin,
    label: 'LinkedIn',
    ariaLabel: "Debashish's LinkedIn profile"
  },
  {
    href: 'https://instagram.com/debashishbordoloi007',
    icon: Instagram,
    label: 'Instagram',
    ariaLabel: "Debashish's Instagram profile"
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8 bg-background">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Left: Copyright + Navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8 w-full md:w-auto justify-center md:justify-start mb-4 md:mb-0">
          <p className="text-sm text-muted-foreground mb-2 md:mb-0">
            Built with ❤️ by Debashish
          </p>
          <nav className="flex space-x-8 text-sm text-muted-foreground justify-center">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
            <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
          </nav>
        </div>
        {/* Right: Social Icons */}
        <div className="flex items-center space-x-4">
          {socialLinks.map((link) => (
            <TooltipWrapper key={link.href} content={link.label}>
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <link.icon className="h-5 w-5" />
              </Link>
            </TooltipWrapper>
          ))}
        </div>
      </div>
    </footer>
  );
}
