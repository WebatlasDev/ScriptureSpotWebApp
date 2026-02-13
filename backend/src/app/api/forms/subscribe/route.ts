import { NextRequest, NextResponse } from 'next/server';
import { CreateSubscriptionCommandHandler } from '@/application/commands/forms/subscriptions/subscribe/create-subscription.handler';
import { CreateSubscriptionCommand } from '@/application/commands/forms/subscriptions/subscribe/create-subscription.command';
import { ResendEmailService } from '@/infrastructure/services/ResendEmailService';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * POST /api/forms/subscribe
 * Creates a new email subscription
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const command = new CreateSubscriptionCommand({
      email: body.email,
      form: body.form || '',
      url: body.url || ''
    });
    
    const emailService = new ResendEmailService();
    const handler = new CreateSubscriptionCommandHandler(emailService);
    const result = await handler.handle(command);
    
    return NextResponse.json({ success: result });
  } catch (error) {
    console.error('Error in POST /api/forms/subscribe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
