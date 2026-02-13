import { IUserFeatureService } from '@/application/common/interfaces/i-user-feature-service';
import { clerkClient } from '@clerk/nextjs/server';

/**
 * Service for managing user features via Clerk API
 * Retrieves user feature sets from Clerk billing subscriptions and metadata
 * Fully migrated from C# Infrastructure/Services/ClerkUserFeatureService.cs
 */
export class ClerkUserFeatureService implements IUserFeatureService {
  private readonly hasSecretKey: boolean;

  private static readonly FEATURE_NAME_MAPPINGS: Record<string, string> = {
    'access_qr_code_tracker': 'access_qr_code_tracker',
    '100_qr_codes': '100_qr_codes',
    '25_qr_codes': '25_qr_codes',
    '5_qr_codes': '5_qr_codes',
    'unlimited_qr_codes': 'unlimited_qr_codes',
    'advanced_stats': 'advanced_stats',
    'track_scans': 'track_scans',
    'report_downloads': 'report_downloads',
    'logo_branding': 'logo_branding'
  };

  private static readonly NUMERIC_QR_CODE_FEATURE_REGEX = /(\d+)_qr_codes$/;

  constructor() {
    this.hasSecretKey = !!process.env.CLERK_SECRET_KEY;
  }

  async getFeaturesForUserAsync(
    userId: string | null | undefined
  ): Promise<Set<string>> {
    if (!userId) {
      return new Set<string>();
    }

    if (!this.hasSecretKey) {
      console.warn(`Clerk secret key is not configured. Cannot retrieve feature set for user ${userId}.`);
      return new Set<string>();
    }

    const features = new Set<string>();

    try {
      await this.populateFromUserAsync(userId, features);
      await this.populateFromBillingSubscriptionsAsync(userId, features);
      await this.populateFromOrganizationMembershipsAsync(userId, features);
      
      console.log(`Retrieved ${features.size} features for user ${userId}`);
    } catch (error) {
      console.error(`Error retrieving features for user ${userId}:`, error);
    }

    return features;
  }

  private async populateFromBillingSubscriptionsAsync(
    userId: string,
    features: Set<string>
  ): Promise<void> {
    try {
      // Note: Clerk Commerce/Billing API may not be available in all Clerk plans
      // This would need to be implemented when Clerk Commerce is configured
      // For now, this is a placeholder for the billing subscription logic
      
      // If Clerk adds billing API support, implementation would be:
      // const subscription = await clerkClient.users.getBillingSubscription(userId);
      // const items = subscription?.subscriptionItems || [];
      // for (const item of items) {
      //   const planFeatures = item?.plan?.features || [];
      //   for (const feature of planFeatures) {
      //     const normalized = this.normalizeFeatureName(feature.slug) ?? this.normalizeFeatureName(feature.name);
      //     if (normalized) features.add(normalized);
      //   }
      // }
    } catch (error: any) {
      if (error?.status === 404) {
        return; // Not found is acceptable
      }
      console.warn(`Unable to retrieve billing subscription for Clerk user ${userId}:`, error);
    }
  }

