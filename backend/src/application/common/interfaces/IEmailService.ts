/**
 * Interface for email service operations
 * Provides email functionality for user communication
 */
export interface IEmailService {
  /**
   * Adds a contact to the email audience
   * @param email The contact's email address
   * @param firstName Optional first name
   * @param lastName Optional last name
   * @param audienceId Optional audience ID (uses default if not provided)
   * @returns Promise that resolves when contact is added
   */
  addContactAsync(
    email: string,
    firstName?: string | null,
    lastName?: string | null,
    audienceId?: string | null
  ): Promise<void>;

  /**
   * Sends a template-based email to a recipient
   * @param email The recipient's email address
   * @param templateId The template identifier (currently uses welcome template)
   * @returns Promise that resolves when email is sent
   */
  sendTemplateEmailAsync(email: string, templateId: string): Promise<void>;

  /**
   * Unsubscribes a contact from the email audience
   * @param email The contact's email address
   * @returns Promise that resolves when contact is unsubscribed
   */
  unsubscribeAsync(email: string): Promise<void>;
}
