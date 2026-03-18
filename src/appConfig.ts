/**
 * App-wide feature flags and configuration.
 * Toggle items here to enable/disable features across the app.
 */
export const appConfig = {
  /** Bypass all FeatureGate profile-completion checks */
  disableFeatureGates: true,
} as const;
