import path from 'path';
import { readFileSync } from 'fs';
import { generateOgImage } from '@/utils/ogImageGenerator';

export const OG_TIMEOUT_MS = 4000;
export const OG_MAX_ATTEMPTS = 2;
export const OG_CACHE_CONTROL_HEADER = 'public, max-age=31536000, immutable';

const FALLBACK_IMAGE_PATH = path.resolve(
  process.cwd(),
  'public/assets/images/logos/Scripture-Spot-Logo.png'
);

let fallbackBuffer: Buffer | null = null;

function getFallbackBuffer(): Buffer {
  if (!fallbackBuffer) {
    fallbackBuffer = readFileSync(FALLBACK_IMAGE_PATH);
  }
  return fallbackBuffer;
}

export function getFallbackOgImageBuffer(): Buffer {
  try {
    return getFallbackBuffer();
  } catch (error) {
    console.error('Failed to load OG fallback image from disk.', error);
    return Buffer.alloc(0);
  }
}

export function withTimeout<T>(promise: Promise<T>, ms: number, timeoutMessage: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, ms);

    promise
      .then(result => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

type OgImageOptions = Parameters<typeof generateOgImage>[0];

export async function generateOgImageWithRetry(options: OgImageOptions) {
  let lastError: unknown;

  for (let attempt = 0; attempt < OG_MAX_ATTEMPTS; attempt++) {
    try {
      return await withTimeout(
        generateOgImage(options),
        OG_TIMEOUT_MS,
        'OG image generation timed out'
      );
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error('Failed to generate OG image');
}
