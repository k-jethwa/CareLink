import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { auth } from './components/firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import './App.css'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import AuthTest from './components/AuthTest'
import './index.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  console.log('App component rendering, loading:', loading, 'user:', user)

  useEffect(() => {
    console.log('Setting up auth listener...')
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user)
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    console.log('Showing loading state...')
    return <div className='p-4'>Loading...</div>
  }

  console.log('Rendering main app, user:', user)

  return (
    <Router>
      <div className="p-4">
        {user ? (
          <div>
            {/* Header bar */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">CareLink</h1>
              <button
                onClick={() => auth.signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </div>
  
            {/* Routes */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth-test" element={<AuthTest />} />
            </Routes>
          </div>
        ) : (
          <AuthPage />
        )}
      </div>
    </Router>
  )
}

export default App
