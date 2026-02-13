export interface LandingPageComponentModel {
  id: string;
  landingPageId: string;
  componentType?: string | null;
  entityId: string;
  order: number;
  allowRandomOrder: boolean;
  data?: any | null;
}
