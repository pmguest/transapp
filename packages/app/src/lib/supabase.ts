import { createClient } from '@supabase/supabase-js'

// Plumbing only — no auth wiring here yet (that's a separate task). This
// just gives the rest of the app one client instance to import.
//
// Uses the publishable key, safe to ship in the browser bundle. Vite only
// exposes env vars prefixed VITE_ to client code, so these two are named
// accordingly — SUPABASE_PROJECT_PASSWORD (the direct Postgres password,
// unrelated to this client) deliberately is not, and must never be.
const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing VITE_SUPABASE_PROJECT_URL or VITE_SUPABASE_PUBLISHABLE_KEY. ' +
      'Fill them in packages/app/.env (see .env.example).'
  )
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
