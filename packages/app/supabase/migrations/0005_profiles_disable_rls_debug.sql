-- Temporarily disable RLS on profiles to debug the signup issue
-- The trigger might be getting blocked by RLS even with security definer

alter table profiles disable row level security;
