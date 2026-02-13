import { auth } from '@clerk/nextjs/server'

export default async function PremiumContentPage() {
  const { has } = await auth()

  const hasPremiumPlan = has({ plan: 'premium' })

  if (!hasPremiumPlan) return <h1>Only subscribers to the Premium plan can access this content.</h1>

  return <h1>For Premium subscribers only</h1>
}
