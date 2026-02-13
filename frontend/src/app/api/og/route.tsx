/** @jsxImportSource react */
import { NextRequest } from 'next/server';
import {
  OG_CACHE_CONTROL_HEADER,
  generateOgImageWithRetry,
  getFallbackOgImageBuffer,
} from '@/utils/ogRouteHelpers';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Scripture Spot';
  const subtitle = searchParams.get('subtitle') || undefined;
  const footer = searchParams.get('footer') || undefined;
  const color = searchParams.get('color') || undefined;
  const imageUrl = searchParams.get('imageUrl') || undefined;

  try {
    const pngBuffer = await generateOgImageWithRetry({
      title: decodeURIComponent(title),
      subtitle: subtitle ? decodeURIComponent(subtitle) : undefined,
      footerRight: footer ? decodeURIComponent(footer) : undefined,
      color: color || undefined,
      imageUrl: imageUrl || undefined,
    });

    return new Response(pngBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': OG_CACHE_CONTROL_HEADER,
      },
    });
  } catch (error) {
    console.error('Failed to generate OG image. Serving fallback.', error);
    return new Response(getFallbackOgImageBuffer(), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': OG_CACHE_CONTROL_HEADER,
      },
    });
  }
}
