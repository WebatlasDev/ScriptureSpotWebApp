import { LandingPageComponentModel } from './landing-page-component.model';

export interface LandingPageModel {
  id: string;
  slug?: string | null;
  referenceSlug?: string | null;
  header?: string | null;
  subheader?: string | null;
  metaKeywords?: string | null;
  metaDescription?: string | null;
  components?: LandingPageComponentModel[] | null;
}
