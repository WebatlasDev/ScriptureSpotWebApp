"use client"

import Script from "next/script"
import {
  createContext,
  useContext,
  useState,
  useEffect,
  Suspense,
} from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { env } from "@/types/env"

type PostHogClient = {
  capture: (event: string, properties?: Record<string, any>) => void
  init: (apiKey: string, options: Record<string, any>) => void
  __loaded?: boolean
}

const PostHogContext = createContext<PostHogClient | null>(null)

export const usePostHog = () => useContext(PostHogContext)

const isProd =
  typeof window !== "undefined" && window.location.hostname === "www.scripturespot.com"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [posthog, setPosthog] = useState<PostHogClient | null>(null)

  const handleLoad = () => {
    const ph = (window as any).posthog as PostHogClient | undefined
    if (ph && !ph.__loaded) {
      ph.init(env.posthog, {
        api_host: "https://us.posthog.com",
        ui_host: "https://us.posthog.com",
        capture_pageview: false,
        capture_pageleave: true,
        debug: process.env.NODE_ENV === "development",
      })
    }
    if (ph) {
      setPosthog(ph)
    }
  }

  return (
    <PostHogContext.Provider value={posthog}>
      {isProd && (
        <Script src="/ingest/static/array.js" strategy="afterInteractive" onLoad={handleLoad} />
      )}
      <SuspendedPostHogPageView />
      {children}
    </PostHogContext.Provider>
  )
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthogClient = usePostHog()

  useEffect(() => {
    if (pathname && posthogClient) {
      let url = window.origin + pathname
      const search = searchParams.toString()
      if (search) {
        url += "?" + search
      }
      posthogClient.capture("$pageview", { $current_url: url })
    }
  }, [pathname, searchParams, posthogClient])

  return null
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}
