import type { Metadata } from "next";
import "./globals.css";
import { SocketProvider } from "../lib/socket";

export const metadata: Metadata = {
  title: "Adda | Join",
  description: "Join a session in Adda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface flex flex-col min-h-screen selection:bg-primary/30">
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
