/** @jsxImportSource react */
import { type NextRequest } from 'next/server';
import agent from '@/app/api/agent';
import { slugToBookName } from '@/utils/stringHelpers';
import theme from '@/theme';
import {
  OG_CACHE_CONTROL_HEADER,
  OG_TIMEOUT_MS,
  generateOgImageWithRetry,
  getFallbackOgImageBuffer,
  withTimeout,
} from '@/utils/ogRouteHelpers';

export const runtime = 'nodejs';

export async function GET(req: NextRequest, context: any) {
  const { id, bookId, chapter, verseRange } = context.params;
  let author: any = null;

  try {
    const authors = await withTimeout(
      agent.Authors.listAuthors({}),
      OG_TIMEOUT_MS,
      'Author lookup timed out'
    );
    author = authors?.find((a: any) => a.slug === id) ?? null;
  } catch (error) {
    console.error('Failed to load authors for commentary OG image.', error);
  }

  const bookName = slugToBookName(bookId);
  const title = `${bookName} ${chapter}:${verseRange}`;
  const subtitle = author ? `${author.name}'s Commentary` : 'Commentary';
  const color = author?.colorScheme?.primary || theme.palette.secondary.main;
  const imageUrl = author?.image ? author.image.replace(/\\/g, '/') : undefined;

  try {
    const pngBuffer = await generateOgImageWithRetry({ title, subtitle, color, imageUrl });

    return new Response(pngBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': OG_CACHE_CONTROL_HEADER,
      },
    });
  } catch (error) {
    console.error('Failed to generate commentary OG image. Serving fallback.', error);
    return new Response(getFallbackOgImageBuffer(), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': OG_CACHE_CONTROL_HEADER,
      },
    });
  }
}
