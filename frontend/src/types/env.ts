export const env = {
  api: process.env.NEXT_PUBLIC_API_BASE_URL!,
  site: process.env.NEXT_PUBLIC_BASE_URL!,
  posthog: process.env.NEXT_PUBLIC_POSTHOG_KEY!,
  searchEndpoint: process.env.SEARCH_SERVICE_ENDPOINT!,
  searchApiKey: process.env.SEARCH_SERVICE_API_KEY!,
  stripePublishable: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  stripeMonthlyPrice: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!,
  clerkJwtTemplate: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE!,
  defaultVersion: process.env.NEXT_PUBLIC_DEFAULT_VERSION!,
};
