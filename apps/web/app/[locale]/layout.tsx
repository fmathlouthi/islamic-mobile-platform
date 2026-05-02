import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import ChatWidget from '@/components/ChatWidget';

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const ibmPlexArabic = IBM_Plex_Sans_Arabic({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["arabic"],
  variable: '--font-ibm-arabic'
});

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const messages: any = await getMessages({ locale });
  const t = messages.Index;

  return {
    title: t.title,
    description: t.description,
    viewport: "width=device-width, initial-scale=1",
  };
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} className={`${inter.variable} ${ibmPlexArabic.variable}`}>
      <body className={locale === 'ar' ? 'font-arabic' : 'font-sans'}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
