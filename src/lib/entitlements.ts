/**
 * Mentora Entitlements & Tier Logic
 * Handles Free, Plus, and Pro feature access rules.
 */

export type SubscriptionTier = 'free' | 'plus' | 'pro';

export interface UserEntitlements {
  tier: SubscriptionTier;
  canAccessRecordedSessions: boolean;
  canAccessDeepInsights: boolean;
  canRegenerateJourney: boolean;
  maxActiveJourneys: number;
}

export function getEntitlements(tier: SubscriptionTier = 'free'): UserEntitlements {
  switch (tier) {
    case 'pro':
      return {
        tier: 'pro',
        canAccessRecordedSessions: true,
        canAccessDeepInsights: true,
        canRegenerateJourney: true,
        maxActiveJourneys: 10,
      };
    case 'plus':
      return {
        tier: 'plus',
        canAccessRecordedSessions: true,
        canAccessDeepInsights: false,
        canRegenerateJourney: true,
        maxActiveJourneys: 3,
      };
    case 'free':
    default:
      return {
        tier: 'free',
        canAccessRecordedSessions: false,
        canAccessDeepInsights: false,
        canRegenerateJourney: false,
        maxActiveJourneys: 1,
      };
  }
}
