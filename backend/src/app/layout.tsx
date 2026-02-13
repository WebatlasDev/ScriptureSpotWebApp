import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'ScriptureSpot API',
  description: 'Bible study and commentary API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if Clerk keys are properly configured (not empty or placeholder)
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasValidClerkKeys = 
    clerkPublishableKey &&
    clerkPublishableKey.length > 0 &&
    !clerkPublishableKey.includes('placeholder') &&
    !clerkPublishableKey.includes('REPLACE');

  return (
    <>
      {hasValidClerkKeys ? (
        <ClerkProvider>
          <html lang="en">
            <body>{children}</body>
          </html>
        </ClerkProvider>
      ) : (
        <html lang="en">
          <body>
            {children}
            {process.env.NODE_ENV === 'development' && (
              <div style={{
                position: 'fixed',
                bottom: 0,
                right: 0,
                background: '#ff9800',
                color: 'white',
                padding: '10px',
                fontSize: '12px',
                borderRadius: '4px 0 0 0',
                zIndex: 9999,
              }}>
                ⚠️ Clerk authentication disabled (no valid keys)
              </div>
            )}
          </body>
        </html>
      )}
    </>
  );
}
