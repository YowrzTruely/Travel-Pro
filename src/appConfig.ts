/**
 * App-wide feature flags.
 * Flip these to control gating behavior across the app.
 */
export const appConfig = {
  /**
   * When true, suppliers can access every page without
   * onboarding completion, admin approval, or profile-stage gates.
   * Set to `false` to re-enable the normal permission flow.
   */
  supplierPermissionsUnlocked: true,
} as const;
