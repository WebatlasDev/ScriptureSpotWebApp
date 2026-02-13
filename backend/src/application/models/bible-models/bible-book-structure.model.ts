export interface BibleBookStructureModel {
  id: string;
  bookOverviewId?: string | null;
  order?: number | null;
  title?: string | null;
  description?: string | null;
  verses?: string | null;
  verseReferenceSlug?: string | null;
}
