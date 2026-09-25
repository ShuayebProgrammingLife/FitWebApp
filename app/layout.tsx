import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { PlanProvider } from "@/context/PlanContext";
import Toaster from "@/components/Toaster";

const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", weight: ["500", "600", "700"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FitLog — Workout Library",
  description: "Pick a lift, lock it into today's plan, and watch the week's work add up.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-bg font-body text-white antialiased">
        <PlanProvider>
          <main className="flex-1">{children}</main>
          <Toaster />
        </PlanProvider>
      </body>
    </html>
  );
}