-- Fix infinite recursion in user_profiles RLS policy.
-- The old policy references user_profiles inside its own SELECT policy,
-- causing PostgreSQL to re-evaluate the same policy in a loop.
--
-- Solution: use a SECURITY DEFINER function to get the user's org_id
-- without triggering RLS.

-- 1. Create helper function (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_my_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id FROM public.user_profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- 2. Drop the recursive policy
DROP POLICY IF EXISTS "Users can view profiles in their org or their own" ON public.user_profiles;

-- 3. Create fixed policy using the helper function
CREATE POLICY "Users can view own profile or org profiles"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR org_id = public.get_my_org_id()
  );
