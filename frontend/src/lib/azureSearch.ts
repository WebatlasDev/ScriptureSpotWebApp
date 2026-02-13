import { env } from '@/types/env';

export interface SearchResults {
  verses: any[];
  commentaries: any[];
  authors: any[];
}

export async function performSearch(query: string): Promise<SearchResults> {
  const url = `${env.searchEndpoint}/indexes/scripturedocs/docs/search?api-version=2023-11-01`; // placeholder index
  const body = {
    search: query,
    facets: ['type'],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': env.searchApiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch search results');
  }

  const data = await response.json();
  const verses: any[] = [];
  const commentaries: any[] = [];
  const authors: any[] = [];

  for (const doc of data.value) {
    switch (doc.type) {
      case 'verse':
        verses.push(doc);
        break;
      case 'commentary':
        commentaries.push(doc);
        break;
      case 'author':
        authors.push(doc);
        break;
      default:
        break;
    }
  }

  return { verses, commentaries, authors };
}
