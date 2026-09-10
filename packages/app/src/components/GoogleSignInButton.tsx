import { useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Shared by SignInPage and SignUpPage -- Google OAuth has no separate
 * "sign up" step, signInWithOAuth creates the account on first use, so one
 * button covers both flows.
 */
export function GoogleSignInButton() {
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)

  async function handleClick() {
    setError(null)
    setRedirecting(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })

    // On success the browser navigates away to Google immediately -- this
    // only returns if something's misconfigured (e.g. provider not enabled).
    if (error) {
      setRedirecting(false)
      setError(error.message)
    }
  }

  return (
    <div>
      <button type="button" onClick={handleClick} disabled={redirecting} style={{ width: '100%' }}>
        {redirecting ? 'Redirecting…' : 'Sign in with Google'}
      </button>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </div>
  )
}
