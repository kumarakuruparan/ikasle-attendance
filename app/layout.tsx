import { AuthRoleProvider } from "@/lib/auth/useAuthRole";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IKASLE | Enterprise Workplace Management Platform",
  description:
    "An intelligent workplace platform for attendance, projects, tasks and workforce productivity. Engineered for modern high-performance organizations.",
  keywords: [
    "enterprise office management",
    "attendance system",
    "workforce productivity",
    "daily work reports",
    "project management",
    "IKASLE",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
        <ClerkProvider>
          <QueryProvider><AuthRoleProvider>{children}</AuthRoleProvider></QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}