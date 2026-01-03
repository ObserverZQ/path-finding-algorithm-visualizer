import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeInit } from '../.flowbite-react/init';
import { ThemeModeScript } from 'flowbite-react';
import './ui/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Path-Finding Visualizer',
  description: 'Created by Kerry Gao.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='' suppressHydrationWarning>
      <head>
        <ThemeModeScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.classList.remove('dark');
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <ThemeInit /> */}
        <div className='flex justify-center bg-neutral-150'>{children}</div>
      </body>
    </html>
  );
}
