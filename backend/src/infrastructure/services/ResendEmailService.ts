import { Resend } from 'resend';
import { IEmailService } from '@/application/common/interfaces/email-service.interface';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Settings for Resend email service
 */
export interface ResendSettings {
  apiKey: string;
  audienceId?: string;
  welcomeTemplateId?: string;
  fromEmail: string;
  welcomeHtml?: string;
  welcomeHtmlPath?: string;
  unsubscribeUrl?: string;
}

/**
 * Resend email service implementation
 * Provides email functionality using Resend API
 */
export class ResendEmailService implements IEmailService {
  private readonly resend: Resend;
  private readonly settings: ResendSettings;

  constructor(settings?: Partial<ResendSettings>) {
    this.settings = {
      apiKey: settings?.apiKey || process.env.RESEND_API_KEY || '',
      audienceId: settings?.audienceId || process.env.RESEND_AUDIENCE_ID,
      fromEmail: settings?.fromEmail || process.env.RESEND_FROM_EMAIL || 'noreply@scripturespot.com',
      welcomeHtmlPath: settings?.welcomeHtmlPath || 'src/infrastructure/email-templates/welcome-template.html',
      unsubscribeUrl: settings?.unsubscribeUrl || process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe` : undefined,
    };

    this.resend = new Resend(this.settings.apiKey);

    // Load welcome HTML template if path is provided
    if (!this.settings.welcomeHtml && this.settings.welcomeHtmlPath) {
      try {
        const templatePath = path.resolve(process.cwd(), this.settings.welcomeHtmlPath);
        if (fs.existsSync(templatePath)) {
          this.settings.welcomeHtml = fs.readFileSync(templatePath, 'utf-8');
        }
      } catch (error) {
        console.error('Failed to load welcome email template:', error);
      }
    }
  }

  /**
   * Adds a contact to the email audience
   * @param email The contact's email address
   * @param firstName Optional first name
   * @param lastName Optional last name
   * @param audienceId Optional audience ID (uses default if not provided)
   */
  async addContactAsync(
    email: string,
    firstName?: string | null,
    lastName?: string | null,
    audienceId?: string | null
  ): Promise<void> {
    const targetAudienceId = audienceId || this.settings.audienceId;
    
    if (!targetAudienceId) {
      console.warn('No audience ID configured, skipping contact addition');
      return;
    }

    try {
      await this.resend.contacts.create({
        email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        unsubscribed: false,
        audienceId: targetAudienceId,
      });

      console.log(`Successfully added contact: ${email}`);
    } catch (error) {
      console.error('Failed to add contact:', error);
      // Don't throw - email failures should not break the application flow
    }
  }

  /**
   * Sends a template-based email to a recipient
   * Currently sends the welcome email template
   * @param email The recipient's email address
   * @param templateId The template identifier (reserved for future use)
   */
  async sendTemplateEmailAsync(email: string, templateId: string): Promise<void> {
    try {
      let htmlBody = this.settings.welcomeHtml || '<p>Welcome to Scripture Spot!</p>';

      // Replace unsubscribe URL placeholder if configured
      if (this.settings.unsubscribeUrl) {
        htmlBody = htmlBody.replace(/{{UnsubscribeUrl}}/g, this.settings.unsubscribeUrl);
      }

      const emailData: any = {
        from: this.settings.fromEmail,
        to: email,
        subject: 'Welcome to Scripture Spot',
        html: htmlBody,
      };

      // Add unsubscribe headers if URL is configured
      if (this.settings.unsubscribeUrl) {
        emailData.headers = {
          'List-Unsubscribe': `<${this.settings.unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        };
      }

      await this.resend.emails.send(emailData);

      console.log(`Successfully sent welcome email to: ${email}`);
    } catch (error) {
      console.error('Failed to send template email:', error);
      // Don't throw - email failures should not break the application flow
    }
  }

  /**
   * Unsubscribes a contact from the email audience
   * @param email The contact's email address
   */
  async unsubscribeAsync(email: string): Promise<void> {
    if (!this.settings.audienceId) {
      console.warn('No audience ID configured, skipping unsubscribe');
      return;
    }

    try {
      await this.resend.contacts.update({
        audienceId: this.settings.audienceId,
        email,
        unsubscribed: true,
      });

      console.log(`Successfully unsubscribed contact: ${email}`);
    } catch (error) {
      console.error('Failed to unsubscribe contact:', error);
      // Don't throw - email failures should not break the application flow
    }
  }

  // IEmailService interface implementations (wrapper methods)
  async addContact(email: string, signal?: AbortSignal): Promise<void> {
    return this.addContactAsync(email);
  }

  async sendTemplateEmail(email: string, template: string, signal?: AbortSignal): Promise<void> {
    return this.sendTemplateEmailAsync(email, template);
  }

  async unsubscribe(email: string, signal?: AbortSignal): Promise<void> {
    return this.unsubscribeAsync(email);
  }
}

// Singleton instance
let emailServiceInstance: ResendEmailService | null = null;

export function getEmailService(settings?: Partial<ResendSettings>): ResendEmailService {
  if (!emailServiceInstance) {
    emailServiceInstance = new ResendEmailService(settings);
  }
  return emailServiceInstance;
}

export const resendEmailService = getEmailService();
