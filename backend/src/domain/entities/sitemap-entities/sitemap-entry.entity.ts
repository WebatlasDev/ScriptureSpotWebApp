import { SitemapGroup } from './sitemap-group.entity';

export interface SitemapEntry {
  id: string;
  sitemapGroupId: string;
  loc?: string | null;
  title?: string | null;
  createdAt: Date;

  // Navigation properties
  group?: SitemapGroup | null;
}
