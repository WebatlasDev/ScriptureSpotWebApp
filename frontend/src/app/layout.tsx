import { Lexend, Literata, Plus_Jakarta_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import '@/styles/globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { Box } from '@mui/material';
import { ThemeRegistry } from '@/providers/ThemeProvider';
import { Metadata } from 'next';
import { PostHogProvider } from '@/providers/PostHogProvider';
import { ClerkProvider } from '@clerk/nextjs';
import { clerkAppearance } from '@/styles/clerkAppearance';
import LastPageTracker from '@/components/common/LastPageTracker';
import ToastProvider from '@/components/ui/ToastProvider';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { GoogleTagManager } from '@next/third-parties/google'
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import { AdSenseScript } from '@/components/ads';
import { AD_CONFIG } from '@/config/adConfig';
import ExitIntentNewsletterModal from '@/components/marketing/ExitIntentNewsletterModal';

const inter = localFont({
  src: [
    {
      path: '../../public/assets/fonts/InterVariable/InterVariable.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/InterVariable/InterVariable-Italic.woff2',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
});
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });
const literata = Literata({ 
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'], 
  variable: '--font-literata' 
});

const plusJakartaSans = Plus_Jakarta_Sans({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'], 
  variable: '--font-plus-jakarta' 
});

const rightGrotesk = localFont({
  src: [
    {
      path: '../../public/assets/fonts/RightGrotesk/PPRightGrotesk-SpatialRegular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/RightGrotesk/PPRightGrotesk-SpatialMedium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-right-grotesk',
  display: 'swap',
});

const siteCanonical = buildCanonical(env.site);
const analyticsHost = new URL(env.site).hostname;
const isProductionAnalyticsHost = analyticsHost === 'www.scripturespot.com';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.scripturespot.com'),
  title: 'Scripture Spot | Study the Bible with Trusted Commentaries & Cross-References',
  description: 'Unlock deeper understanding of Scripture with verse-by-verse commentaries, cross-references, and Bible study tools. Scripture Spot makes studying God’s Word easier, clearer, and more insightful.',
  keywords: ['Bible Study', 'Scripture Spot', 'Bible Commentary', 'Verse Insights', 'Cross References', 'Study the Bible'],
  alternates: {
    canonical: siteCanonical,
  },
  openGraph: {
    title: 'Scripture Spot | Study the Bible with Trusted Commentaries & Cross-References',
  description: 'Unlock deeper understanding of Scripture with verse-by-verse commentaries, cross-references, and Bible study tools. Scripture Spot makes studying God’s Word easier, clearer, and more insightful.',
    url: siteCanonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: ['/assets/images/logos/Scripture-Spot-Logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scripture Spot | Study the Bible with Trusted Commentaries & Cross-References',
    description: 'Unlock deeper understanding of Scripture with verse-by-verse commentaries, cross-references, and Bible study tools. Scripture Spot makes studying God’s Word easier, clearer, and more insightful.',
    images: ['/assets/images/logos/Scripture-Spot-Logo.png'],
  },
  icons: {
    icon: `${env.site}/assets/images/logos/scripture-spot-favicon.svg`,
  },
  other: {
    'google-adsense-account': 'ca-pub-5189192546187755',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={clerkAppearance}
    >
      <html
        lang="en"
        className={`${inter.variable} ${lexend.variable} ${literata.variable} ${plusJakartaSans.variable} ${rightGrotesk.variable}`}
      >
        <body>
          <PostHogProvider>
            <AppRouterCacheProvider options={{ key: 'css' }}>
              <ThemeRegistry>
                <QueryProvider>
                  <TooltipProvider>
                    <Box sx={{ minHeight: '100vh', background: '#111111' }}>
                      <LastPageTracker />
                      {children}
                      <ToastProvider />
                      <ExitIntentNewsletterModal />
                      {isProductionAnalyticsHost && (
                        <GoogleTagManager gtmId="GTM-MS8H7XP6" />
                      )}
                      <AdSenseScript publisherId={AD_CONFIG.PUBLISHER_ID} />
                    </Box>
                  </TooltipProvider>
                </QueryProvider>
              </ThemeRegistry>
            </AppRouterCacheProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
