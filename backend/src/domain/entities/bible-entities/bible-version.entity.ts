export interface BibleVersion {
  id: string;
  name?: string | null;
  abbreviation?: string | null;
  language?: string | null;
  copyright?: string | null;
  license?: string | null;
  description?: string | null;
  contributors?: string | null;
  publishYear?: string | null;
  publisher?: string | null;
  source?: string | null;
}
