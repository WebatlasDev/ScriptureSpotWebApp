/**
 * User Feature Service Interface
 * Defines contract for retrieving user features from authentication provider
 */
export interface IUserFeatureService {
  /**
   * Gets all features available to a user
   * Features are retrieved from user metadata, organization memberships, and billing subscriptions
   * @param userId - The user ID to get features for (null/undefined returns empty set)
   * @returns Set of feature names (e.g., "search_advanced", "25_qr_codes", "member")
   */
  getFeaturesForUserAsync(userId: string | null | undefined): Promise<Set<string>>;
}
