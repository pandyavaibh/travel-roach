import type { Metadata } from 'next';
import { Newsreader, Schibsted_Grotesk } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE } from '@/lib/site';
import './globals.css';

const serif = Newsreader({ subsets: ['latin'], weight: ['300','400','500'], style: ['normal','italic'], variable: '--font-serif', display: 'swap' });
const sans = Schibsted_Grotesk({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name + ' — India travel guides', template: '%s | ' + SITE.name },
  description: 'Guides written on the ground, state by state and city by city, with verified travel agents, hotels and restaurants.',
  openGraph: { siteName: SITE.name, type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={serif.variable + ' ' + sans.variable}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
