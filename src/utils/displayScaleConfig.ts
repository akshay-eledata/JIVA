/**
 * Configuration for display scaling normalization
 * You can adjust these settings to customize the scaling behavior
 */
export const DISPLAY_SCALE_CONFIG = {
  /**
   * Enable/disable automatic scaling normalization
   * Set to false to disable the scaling feature
   */
  ENABLED: true,

  /**
   * Target scale to normalize to (1.0 = 100%)
   * You can adjust this if you want a different base scale
   */
  TARGET_SCALE: 1.0,

  /**
   * Minimum devicePixelRatio to consider for scaling
   * Values below this are considered 100% and won't be scaled
   */
  MIN_SCALE_RATIO: 1.1,

  /**
   * Maximum devicePixelRatio to apply scaling to
   * Values above this are considered high-DPI displays and won't be scaled
   * Set to null to disable this limit
   */
  MAX_SCALE_RATIO: 2.5,

  /**
   * Common Windows scaling ratios to detect
   * These are the typical values Windows uses for display scaling
   */
  COMMON_SCALING_RATIOS: [1.25, 1.5, 1.75, 2.0] as const,
} as const;

