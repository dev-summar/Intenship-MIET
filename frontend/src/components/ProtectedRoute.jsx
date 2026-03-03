import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/messages';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    const applyMatch = location.pathname.match(/^\/apply\/([^/]+)$/);
    const state = applyMatch
      ? { redirectToApply: applyMatch[1] }
      : { from: location };
    return <Navigate to={ROUTES.LOGIN} state={state} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    if (user.role === 'student') return <Navigate to={ROUTES.STUDENT_DASHBOARD} replace />;
    return <Navigate to={ROUTES.OPEN_PROJECTS} replace />;
  }

  return children;
}
