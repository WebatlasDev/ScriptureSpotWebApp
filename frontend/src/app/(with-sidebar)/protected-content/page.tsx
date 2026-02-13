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
