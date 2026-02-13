import { IRequest } from '@/lib/mediator';

export class CreateSubscriptionCommand implements IRequest<boolean> {
  email: string;
  form: string;
  url: string;

  constructor(data: { email: string; form: string; url: string }) {
    this.email = data.email;
    this.form = data.form;
    this.url = data.url;
  }
}
