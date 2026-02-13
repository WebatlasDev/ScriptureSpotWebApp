import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function GET(req: NextRequest) {
  return new NextResponse('google.com, pub-5189192546187755, DIRECT, f08c47fec0942fa0', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
