import { NextRequest, NextResponse } from 'next/server';
import { CreateContactCommandHandler } from '@/application/commands/forms/contacts/create-contact/create-contact.handler';
import { CreateContactCommand } from '@/application/commands/forms/contacts/create-contact/create-contact.command';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * POST /api/forms/contact
 * Creates a contact message
 * Body: { name: string, email: string, message: string, targetEmail: string, subject?: string, reason?: string, url?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const command = new CreateContactCommand({
      name: body.name,
      email: body.email,
      message: body.message,
      targetEmail: body.targetEmail || 'admin@scripturespot.com',
      subject: body.subject || '',
      reason: body.reason || '',
      url: body.url || ''
    });
    
    const handler = new CreateContactCommandHandler();
    const result = await handler.handle(command);
    
    return NextResponse.json({ success: result });
  } catch (error) {
    console.error('Error in POST /api/forms/contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
