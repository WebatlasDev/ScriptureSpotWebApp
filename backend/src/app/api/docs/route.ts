/**
 * Complete OpenAPI 3.0 Specification Endpoint
 * Returns full API documentation with all 50+ endpoints
 */

import { NextResponse } from 'next/server';
import { openApiSpec } from '@/lib/openapi-spec';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
