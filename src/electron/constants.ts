// Domain constants used by the Electron main process.
// Mirrored in src/app/shared/constants.ts (renderer side) — keep the two
// values in sync. They are intentionally not a single shared module to
// avoid widening tsconfig.electron.json / tsconfig.app.json includes.

/**
 * Number of days from "now" within which a batch's `expiration_date` is
 * flagged as "near expiry" (used both in tables and in dashboard summaries).
 */
export const EXPIRY_WARNING_DAYS = 30;
