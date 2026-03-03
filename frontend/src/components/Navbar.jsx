import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME, ROUTES, NAV, AUTH } from '../constants/messages';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate(ROUTES.LOGIN);
  };

  const linkClass = "text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-300";
  const mobileLinkClass = "block py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors";

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
            <span className="text-xl font-bold text-slate-900 group-hover:opacity-90 transition-opacity">
              {APP_NAME}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to={ROUTES.OPEN_PROJECTS} className={linkClass}>
              {NAV.OPEN_PROJECTS}
            </Link>
            {user ? (
              <>
                {user.role === 'student' && (
                  <Link to={ROUTES.STUDENT_DASHBOARD} className={linkClass}>
                    {NAV.DASHBOARD}
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to={ROUTES.ADMIN_DASHBOARD} className={linkClass}>
                    {NAV.ADMIN}
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-300"
                  >
                    <span className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-semibold text-slate-700">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                    <span className="hidden sm:inline">{user.name}</span>
                  </button>
                  {open && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                      <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-200 shadow-card-light py-1 z-20">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                          {AUTH.LOGOUT}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className={linkClass}>
                  {NAV.LOGIN}
                </Link>
                <Link
                  to={ROUTES.ADMIN_LOGIN}
                  className="text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 rounded-full px-5 py-2 shadow-glow-sm hover:shadow-glow hover:scale-105 transition-all duration-300"
                >
                  Admin
                </Link>
              </>
            )}
          </nav>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-slate-200 py-3 px-4 space-y-1">
            <Link to={ROUTES.OPEN_PROJECTS} className={mobileLinkClass} onClick={() => setOpen(false)}>
              {NAV.OPEN_PROJECTS}
            </Link>
            {user ? (
              <>
                {user.role === 'student' && (
                  <Link to={ROUTES.STUDENT_DASHBOARD} className={mobileLinkClass} onClick={() => setOpen(false)}>
                    {NAV.DASHBOARD}
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to={ROUTES.ADMIN_DASHBOARD} className={mobileLinkClass} onClick={() => setOpen(false)}>
                    {NAV.ADMIN}
                  </Link>
                )}
                <button type="button" onClick={handleLogout} className={`${mobileLinkClass} w-full text-left`}>
                  {AUTH.LOGOUT}
                </button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className={mobileLinkClass} onClick={() => setOpen(false)}>
                  {NAV.LOGIN}
                </Link>
                <Link
                  to={ROUTES.ADMIN_LOGIN}
                  className="block py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  onClick={() => setOpen(false)}
                >
                  Admin
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
