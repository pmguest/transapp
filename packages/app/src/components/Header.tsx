import { useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/use-auth'
import { useProfile } from '../lib/ProfileContext'

export function Header() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const { profile, setProfile } = useProfile()

  const loadProfile = useCallback(async () => {
    if (!user) return

    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setProfile(data)
      }
    } catch (err) {
      console.error('Failed to load profile:', err)
    }
  }, [user, setProfile])

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user, loadProfile])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/signin')
  }

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
        transapp
      </Link>

      {loading ? null : user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Signed in as {profile?.display_name || user.email}</span>
          <Link to="/profile" style={{ color: '#0066cc', textDecoration: 'none' }}>
            Profile
          </Link>
          <button onClick={handleSignOut}>Sign out</button>
        </div>
      ) : (
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/signin">Sign in</Link>
          <Link to="/signup">Sign up</Link>
        </nav>
      )}
    </header>
  )
}
