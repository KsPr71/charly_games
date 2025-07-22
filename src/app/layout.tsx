import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { GameProvider } from '@/context/game-provider';
import { ContactProvider } from '../context/ContactContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'CHARLY GAMES',
  description: 'A catalog of PC games.',
};

export default function RootLayout({
  children, 
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans light`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background font-body antialiased">
        <ContactProvider>
          
          <GameProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </GameProvider>
        </ContactProvider>
      </body>
    </html>
  );
}