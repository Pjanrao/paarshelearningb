import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import LayoutWrapper from "@/components/Layout/LayoutWrapper";
import { ThemeProvider } from "next-themes";
import ScrollToTop from '@/components/ScrollToTop';
import Aoscompo from "@/utils/aos";
import NextTopLoader from 'nextjs-toploader';
import SessionProviderComp from "@/components/nextauth/SessionProvider";
import ReduxProvider from "@/components/ReduxProvider";


const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <NextTopLoader />
        <SessionProviderComp>
          <ReduxProvider>
            <ThemeProvider
              attribute="class"
              enableSystem={false}
              defaultTheme="light"
              forcedTheme="light"
            >
              <Aoscompo>
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
              </Aoscompo>
              <ScrollToTop />
            </ThemeProvider>
          </ReduxProvider>
        </SessionProviderComp>
      </body>
    </html>
  );
}
