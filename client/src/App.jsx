import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { auth } from './components/firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import './App.css'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import AuthTest from './components/AuthTest'
import AboutModal from './components/AboutModal'
import './index.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAboutModal, setShowAboutModal] = useState(false)

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-pink-600 text-lg font-medium">Loading CareLink...</p>
        </div>
      </div>
    )
  }

  console.log('Rendering main app, user:', user)

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
        {user ? (
          <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Header bar */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-pink-200 p-6 mb-8 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    CareLink
                  </h1>
                  <p className="text-pink-600 text-sm mt-1">Your mental wellness companion</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAboutModal(true)}
                    className="px-6 py-3 border-2 border-purple-300 text-purple-600 rounded-xl font-medium hover:bg-purple-50 hover:border-purple-400 transition-all duration-200"
                  >
                    About
                  </button>
                  <button
                    onClick={() => auth.signOut()}
                    className="px-6 py-3 border-2 border-pink-300 text-pink-600 rounded-xl font-medium hover:bg-pink-50 hover:border-pink-400 transition-all duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
      
            {/* Routes */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth-test" element={<AuthTest />} />
            </Routes>

            {/* About Modal */}
            {showAboutModal && (
              <AboutModal onClose={() => setShowAboutModal(false)} />
            )}
          </div>
        ) : (
          <AuthPage />
        )}
      </div>
    </Router>
  )
}

export default App
