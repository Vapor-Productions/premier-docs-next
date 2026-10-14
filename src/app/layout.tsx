import type { Metadata } from "next";
import { IBM_Plex_Sans, Libre_Baskerville, IBM_Plex_Mono } from "next/font/google";
import { DocsShell } from "@/components/DocsShell";
import { siteName } from "@/lib/nav";
import "./globals.css";

const body = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const display = Libre_Baskerville({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description: "Documentation for the Premier Planner Discord bot",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`dark ${body.variable} ${display.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('pp-docs-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;document.documentElement.classList.toggle('dark',t==='dark');}}catch(e){}})();`,
          }}
        />
        <DocsShell>{children}</DocsShell>
      </body>
    </html>
  );
}
