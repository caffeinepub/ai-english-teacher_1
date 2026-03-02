import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CallScreen from './pages/CallScreen';
import PracticeModesPage from './pages/PracticeModesPage';
import AdminPanel from './pages/AdminPanel';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';

function Layout() {
  return (
    <div className="min-h-screen bg-deep-purple text-white font-inter">
      <Outlet />
    </div>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-deep-purple flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!identity) {
    return <LoginPage />;
  }
  return <>{children}</>;
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: profile, isLoading } = useGetCallerUserProfile();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-purple flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!profile || profile.role !== 'admin') {
    return <Dashboard />;
  }
  return <>{children}</>;
}

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  ),
});

const callRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/call',
  component: () => (
    <AuthGuard>
      <CallScreen />
    </AuthGuard>
  ),
});

const practiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/practice',
  component: () => (
    <AuthGuard>
      <PracticeModesPage />
    </AuthGuard>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AuthGuard>
      <AdminGuard>
        <AdminPanel />
      </AdminGuard>
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
  callRoute,
  practiceRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}