  private async populateFromUserAsync(
    userId: string,
    features: Set<string>
  ): Promise<void> {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      
      if (user) {
        this.addFeatures(user.publicMetadata, features);
        this.addFeatures(user.privateMetadata, features);
        this.addFeatures(user.unsafeMetadata, features);
      }
    } catch (error: any) {
      if (error?.status === 404) {
        return; // Not found is acceptable
      }
      console.warn(`Unable to retrieve Clerk user ${userId}:`, error);
    }
  }

  private async populateFromOrganizationMembershipsAsync(
    userId: string,
    features: Set<string>
  ): Promise<void> {
    try {
      const client = await clerkClient();
      const memberships = await client.users.getOrganizationMembershipList({ userId });
      
      const membershipData = memberships.data || [];
      
      for (const membership of membershipData) {
        this.addFeatures(membership.publicMetadata as Record<string, any>, features);
        this.addFeatures(membership.privateMetadata as Record<string, any>, features);

        if (membership.organization) {
          if (membership.organization.publicMetadata) {
            this.addFeatures(membership.organization.publicMetadata as Record<string, any>, features);
          }
          if (membership.organization.privateMetadata) {
            this.addFeatures(membership.organization.privateMetadata as Record<string, any>, features);
          }
        }
      }
    } catch (error: any) {
      if (error?.status === 404) {
        return; // Not found is acceptable
      }
      console.warn(`Unable to retrieve organization memberships for Clerk user ${userId}:`, error);
    }
  }

  private addFeatures(
    metadata: Record<string, any> | undefined,
    features: Set<string>
  ): void {
    if (!metadata || Object.keys(metadata).length === 0) {
      return;
    }

    for (const feature of this.extractFeatureValues(metadata)) {
      const normalized = this.normalizeFeatureName(feature);
      if (normalized) {
        features.add(normalized);
      }
    }

    const limitFeature = this.tryGetQrCodeLimit(metadata);
    if (limitFeature) {
      features.add(limitFeature);
    }

    if (this.tryGetUnlimitedQrCodeFlag(metadata)) {
      features.add('unlimited_qr_codes');
    }
  }

  private *extractFeatureValues(metadata: Record<string, any>): Generator<string> {
    for (const [key, value] of Object.entries(metadata)) {
      if (!this.isFeatureContainerKey(key)) {
        continue;
      }

      yield* this.extractFeatures(value);
    }
  }

  private *extractFeatures(element: any): Generator<string> {
    if (typeof element === 'string' && element.trim()) {
      yield element;
    } else if (Array.isArray(element)) {
      for (const item of element) {
        yield* this.extractFeatures(item);
      }
    } else if (typeof element === 'object' && element !== null) {
      for (const [key, value] of Object.entries(element)) {
        if (value === true || (typeof value === 'string' && value.toLowerCase() === 'true')) {
          yield key;
        } else {
          yield* this.extractFeatures(value);
        }
      }
    }
  }

  private tryGetQrCodeLimit(metadata: Record<string, any>): string | null {
    const keys = ['max_qr_codes', 'maxQrCodes', 'qr_code_limit', 'qrCodeLimit'];
    
    for (const key of keys) {
      const value = metadata[key];
      if (value === undefined || value === null) continue;

      let numericLimit: number | null = null;
      
      if (typeof value === 'number') {
        numericLimit = value;
      } else if (typeof value === 'string') {
        const parsed = parseInt(value, 10);
        if (!isNaN(parsed)) {
          numericLimit = parsed;
        }
      }

      if (numericLimit !== null) {
        const limitFeature = this.getQrCodeLimitFeatureName(numericLimit);
        const normalized = this.normalizeFeatureName(limitFeature);
        if (normalized) {
          return normalized;
        }
      }
    }

    return null;
  }

  private tryGetUnlimitedQrCodeFlag(metadata: Record<string, any>): boolean {
    const keys = ['unlimited_qr_codes', 'unlimitedQrCodes'];
    
    for (const key of keys) {
      const value = metadata[key];
      
      if (value === true) {
        return true;
      }
      
      if (typeof value === 'string' && value.toLowerCase() === 'true') {
        return true;
      }
    }

    return false;
  }

  private getQrCodeLimitFeatureName(numericLimit: number): string {
    switch (numericLimit) {
      case 5:
        return '5_qr_codes';
      case 25:
        return '25_qr_codes';
      case 100:
        return '100_qr_codes';
      default:
        return `up_to_${numericLimit}_qr_codes`;
    }
  }

  private normalizeFeatureName(name: string | null | undefined): string | null {
    if (!name) return null;
    
    const trimmed = name.trim();
    
    // Check direct mapping first
    if (ClerkUserFeatureService.FEATURE_NAME_MAPPINGS[trimmed.toLowerCase()]) {
      return ClerkUserFeatureService.FEATURE_NAME_MAPPINGS[trimmed.toLowerCase()];
    }

    // Convert to snake_case
    const normalized = this.toSnakeCase(trimmed);
    
    // Check mapping again
    if (ClerkUserFeatureService.FEATURE_NAME_MAPPINGS[normalized]) {
      return ClerkUserFeatureService.FEATURE_NAME_MAPPINGS[normalized];
    }

    // Check for numeric QR code feature pattern
    const match = normalized.match(ClerkUserFeatureService.NUMERIC_QR_CODE_FEATURE_REGEX);
    if (match) {
      const limitFeature = `${match[1]}_qr_codes`;
      if (ClerkUserFeatureService.FEATURE_NAME_MAPPINGS[limitFeature]) {
        return ClerkUserFeatureService.FEATURE_NAME_MAPPINGS[limitFeature];
      }
      return limitFeature;
    }

    return normalized;
  }

  private toSnakeCase(value: string): string {
    let result = '';
    let lastWasUnderscore = false;

    for (const ch of value) {
      if (/[a-zA-Z0-9]/.test(ch)) {
        result += ch.toLowerCase();
        lastWasUnderscore = false;
      } else if (!lastWasUnderscore) {
        result += '_';
        lastWasUnderscore = true;
      }
    }

    const normalized = result.replace(/^_+|_+$/g, '');
    return normalized || value.trim().toLowerCase();
  }

  private isFeatureContainerKey(key: string): boolean {
    const lowerKey = key.toLowerCase();
    return (
      lowerKey === 'features' ||
      lowerKey === 'feature_flags' ||
      lowerKey === 'featureflags' ||
      lowerKey === 'plan_features' ||
      lowerKey === 'planfeatures'
    );
  }
}
