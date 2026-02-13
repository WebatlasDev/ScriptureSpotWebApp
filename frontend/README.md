This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Advanced Search

The application integrates with **Azure Cognitive Search** to provide full‑text search across verses, commentaries and authors. Use the search bar in the header to query the index. Results are grouped by content type on the `/search` page.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Stripe Setup

Payments rely on Stripe. Create a `.env` file (or use the provided examples) with the following variables:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_public_key
STRIPE_SECRET_KEY=your_secret_key
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=your_price_id
NEXT_PUBLIC_CLERK_PREMIUM_PLAN_ID=your_plan_id
NEXT_PUBLIC_CLERK_JWT_TEMPLATE=scripture-spot-auth
NEXT_PUBLIC_DEFAULT_VERSION=asv
```

The publishable key, price ID and plan ID are exposed to the client so they must use the `NEXT_PUBLIC_` prefix.

To call the backend, obtain a Clerk session token using the configured JWT template and include it in the `Authorization` header:

```ts
import { useAuth } from '@clerk/nextjs'

const { getToken } = useAuth()
const token = await getToken({ template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE })

await fetch('/api/bookmarks', {
  headers: { Authorization: `Bearer ${token}` }
})
```

Subscriptions now redirect through Clerk Billing checkout, while donations still use Stripe Checkout.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## OG Image Generation

This project uses `@resvg/resvg-wasm` to render social images. The WASM binary
(`public/resvg.wasm`) is about 2.4&nbsp;MB and is served with a long‑term cache
(`Cache-Control: public, max-age=31536000, immutable`) so clients only download
it once. The OG image generator fetches and initializes this binary a single
time per Node.js instance and reuses it for subsequent requests.

## Clerk Billing for B2C SaaS

**Warning**

This feature is currently in Beta. The low-level JavaScript APIs exposed via `Clerk.billing` are experimental and may undergo breaking changes. To mitigate potential disruptions, pin your SDK and `clerk-js` package versions.

Clerk billing for B2C SaaS lets you create plans and manage subscriptions for individual users. If you need to charge companies or organizations, see Billing for B2B SaaS. Both B2C and B2B billing can be combined in the same application.

### Enable billing

Enable billing from the **Billing Settings** page in the Clerk Dashboard. Clerk billing costs 0.7% per transaction, plus Stripe's transaction fees which are paid directly to Stripe.

### Payment gateway

After enabling billing you can collect payments via Stripe using either:

1. **Clerk development gateway** – a shared test Stripe account so you can start building without configuring your own account.
2. **Stripe account** – use your own Stripe account.

### Create a plan

Plans are what your users subscribe to. Create, edit and delete plans from the **Plans** page in the Clerk Dashboard. For B2C billing select the **Plans for Users** tab and choose **Add Plan**. Features for the plan can also be created during this step.

### Add features to a plan

Features make it simple to grant entitlements. To add a feature after a plan is created:

1. Go to the **Plans** page in the Clerk Dashboard.
2. Select the plan you want to modify.
3. In the **Features** section choose **Add Feature**.

### Create a pricing page

Use the `<PricingTable />` component to display plans and features that users can subscribe to. A dedicated page might look like this:

```tsx
import { PricingTable } from '@clerk/nextjs'

export default function PricingPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
      <PricingTable />
    </div>
  )
}
```

### Control access with features and plans

Gate content using Clerk's `has()` method or the `<Protect>` component.

#### Example: using `has()`

```ts
const hasPremiumAccess = has({ plan: 'premium' })
```

```ts
const hasPremiumAccess = has({ feature: 'widgets' })
```

```tsx
import { auth } from '@clerk/nextjs/server'

export default async function PremiumContentPage() {
  const { has } = await auth()

  const hasPremiumPlan = has({ plan: 'premium' })

  if (!hasPremiumPlan) return <h1>Only subscribers to the Premium plan can access this content.</h1>

  return <h1>For Premium subscribers only</h1>
}
```

#### Example: using `<Protect>`

```tsx
import { Protect } from '@clerk/nextjs'

export default function ProtectedContentPage() {
  return (
    <Protect
      plan="premium"
      fallback={<p>Only subscribers to the Premium plan can access this content.</p>}
    >
      <h1>Exclusive Premium Content</h1>
      <p>This content is only visible to Premium subscribers.</p>
    </Protect>
  )
}
```

