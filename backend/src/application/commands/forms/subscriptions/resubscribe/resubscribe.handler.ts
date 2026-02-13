import { IRequestHandler } from '@/lib/mediator';
import { ResubscribeCommand } from './resubscribe.command';
import { ResendEmailService } from '@/infrastructure/services/ResendEmailService';
import { DateTimeService } from '@/infrastructure/services/DateTimeService';
import { prisma } from '@/lib/prisma';

/**
 * Handler for ResubscribeCommand
 * Resubscribes an email address to the mailing list
 */
export class ResubscribeCommandHandler implements IRequestHandler<ResubscribeCommand, boolean> {
  constructor(
    private readonly emailService: ResendEmailService,
    private readonly dateTimeService: DateTimeService
  ) {}

  async handle(request: ResubscribeCommand): Promise<boolean> {
    if (!request.email || request.email.trim() === '') {
      throw new Error('Email cannot be empty');
    }

    // Add contact to email service
    await this.emailService.addContactAsync(request.email);

    // Update subscription record if exists
    const subscription = await prisma.subscriptions.findFirst({
      where: { Email: request.email },
    });

    if (subscription) {
      await prisma.subscriptions.update({
        where: { Id: subscription.Id },
        data: {
          ResubscribedDate: this.dateTimeService.now(),
        },
      });
    }

    return true;
  }
}
