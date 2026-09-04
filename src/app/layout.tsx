import { Outfit } from "next/font/google";
import "./globals.css";
import { getLocale, getMessages } from "next-intl/server";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import MainStateAdmin from "@/context/MainStateAdmin";
import { NextIntlClientProvider } from "next-intl";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Afghan Safar - Admin Panel",
  description:
    "Manage bookings, users, and transportation services for Afghan Safar.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages(); // ensures internationalization hydration matches

  return (
    <html
      lang={locale}
      dir={locale === "en" ? "ltr" : "rtl"}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={`${outfit.variable} dark:bg-gray-900 antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <MainStateAdmin>
            <ThemeProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </ThemeProvider>
          </MainStateAdmin>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}