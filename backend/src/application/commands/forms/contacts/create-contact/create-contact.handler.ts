import { IRequestHandler } from '@/lib/mediator';
import { CreateContactCommand } from './create-contact.command';
import { prisma } from '@/lib/prisma';

export class CreateContactCommandHandler
  implements IRequestHandler<CreateContactCommand, boolean>
{
  async handle(
    request: CreateContactCommand,
    signal?: AbortSignal
  ): Promise<boolean> {
    await prisma.contacts.create({
      data: {
        Id: crypto.randomUUID(),
        UserId: null,
        Name: request.name,
        Email: request.email,
        Subject: request.subject,
        Reason: request.reason,
        Message: request.message,
        TargetEmail: request.targetEmail,
        Url: request.url,
        CreatedDate: new Date(),
      },
    });

    return true;
  }
}
