/**
 * Email Service Interface
 */

export interface IEmailService {
  addContactAsync(
    email: string,
    firstName?: string | null,
    lastName?: string | null,
    audienceId?: string | null
  ): Promise<void>;

  sendTemplateEmailAsync(email: string, templateId: string): Promise<void>;

  unsubscribeAsync(email: string): Promise<void>;
}
