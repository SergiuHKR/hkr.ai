-- Drop tier column from courses table
-- Difficulty/category info will be conveyed via tags instead
ALTER TABLE courses DROP COLUMN IF EXISTS tier;
