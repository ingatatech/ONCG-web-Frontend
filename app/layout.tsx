import { Inter } from "next/font/google";
import "./globals.css";

import LayoutShell from "@/components/LayoutShell";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "ONCG Ltd - Professional Auditing & Consulting Services",
  description:
    "ON Consulting Group Ltd provides expert auditing, advisory services, and consultancy solutions for businesses.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
				<link rel="apple-touch-icon" type="image/jpg" href="/images/oncg-logo1.jpg" />
				<link rel="icon" type="image/jpg" href="/images/oncg-logo1.jpg" />
			</head>
      <body className={`${inter.variable} antialiased`}>
        	<Toaster position="top-right" />
        		<LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
