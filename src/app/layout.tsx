import type { Metadata } from 'next';
import './globals.css';
import { DebugProvider } from '@/context/DebugContext';

export const metadata: Metadata = {
  title: 'Cara de Meme - Filtro de Memes Português',
  description: 'Descobre que meme português és com este filtro viral. Câmara em tempo real, partilha social, sem instalação!',
  icons: {
    icon: '/favicon.ico',
  },
  viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Cara de Meme',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Descobre que meme português és com este filtro viral!" />
        <meta property="og:title" content="Cara de Meme - Filtro de Memes Português" />
        <meta property="og:description" content="Câmara em tempo real, partilha social, sem instalação!" />
        <meta property="og:type" content="website" />
      </head>
      <body>
        <DebugProvider>{children}</DebugProvider>
      </body>
    </html>
  );
}
