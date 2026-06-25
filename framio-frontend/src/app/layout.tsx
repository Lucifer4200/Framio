import '@mantine/core/styles.css';
import '@/assets/css/styles.css';
import { ColorSchemeScript } from '@mantine/core';
import { Providers } from './providers';

export const metadata = {
  title: 'Framio - Premium Home Décor Frames',
  description: 'Premium home décor frames for your walls',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
