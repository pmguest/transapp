-- Temporarily disable the profile creation trigger to debug
-- If signup works without the trigger, then the trigger is the problem

drop trigger if exists on_auth_user_created on auth.users;
