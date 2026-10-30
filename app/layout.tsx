
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trudible Cuisine | Our Kitchen To Your Heart",
  description:
    "Discover delicious Ampesi and fresh vegetable salad at Trudible Cuisine. Explore our menu and order through WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
