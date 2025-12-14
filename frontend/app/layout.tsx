import type { Metadata } from "next";
import { Inter, Lobster, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ClientProvider from "@/HOC/ClientProvider";
import Navbar from "@/components/Home/Navbar";
import NavbarWrapper from "@/components/NavbarWrapper";
import MainContainer from "@/components/MainContainer";
import Sidebar from "@/components/settings/Sidebar";
import { ThemeProvider } from "next-themes";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

const inter = Inter({
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${lobster.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientProvider>
            <NavbarWrapper />
            <div>
              <MainContainer>{children}</MainContainer>
              <Toaster />
            </div>
          </ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
