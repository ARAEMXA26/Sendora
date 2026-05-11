import type { Metadata } from "next";
import { Space_Grotesk, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const titleFont = Bricolage_Grotesque({
  variable: "--font-title",
  subsets: ["latin"],
});

import { Toaster } from "react-hot-toast";
import { GlobalMaintenanceProvider } from "@/components/global-maintenance-provider";

export const metadata: Metadata = {
  title: "Sendora",
  description: "Platform Auto Send Telegram by Sendora",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${bodyFont.variable} ${titleFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <GlobalMaintenanceProvider />
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
