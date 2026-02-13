import { useEffect } from "react"
import posthog from "posthog-js"

export function usePostHogUser(user?: { id: string, email: string, name?: string, role?: string }) {
  useEffect(() => {
    if (user?.id) {
      posthog.identify(user.id, {
        email: user.email,
        name: user.name,
        role: user.role,
      })
    }
  }, [user?.id, user?.email, user?.name, user?.role])
}
