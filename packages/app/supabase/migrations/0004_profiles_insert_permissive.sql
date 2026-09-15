-- Make INSERT policy more permissive to allow trigger to work
-- The trigger runs with postgres role, so we need to allow that

drop policy if exists "allow profile insert" on profiles;

-- Allow insert from any authenticated session and service role
-- This is needed for the signup trigger to create profiles
create policy "profiles insert public" on profiles
  for insert
  with check (true);
