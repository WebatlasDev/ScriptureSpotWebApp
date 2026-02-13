import { IRequest } from '@/lib/mediator';

export class CreateContactCommand implements IRequest<boolean> {
  name: string;
  email: string;
  subject: string;
  reason: string;
  message: string;
  targetEmail: string;
  url: string;

  constructor(data: {
    name: string;
    email: string;
    subject: string;
    reason: string;
    message: string;
    targetEmail: string;
    url: string;
  }) {
    this.name = data.name;
    this.email = data.email;
    this.subject = data.subject;
    this.reason = data.reason;
    this.message = data.message;
    this.targetEmail = data.targetEmail;
    this.url = data.url;
  }
}
