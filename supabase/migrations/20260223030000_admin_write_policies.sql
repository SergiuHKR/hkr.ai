-- Admin write policies for courses, modules, lessons, user_profiles
-- Required for admin panel CRUD operations (Phase 9)

-- ─── Courses ────────────────────────────────────────────────────────────────

CREATE POLICY "courses_admin_write" ON courses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.system_role IN ('super_admin', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.system_role IN ('super_admin', 'admin')
    )
  );

-- ─── Modules ────────────────────────────────────────────────────────────────

CREATE POLICY "modules_admin_write" ON modules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.system_role IN ('super_admin', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.system_role IN ('super_admin', 'admin')
    )
  );

-- ─── Lessons ────────────────────────────────────────────────────────────────

CREATE POLICY "lessons_admin_write" ON lessons
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.system_role IN ('super_admin', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.system_role IN ('super_admin', 'admin')
    )
  );

-- ─── User Profiles (admin management) ──────────────────────────────────────
-- Allows admins to update other users' profiles (role, team, org assignments)
-- Does NOT allow admins to INSERT or DELETE profiles (those are handled by triggers)

CREATE POLICY "user_profiles_admin_update" ON user_profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles AS admin_profile
      WHERE admin_profile.user_id = auth.uid()
      AND admin_profile.system_role IN ('super_admin', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles AS admin_profile
      WHERE admin_profile.user_id = auth.uid()
      AND admin_profile.system_role IN ('super_admin', 'admin')
    )
  );
