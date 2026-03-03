import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import { AdminLogin } from './pages/AdminLogin';
import { OpenProjects } from './pages/OpenProjects';
import { ProjectDetails } from './pages/ProjectDetails';
import { Apply } from './pages/Apply';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProjects } from './pages/AdminProjects';
import { AdminApplications } from './pages/AdminApplications';
import { AdminAlumni } from './pages/AdminAlumni';
import { AdminHomepage } from './pages/AdminHomepage';
import { ROUTES } from './constants/messages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <Routes>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />

            <Route element={<MainLayout />}>
              <Route path={ROUTES.HOME} element={<OpenProjects />} />
              <Route path={ROUTES.PROJECT_DETAILS} element={<ProjectDetails />} />
              <Route
                path={ROUTES.APPLY}
                element={
                  <ProtectedRoute>
                    <Apply />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.STUDENT_DASHBOARD}
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route
              path={ROUTES.ADMIN_DASHBOARD}
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="alumni" element={<AdminAlumni />} />
              <Route path="homepage" element={<AdminHomepage />} />
            </Route>

            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
