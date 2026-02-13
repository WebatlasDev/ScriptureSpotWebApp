import { LandingPageComponent } from './landing-page-component.entity';

export interface LandingPage {
  id: string;
  slug?: string | null;
  referenceSlug?: string | null;
  header?: string | null;
  subheader?: string | null;
  metaKeywords?: string | null;
  metaDescription?: string | null;

  // Navigation properties
  components?: LandingPageComponent[] | null;
}
