import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-6">
        <Outlet />
      </main>
    </div>
  );
}
