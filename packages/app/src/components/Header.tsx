import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/use-auth'

export function Header() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

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
          <span>Signed in as {user.email}</span>
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
