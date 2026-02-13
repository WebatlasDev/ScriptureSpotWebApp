import { IRequestHandler } from '@/lib/mediator';
import { CreateSubscriptionCommand } from './create-subscription.command';
import { prisma } from '@/lib/prisma';
import { IEmailService } from '@/application/common/interfaces/email-service.interface';

export class CreateSubscriptionCommandHandler
  implements IRequestHandler<CreateSubscriptionCommand, boolean>
{
  constructor(private emailService: IEmailService) {}

  async handle(
    request: CreateSubscriptionCommand,
    signal?: AbortSignal
  ): Promise<boolean> {
    if (!request.email) {
      throw new Error('Email cannot be empty');
    }

    const email = request.email.toLowerCase().trim();

    const existing = await prisma.subscriptions.findFirst({
      where: {
        Email: email,
        Form: request.form,
      },
    });

    if (existing) {
      if (existing.UnsubscribedDate) {
        await prisma.subscriptions.update({
          where: { Id: existing.Id },
          data: {
            ResubscribedDate: new Date(),
          },
        });

        await this.emailService.addContact(email, signal);
        await this.emailService.sendTemplateEmail(email, '', signal);
        return true;
      }

      throw new Error('Email already signed up for this list');
    }

    await prisma.subscriptions.create({
      data: {
        Id: crypto.randomUUID(),
        Email: email,
        Form: request.form,
        Url: request.url,
        CreatedDate: new Date(),
      },
    });

    await this.emailService.addContact(email, signal);
    await this.emailService.sendTemplateEmail(email, '', signal);

    return true;
  }
}
