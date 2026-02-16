/**
 * List Authors Query Handler
 */

import { ListAuthorsQuery, ListAuthorsQueryResponse } from './list-authors.query';
import { AuthorModel } from '@/application/models/author-models/author.model';
import { AuthorColorSchemeModel } from '@/application/models/author-models/author-color-scheme.model';
import { prisma } from '@/lib/prisma';

export class ListAuthorsQueryHandler {
  async handle(query: ListAuthorsQuery): Promise<ListAuthorsQueryResponse> {
    const authors = await prisma.authors.findMany({
      orderBy: {
        Name: 'asc',
      },
    });

    const result: AuthorModel[] = [];

    for (const author of authors) {
      const mappedAuthor: AuthorModel = {
        id: author.Id,
        name: author.Name ?? undefined,
        slug: author.Slug ?? undefined,
        biography: author.Biography ?? undefined,
        image: author.Image ?? undefined,
        fullResImage: author.FullResImage ?? undefined,
        updatedDate: author.UpdatedDate ?? undefined,
        isBook: author.IsBook,
        birthYear: author.BirthYear ?? undefined,
        deathYear: author.DeathYear ?? undefined,
        nationality: author.Nationality ?? undefined,
        occupation: author.Occupation ?? undefined,
        religiousTradition: author.ReligiousTradition ?? undefined,
        nicknameOrTitle: author.NicknameOrTitle ?? undefined,
        sermonsPreached: author.SermonsPreached ?? undefined,
        booksWritten: author.BooksWritten ?? undefined,
        readingLevel: author.ReadingLevel ?? undefined,
        colorScheme: undefined,
      };

      if (author.Colors) {
        try {
          const colorScheme = JSON.parse(author.Colors) as AuthorColorSchemeModel;
          mappedAuthor.colorScheme = colorScheme;
        } catch (error) {
          throw new Error(`Failed to parse color scheme for author ${author.Name}: ${error}`);
        }
      }

      result.push(mappedAuthor);
    }

    return result.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
  }
}
