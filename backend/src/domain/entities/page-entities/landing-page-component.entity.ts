import { LandingPage } from './landing-page.entity';

export interface LandingPageComponent {
  id: string;
  landingPageId: string;
  componentType?: string | null;
  entityId: string;
  order?: number | null;
  allowRandomOrder?: boolean | null;

  // Navigation properties
  landingPage?: LandingPage | null;
}
