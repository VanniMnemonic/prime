// Domain constants used by the Angular renderer.
// Mirrored in src/electron/constants.ts (main process) — keep the two
// values in sync.

/**
 * Number of days from "now" within which a batch's `expiration_date` is
 * flagged as "near expiry" (used both in tables and in dashboard summaries).
 */
export const EXPIRY_WARNING_DAYS = 30;
