import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { profile } from '../config/profile'

export default function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const onLogout = () => {
    logout()
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    [
      'rounded-md px-2 py-1 transition-colors',
      isActive
        ? 'bg-slate-200/70 dark:bg-slate-800/60'
        : 'hover:bg-slate-200/60 dark:hover:bg-slate-800/40',
    ].join(' ')

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/70">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <NavLink
          to="/"
          className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-900 dark:text-slate-100"
        >
        <img 
            src={profile.pf} 
            alt={profile.name} 
            className="h-12 w-12 object-cover rounded-full" // Added styling to make it look like a profile pic
        />
          {profile.name}
        </NavLink>

        <nav className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/blog" className={linkClass}>
            Blog
          </NavLink>
          <NavLink to="/gallery" className={linkClass}>
            Gallery
          </NavLink>
          {isAuthenticated ? (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          ) : null}

          {isAuthenticated ? (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-md px-2 py-1 transition-colors hover:bg-slate-200/60 dark:hover:bg-slate-800/40"
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}

