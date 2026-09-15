-- User profiles: display name, bio, avatar URL
-- Every user gets a profile row created automatically on signup.
-- Profiles are public-readable but users can only edit their own.

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table profiles is
  'User profile data: display name, bio, avatar. Public-readable; users can only edit their own.';

alter table profiles enable row level security;

-- Anyone can read profiles (public profile data)
create policy "profiles are public" on profiles
  for select
  to anon, authenticated
  using (true);

-- Users can only update their own profile
create policy "users can update own profile" on profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can only delete their own profile (cascades with user delete anyway)
create policy "users can delete own profile" on profiles
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Trigger function: auto-create profile when a user signs up
create function handle_auth_user_created()
returns trigger as $$
begin
  insert into profiles(user_id, display_name, created_at, updated_at)
  values(new.id, split_part(new.email, '@', 1), now(), now())
  on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Hook the trigger to auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_auth_user_created();

-- Trigger function: update the updated_at timestamp
create function update_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Hook the trigger to profiles update
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_profiles_updated_at();
