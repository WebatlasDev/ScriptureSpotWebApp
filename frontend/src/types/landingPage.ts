export interface LandingPageComponent {
  id: string
  landingPageId: string
  componentType: string
  entityId: string
  order?: number | null
  allowRandomOrder?: boolean | null
  landingPage?: LandingPage
}

export interface LandingPage {
  id: string
  slug?: string
  referenceSlug?: string
  header?: string
  subheader?: string
  metaKeywords?: string
  metaDescription?: string
  components?: LandingPageComponent[]
}
