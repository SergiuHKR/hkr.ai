-- Remove streaks (deprecated feature)
-- Drop the streaks table entirely
DROP TABLE IF EXISTS streaks CASCADE;

-- Remove streak columns from user_profiles
ALTER TABLE user_profiles DROP COLUMN IF EXISTS current_streak;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS longest_streak;

-- Remove streak-based achievement seed data (On Fire + Unstoppable)
DELETE FROM achievements WHERE criteria_type = 'streak';
