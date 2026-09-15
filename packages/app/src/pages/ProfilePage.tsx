import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/use-auth'
import type { Database } from '../lib/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

export function ProfilePage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    avatar_url: '',
  })

  const loadProfile = useCallback(async () => {
    if (!user) return

    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (err && err.code !== 'PGRST116') {
        // PGRST116 = no rows returned (expected on first signup)
        throw err
      }

      if (data) {
        setProfile(data)
        setFormData({
          display_name: data.display_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
        })
      }
    } catch (err) {
      console.error('Failed to load profile:', err)
      setError('Failed to load profile')
    }
  }, [user])

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin')
      return
    }

    if (user) {
      loadProfile()
    }
  }, [user, loading, navigate, loadProfile])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    setError(null)

    try {
      const { error: err } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: formData.display_name || null,
          bio: formData.bio || null,
          avatar_url: formData.avatar_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      if (err) throw err

      await loadProfile()
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to save profile:', err)
      setError('Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Profile</h1>

      {error && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fee',
            border: '1px solid #f00',
            borderRadius: '4px',
            marginBottom: '1rem',
            color: '#a00',
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          backgroundColor: '#f9f9f9',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #ddd',
        }}
      >
        {profile?.avatar_url && (
          <div
            style={{
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            <img
              src={profile.avatar_url}
              alt="Avatar"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}

        {!isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                Email
              </label>
              <p style={{ margin: 0 }}>{user.email}</p>
            </div>

            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                Display Name
              </label>
              <p style={{ margin: 0 }}>
                {profile?.display_name || <em>Not set</em>}
              </p>
            </div>

            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                Bio
              </label>
              <p style={{ margin: 0 }}>
                {profile?.bio || <em>Not set</em>}
              </p>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                Display Name
              </label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) =>
                  setFormData({ ...formData, display_name: e.target.value })
                }
                placeholder="Enter your display name"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself"
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                Avatar URL
              </label>
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) =>
                  setFormData({ ...formData, avatar_url: e.target.value })
                }
                placeholder="https://example.com/avatar.jpg"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#0066cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  opacity: isSaving ? 0.7 : 1,
                }}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  if (profile) {
                    setFormData({
                      display_name: profile.display_name || '',
                      bio: profile.bio || '',
                      avatar_url: profile.avatar_url || '',
                    })
                  }
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#ccc',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
