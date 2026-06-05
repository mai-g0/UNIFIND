import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PostLostItem from './pages/PostLostItem'
import PostFoundItem from './pages/PostFoundItem'
import Matches from './pages/Matches'
import Claims from './pages/Claims'
import Messages from './pages/Messages'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Notifications from './pages/Notifications'
import NotFound from './pages/NotFound'

function AppContent() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [unreadCount, setUnreadCount] = useState(0)

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

 useEffect(() => {
  async function fetchUnreadCount() {
    const token = localStorage.getItem('token')

    if (!token || user?.role !== 'user') {
      setUnreadCount(0)
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      const unread = data.filter((notification) => !notification.isRead).length
      setUnreadCount(unread)
    } catch (error) {
      console.log(error.message)
    }
  }

  fetchUnreadCount()

  window.addEventListener('notificationsUpdated', fetchUnreadCount)

  return () => {
    window.removeEventListener('notificationsUpdated', fetchUnreadCount)
  }
}, [user?.role])


  return (
    <div className="app">
      <nav className="navbar">
        <h2>UniFind</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>

          {user?.role === 'user' && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/matches">Matches</Link>
              <Link to="/claims">Claims</Link>
              <Link to="/messages">Messages</Link>
             <Link to="/notifications">
  Notifications {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
</Link>
            </>
          )}

         {user?.role === 'admin' && (
  <>
    <Link to="/admin">Admin Dashboard</Link>
    <Link to="/messages">Messages</Link>
  </>
)}

          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {user && (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post-lost"
          element={
            <ProtectedRoute allowedRole="user">
              <PostLostItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post-found"
          element={
            <ProtectedRoute allowedRole="user">
              <PostFoundItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute allowedRole="user">
              <Matches />
            </ProtectedRoute>
          }
        />

        <Route
          path="/claims"
          element={
            <ProtectedRoute allowedRole="user">
              <Claims />
            </ProtectedRoute>
          }
        />

        <Route
  path="/messages"
  element={
    <ProtectedRoute>
      <Messages />
    </ProtectedRoute>
  }
/>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
  path="/notifications"
  element={
    <ProtectedRoute allowedRole="user">
      <Notifications />
    </ProtectedRoute>
  }
/>
        <Route path="*" element={<NotFound />} />

      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App