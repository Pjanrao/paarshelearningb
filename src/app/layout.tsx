import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import LayoutWrapper from "@/components/Layout/LayoutWrapper";
import { ThemeProvider } from "next-themes";
import ScrollToTop from '@/components/ScrollToTop';
import Aoscompo from "@/utils/aos";
import NextTopLoader from 'nextjs-toploader';
import SessionProviderComp from "@/components/nextauth/SessionProvider";
import ReduxProvider from "@/components/ReduxProvider";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/redux/store";
import PageTracker from "@/components/Common/PageTracker";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://paarshelearning.com"),

  title:
    "Paarsh E-Learning | IT Training, 1:1 Learning & Placement Assistance",

  description:
    "Build job-ready IT skills with Paarsh E-Learning. Get personalized 1:1 learning, practical training, live project experience, internship opportunities, and placement assistance across in-demand technology fields.",

  keywords: [
    "Paarsh E-Learning",
    "IT training institute",
    "IT courses in Nashik",
    "software training institute",
    "1 to 1 IT learning",
    "placement assistance",
    "internship training",
    "practical IT training",
    "programming courses",
    "web development course",
    "AI course",
    "data science course",
    "cyber security course",
    "data analytics course",
    "UI UX course",
    "digital marketing course",
  ],

  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/images/logo/logo.jpeg",
        sizes: "192x192",
        type: "image/jpeg",
      },
    ],
    shortcut: "/images/logo/logo.jpeg",
    apple: "/images/logo/logo.jpeg",
  },

  openGraph: {
    title:
      "Build Your Career in Tech | Paarsh E-Learning",

    description:
      "Learn in-demand technology skills with personalized 1:1 learning, practical training, live projects, internship opportunities, and placement assistance.",

    url: "https://paarshelearning.com",

    siteName: "Paarsh E-Learning",

    images: [
      {
        url: "/images/home-og.png",
        width: 1200,
        height: 630,
        alt: "Paarsh E-Learning - Build Your Career in Tech",
      },
    ],

    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Build Your Career in Tech | Paarsh E-Learning",

    description:
      "Personalized 1:1 learning, practical IT training, live projects, internship opportunities, and placement assistance.",

    images: ["/images/home-og.png"],
  },

  alternates: {
    canonical: "https://paarshelearning.com",
  },
};

import PageTransition from "@/components/Common/PageTransition";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-S21NWZ9CHM"
        />
        <Script id="google-analytics">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-S21NWZ9CHM');
            `}
        </Script>
      </head>
      <body className={`${inter.className} ${inter.variable}`} suppressHydrationWarning>
        <NextTopLoader />
        <SessionProviderComp>
          <PageTracker />
          <ReduxProvider>

            <ThemeProvider
              attribute="class"
              enableSystem={false}
              defaultTheme="light"
              forcedTheme="light"
            >
              <Aoscompo>
                <PageTransition>
                  <LayoutWrapper>
                    {children}
                  </LayoutWrapper>
                </PageTransition>
              </Aoscompo>
              <ScrollToTop />
            </ThemeProvider>
          </ReduxProvider>
        </SessionProviderComp>
      </body>
    </html>
  );
}
