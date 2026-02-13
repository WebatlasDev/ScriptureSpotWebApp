export interface IEmailService {
  addContact(email: string, signal?: AbortSignal): Promise<void>;
  sendTemplateEmail(
    email: string,
    template: string,
    signal?: AbortSignal
  ): Promise<void>;
  unsubscribe(email: string, signal?: AbortSignal): Promise<void>;
}
