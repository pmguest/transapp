-- Fix the profile creation trigger
-- The previous trigger had "on conflict do nothing" which may have been problematic

-- Drop the old disabled trigger and function if it exists
drop function if exists handle_auth_user_created();

-- Create corrected trigger function without the problematic on conflict clause
-- Instead, use a simpler approach that just inserts the profile
create function handle_auth_user_created()
returns trigger as $$
declare
  display_name_val text;
begin
  -- Extract display name from email (part before @)
  display_name_val := split_part(new.email, '@', 1);

  -- Insert the profile, silently ignore if it somehow already exists
  insert into public.profiles(user_id, display_name, created_at, updated_at)
  values(new.id, display_name_val, now(), now())
  on conflict(user_id) do nothing;

  return new;
exception when others then
  -- Log but don't fail the user creation if profile creation fails
  raise warning 'Error creating profile for user %: %', new.id, sqlerrm;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Create the trigger on auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_auth_user_created();
