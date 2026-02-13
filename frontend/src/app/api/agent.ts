import { PaginatedResponse } from '@/types/pagination';
import { toast } from 'react-toastify';
import { env } from '@/types/env';
import { camelCaseKeys } from '@/utils/camelCaseKeys';

const baseUrl = env.api;


async function request<T = any>(
  method: string,
  url: string,
  body?: any,
  token?: string,
  isFormData = false,
  isRetry = false
): Promise<T> {
  const headers: Record<string, string> = {};

  if (!isFormData) headers['Content-Type'] = 'application/json';

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const targetUrl = url.startsWith('http') || url.startsWith('/')
    ? url
    : `${baseUrl}/${url}`;

  const response = await fetch(targetUrl, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  if (!response.ok) {
    let message = 'An unexpected error occurred.';
    try {
      const err = await response.json();
      message = err?.detail || message;
    } catch {}
  
    if (typeof window !== 'undefined') {
      switch (response.status) {
        case 400:
          toast.error(message);
          break;
        case 401:
          toast.error(message);
          break;
        case 403:
          toast.error(message);
          break;
        case 500:
          toast.error('Server error. Redirecting...');
          window.location.href = '/server-error';
          break;
        default:
          toast.error(message);
      }
    } else {
    }
  
    throw new Error(message);
  }
  

  const pagination = response.headers.get('pagination');
  const rawData = await response.json();
  const data = camelCaseKeys(rawData);

  if (pagination) {
    return new PaginatedResponse(data, JSON.parse(pagination)) as any;
  }

  return data;
}

const requests = {
  get: (url: string, params?: Record<string, any>, token?: string) => {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return request('GET', `${url}${queryString}`, undefined, token);
  },
  post: (url: string, body: any, token?: string) =>
    request('POST', url, body, token),
  put: (url: string, body: any, token?: string) =>
    request('PUT', url, body, token),
  delete: (url: string, body: any, token?: string) =>
    request('DELETE', url, body, token),
  postForm: (url: string, data: FormData, token?: string) =>
    request('POST', url, data, token, true),
  putForm: (url: string, data: FormData, token?: string) =>
    request('PUT', url, data, token, true),
};

const User = {
  listBookmarks: (token: string, data: any) =>
    requests.get('user/bookmarks', data, token),
  createBookmark: (token: string, data: any) =>
    requests.post('user/bookmark', data, token),
  deleteBookmark: (token: string, data: any) =>
    requests.delete('user/bookmark', data, token),
};

const Authors = {
  listAuthors: (data: any) =>
      requests.get('authors', data),
  listCommentariesByVerse: (data: any) =>
      requests.get('authors/commentaries/verse', data),
  listCommentariesByChapter: (data: any) =>
      requests.get('authors/commentaries/chapter', data),
  listCommentariesAvailability: (data: any) =>
      requests.post('authors/commentaries/availability', data),
  listCommentariesChapterAvailability: (data: any) =>
      requests.post('authors/commentaries/chapter/availability', data),
};

const Bible = {
  listBibleBooks: (data: any) =>
      requests.get('bible/books', data),
  getBibleBookOverview: (data: any) => 
      requests.get('bible/book/overview', data),
  listBibleChapters: (data: any) =>
      requests.get('bible/chapters', data),
  listBibleVerses: (data: any) =>
      requests.get('bible/verses', data),
  listBibleVerseRange: (data: any) =>
      requests.get('bible/verse/range', data),
  listBibleVersions: (data: any) =>
      requests.get('bible/versions', data),
  listBibleVersesVersions: (data: any) =>
      requests.get('bible/verses/versions', data),
  listBibleVerseCrossReferences: (data: any) =>
      requests.get('bible/verse/cross-references', data),
  getBibleVerseVersion: (data: any) =>
      requests.get('bible/verse/version', data),
  getBibleVerseTakeaways: (data: any) =>
      requests.get('bible/verse/takeaways', data),
};

const Exploration = {
    getInterlinearVerse: (data: any) =>
        requests.get('exploration/interlinear/verse', data),
    getLexiconEntry: (data: any) =>
        requests.get('exploration/lexicon/entry', data),
    getLexiconVerseReference: (data: any) => 
        requests.get('exploration/lexicon/verse/references', data),
    getLexiconVerseReferencePaginated: (data: any) => 
      requests.get('exploration/lexicon/verse/references', data),
}

const Forms = {
  subscribe: (data: any) => requests.post('forms/subscribe', data),
  contact: (data: any) => requests.post('forms/contact', data),
  unsubscribe: (data: any) => requests.post('forms/unsubscribe', data),
  resubscribe: (data: any) => requests.post('forms/resubscribe', data),
};

const Search = {
  listSearchResults: (data: any) =>
    requests.get('search', data),
};

const LandingPages = {
  getLandingPage: (data: any) =>
    requests.get('landing-pages', data),
};

const VerseOfTheDay = {
  getVerse: (data: any) =>
    requests.get('verse-of-the-day', data),
}

const agent = {
  User,
  Authors,
  Bible,
  Exploration,
  Forms,
  Search,
  LandingPages,
  VerseOfTheDay
};

export default agent;