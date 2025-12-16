import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Simple theme management synced to data-theme
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          <span className="brand-title">Ocean Notes</span>
        </div>
        <div className="topbar-actions">
          <button
            className="btn btn-ghost"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <nav className="nav">
            <Link to="/notes" className="nav-link">
              🗒️ Notes
            </Link>
            <Link to="/notes/new" className="nav-link">
              ✨ New Note
            </Link>
          </nav>
          <div className="sidebar-footer">
            <a
              className="muted"
              href="https://reactjs.org/"
              target="_blank"
              rel="noreferrer"
            >
              React Docs ↗
            </a>
          </div>
        </aside>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
