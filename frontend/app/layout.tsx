import type { Metadata } from "next";
import { Lobster, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ClientProvider from "@/HOC/ClientProvider";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

const lobster = Lobster({
  weight: ["400"],
  variable: "--font-lobster",
  subsets: ["latin"],
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "ShadSocial - A social media webapp",
  description: "A social media webapp built with Next.js",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} ${lobster.variable} font-sans`}>
        <ClientProvider>
          {children}
          <Toaster />
        </ClientProvider>
      </body>
    </html>
  );
}
