-- Migration: Simplify schema for boilerplate restructure
-- Remove onboardingCompleted field from users table
-- Remove notifications table (moved to examples)

ALTER TABLE "users" DROP COLUMN IF EXISTS "onboarding_completed";

DROP TABLE IF EXISTS "notifications";
