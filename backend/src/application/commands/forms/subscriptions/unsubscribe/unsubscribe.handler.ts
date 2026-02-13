import { IRequestHandler } from '@/lib/mediator';
import { UnsubscribeCommand } from './unsubscribe.command';
import { prisma } from '@/lib/prisma';
import { IEmailService } from '@/application/common/interfaces/email-service.interface';

export class UnsubscribeCommandHandler
  implements IRequestHandler<UnsubscribeCommand, boolean>
{
  constructor(private emailService: IEmailService) {}

  async handle(
    request: UnsubscribeCommand,
    signal?: AbortSignal
  ): Promise<boolean> {
    if (!request.email || !request.email.trim()) {
      throw new Error('Email cannot be empty');
    }

    await this.emailService.unsubscribe(request.email, signal);

    const subscription = await prisma.subscriptions.findFirst({
      where: { Email: request.email },
    });

    if (subscription) {
      await prisma.subscriptions.update({
        where: { Id: subscription.Id },
        data: {
          UnsubscribedDate: new Date(),
        },
      });
    }

    return true;
  }
}
