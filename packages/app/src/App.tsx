import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { SignUpPage } from './pages/SignUpPage'
import { SignInPage } from './pages/SignInPage'

function HomePage() {
  return (
    <>
      <h1>Hello world!</h1>
      <p>Deployed automatically via GitHub → Vercel.</p>
    </>
  )
}

function App() {
  return (
    <>
      <Header />
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
