/** @jsxImportSource react */
import { type NextRequest } from 'next/server';
import { slugToBookName } from '@/utils/stringHelpers';
import {
  OG_CACHE_CONTROL_HEADER,
  generateOgImageWithRetry,
  getFallbackOgImageBuffer,
} from '@/utils/ogRouteHelpers';

export const runtime = 'nodejs';

export async function GET(req: NextRequest, context: any) {
  const { version, book, chapter, verse } = context.params;
  const reference = `${slugToBookName(book)} ${chapter}:${verse}`;
  const subtitle = 'Explore commentaries and insights';
  const footerRight = typeof version === 'string' ? version.toUpperCase() : String(version).toUpperCase();

  try {
    const pngBuffer = await generateOgImageWithRetry({
      title: reference,
      subtitle,
      footerRight,
    });

    return new Response(pngBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': OG_CACHE_CONTROL_HEADER,
      },
    });
  } catch (error) {
    console.error('Failed to generate verse OG image. Serving fallback.', error);
    return new Response(getFallbackOgImageBuffer(), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': OG_CACHE_CONTROL_HEADER,
      },
    });
  }
}
