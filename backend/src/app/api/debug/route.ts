export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'Environment Check',
    database_url_exists: !!process.env.DATABASE_URL,
    database_url_length: process.env.DATABASE_URL?.length || 0,
    database_url_preview: process.env.DATABASE_URL?.substring(0, 30) + '...',
    clerk_key_exists: !!process.env.CLERK_SECRET_KEY,
    node_env: process.env.NODE_ENV,
    all_env_keys: Object.keys(process.env).filter(key => 
      key.includes('DATABASE') || 
      key.includes('CLERK') || 
      key.includes('SUPABASE')
    )
  });
}
