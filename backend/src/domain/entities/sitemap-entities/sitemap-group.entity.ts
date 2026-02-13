import { SitemapEntry } from './sitemap-entry.entity';

export interface SitemapGroup {
  id: string;
  groupType: string;
  groupIdentifier: string;
  generatedAt: Date;

  // Navigation properties
  entries: SitemapEntry[];
}
