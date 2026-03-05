import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME, ROUTES, NAV, AUTH } from '../constants/messages';
import './Navbar.css';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="navbar-institutional">
      <div className="navbar-inner">
        {/* Left — Logo + wordmark */}
        <div className="navbar-left">
          <Link to={ROUTES.HOME} className="navbar-left-link">
            <img
              src="https://mietjmu.in/wp-content/uploads/2020/02/MIET_LOGO_AUTONOMOUS.webp"
              alt="MIET logo"
              className="navbar-logo"
            />
            <span className="navbar-divider" aria-hidden />
            <div className="navbar-wordmark-wrap">
              <span className="navbar-wordmark">{APP_NAME}</span>
            </div>
          </Link>
        </div>

        {/* Right — Auth (desktop) + hamburger (mobile when logged in) */}
        <div className="navbar-right">
          <div className="navbar-right-mobile-cta">
            {!user && (
              <Link to={ROUTES.LOGIN} className="navbar-login-btn">
                {NAV.LOGIN}
              </Link>
            )}
            {user && (
              <button
                type="button"
                className="navbar-hamburger"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                <span />
                <span />
                <span />
              </button>
            )}
          </div>

          {user && (
            <>
              <span className="navbar-user-name">
                {user.name || user.email || 'User'}
              </span>
              {user.role === 'student' && (
                <Link
                  to={ROUTES.STUDENT_DASHBOARD}
                  className="navbar-dashboard-link"
                >
                  {NAV.DASHBOARD}
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  to={ROUTES.ADMIN_DASHBOARD}
                  className="navbar-dashboard-link"
                >
                  {NAV.ADMIN}
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="navbar-logout-btn"
              >
                {AUTH.LOGOUT}
              </button>
            </>
          )}

          {!user && (
            <Link to={ROUTES.LOGIN} className="navbar-login-btn">
              {NAV.LOGIN}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile dropdown (auth only) */}
      <div className={`navbar-dropdown ${open ? 'open' : ''}`}>
        {user ? (
          <>
            {user.role === 'student' && (
              <Link
                to={ROUTES.STUDENT_DASHBOARD}
                onClick={() => setOpen(false)}
              >
                {NAV.DASHBOARD}
              </Link>
            )}
            {user.role === 'admin' && (
              <Link
                to={ROUTES.ADMIN_DASHBOARD}
                onClick={() => setOpen(false)}
              >
                {NAV.ADMIN}
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="navbar-dropdown-logout"
            >
              {AUTH.LOGOUT}
            </button>
          </>
        ) : (
          <Link
            to={ROUTES.LOGIN}
            className="navbar-dropdown-login"
            onClick={() => setOpen(false)}
          >
            {NAV.LOGIN}
          </Link>
        )}
      </div>
    </header>
  );
}
