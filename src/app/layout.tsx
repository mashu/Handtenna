import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '20m Pedestrian Antenna Base Designer',
  description: 'Design and export 3D printable antenna bases for amateur radio',
  keywords: ['antenna', 'ham radio', 'amateur radio', '3D printing', 'STL', '20m band'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

