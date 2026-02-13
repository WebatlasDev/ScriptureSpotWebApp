import { NextRequest, NextResponse } from 'next/server';
import { ResubscribeCommandHandler } from '@/application/commands/forms/subscriptions/resubscribe/resubscribe.handler';
import { ResubscribeCommand } from '@/application/commands/forms/subscriptions/resubscribe/resubscribe.command';
import { ResendEmailService } from '@/infrastructure/services/ResendEmailService';
import { DateTimeService } from '@/infrastructure/services/DateTimeService';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * POST /api/forms/resubscribe
 * Resubscribes an email to the mailing list
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const command = new ResubscribeCommand();
    command.email = body.email;
    
    const dateTimeService = new DateTimeService();
    const emailService = new ResendEmailService();
    const handler = new ResubscribeCommandHandler(emailService, dateTimeService);
    const result = await handler.handle(command);
    
    return NextResponse.json({ success: result });
  } catch (error) {
    console.error('Error in POST /api/forms/resubscribe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
