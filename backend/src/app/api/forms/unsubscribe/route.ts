import { NextRequest, NextResponse } from 'next/server';
import { UnsubscribeCommandHandler } from '@/application/commands/forms/subscriptions/unsubscribe/unsubscribe.handler';
import { UnsubscribeCommand } from '@/application/commands/forms/subscriptions/unsubscribe/unsubscribe.command';
import { ResendEmailService } from '@/infrastructure/services/ResendEmailService';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * POST /api/forms/unsubscribe
 * Unsubscribes an email from the mailing list
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const command = new UnsubscribeCommand(body.email);
    
    const emailService = new ResendEmailService();
    const handler = new UnsubscribeCommandHandler(emailService);
    const result = await handler.handle(command);
    
    return NextResponse.json({ success: result });
  } catch (error) {
    console.error('Error in POST /api/forms/unsubscribe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
