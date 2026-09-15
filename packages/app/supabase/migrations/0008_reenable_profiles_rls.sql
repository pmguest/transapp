-- Re-enable RLS on profiles table now that the trigger is fixed

alter table profiles enable row level security;
