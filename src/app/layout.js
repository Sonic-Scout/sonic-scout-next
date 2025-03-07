import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import rainbowkitConfig from "@/lib/rainbowkit_config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sonic Scout",
  description:
    "Sonic Scout is a decentralized application for finding the best NFTs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers rainbowkitConfig={rainbowkitConfig}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
