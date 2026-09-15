-- Add INSERT policy to profiles table to fix signup trigger
-- The trigger needs permission to insert profiles when users sign up

-- Remove the old policies if they exist and re-add with proper permissions
drop policy if exists "allow profile insert" on profiles;
drop policy if exists "users can insert own profile" on profiles;

-- System (trigger) can insert profiles; users can insert their own
create policy "allow profile insert" on profiles
  for insert
  to authenticated, service_role
  with check (true);
