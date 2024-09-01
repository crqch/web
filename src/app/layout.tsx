import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Viewport, type Metadata } from "next";
import { ThemeProvider } from 'next-themes';
import { auth } from "@/server/auth";
import { SessionProvider } from "@/lib/session";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "crqch",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(0 0% 100%)' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(240 10% 3.9%)' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const RootLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
  const { user, session } = await auth()

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Analytics />
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SessionProvider user={user} session={session}>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;