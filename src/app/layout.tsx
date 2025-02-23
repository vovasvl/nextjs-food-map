import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MapMarkersProvider } from "@/contexts/MapMarkersContext";
import { FilterPanelProvider } from "@/contexts/FilterPanelContext";
import { ClientSidebarProvider } from "@/providers/ClientSidebarProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Food Map App",
  description: "An interactive map application built with Next.js to explore and discover restaurants.",
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
        <MapMarkersProvider>
          <FilterPanelProvider>
            <ClientSidebarProvider>
                <main>
                  {children}
                </main>
            </ClientSidebarProvider>
          </FilterPanelProvider>
        </MapMarkersProvider>
      </body>
    </html>
  );
}
