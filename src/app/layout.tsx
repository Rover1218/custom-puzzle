import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Puzzle Generator",
  description: "Create custom puzzles with ease",
  icons: {
    icon: [
      {
        url: 'https://cdn-icons-png.flaticon.com/512/4489/4489661.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        url: 'https://cdn-icons-png.flaticon.com/256/4489/4489661.png',
        sizes: '256x256',
        type: 'image/png'
      },
      {
        url: 'https://cdn-icons-png.flaticon.com/128/4489/4489661.png',
        sizes: '128x128',
        type: 'image/png'
      }
    ],
    shortcut: 'https://cdn-icons-png.flaticon.com/512/4489/4489661.png',
    apple: 'https://cdn-icons-png.flaticon.com/512/4489/4489661.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
