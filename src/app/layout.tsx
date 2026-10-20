import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Victor Emmanuel Burbano | Web & Mobile Developer",
  description: "BS Information Technology graduate and web and mobile developer based in Caloocan City, Philippines. Open to entry-level software engineering and IT roles.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
