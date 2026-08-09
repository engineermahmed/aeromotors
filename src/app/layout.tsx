import type { Metadata } from "next";
import "./globals.css";
import ScrollToTop from "@/components/shared/ScrollToTop";

export const metadata: Metadata = {
  title: {
    default: "AERO MOTORS | Quality Used Car Dealership",
    template: "%s | AERO MOTORS",
  },
  description:
    "AERO MOTORS — Quality used cars at honest prices. Browse our hand-inspected inventory of reliable pre-owned vehicles with full history reports.",
  keywords: [
    "used cars",
    "pre-owned vehicles",
    "second hand cars",
    "quality used cars",
    "aero motors",
    "car dealership",
    "affordable cars",
  ],
  openGraph: {
    title: "AERO MOTORS | Quality Used Car Dealership",
    description:
      "Hand-inspected used cars at fair, transparent prices. No hidden fees.",
    type: "website",
    locale: "en_US",
    siteName: "AERO MOTORS",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#1F1E1C] text-white antialiased">
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
