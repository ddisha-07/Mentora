import type { Metadata } from 'next';
import { Geist, Geist_Mono, Pixelify_Sans, Press_Start_2P } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const pixelifySans = Pixelify_Sans({
  weight: ['700'],
  variable: '--font-pixel',
  subsets: ['latin'],
});

const pressStart2P = Press_Start_2P({
  weight: '400',
  variable: '--font-pixel-arcade',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Mentora — Personalized Learning Ecosystem for Working Professionals',
  description: 'AI-driven personalized learning journeys, skill-gap diagnostics, and verifiable skill passport for professionals.',
  icons: {
    icon: '/images/mentora-logo.png',
    shortcut: '/images/mentora-logo.png',
    apple: '/images/mentora-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${pixelifySans.variable} ${pressStart2P.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@700;900&family=Press+Start+2P&family=Silkscreen:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
