import type { Metadata } from "next";
import { Lobster, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ClientProvider from "@/HOC/ClientProvider";
import Navbar from "@/components/Home/Navbar";
import NavbarWrapper from "@/components/NavbarWrapper";

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
          <div className="w-full h-[8vh] bg-white sm:px-0 md:px-8 lg:px-16 xl:px-24 2xl:px-48 lg:h-[12vh] ">
            <NavbarWrapper />
          </div>
          <div className="bg-[#F4F2F2] sm:px-0 md:px-8 lg:px-16 xl:px-28 2xl:px-64">
            {children}
            <Toaster />
          </div>
        </ClientProvider>
      </body>
    </html>
  );
}
