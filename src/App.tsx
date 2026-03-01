// ─── src/App.tsx ──────────────────────────────────────────────────────────────

import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/app/store';

import Index from './pages/Index';
import ProblemsPage from './pages/Problems';
import ProblemDetailPage from './pages/ProblemDetail';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import LeaderboardPage from './pages/Leaderboard';
import SheetsPage from './pages/Sheets';
import SheetDetail from './pages/SheetDetail';
import RoadmapsPage from './pages/Roadmaps';
import RoadmapDetailPage from './pages/RoadmapDetail';
import DiscussionsPage from './pages/Discussions';
import DiscussionDetail from './pages/DiscussionDetail';
import DashboardPage from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import AdminProblemsPage from './pages/AdminProblems';
import CreateProblemPage from './pages/CreateProblem';
import AdminSheetsPage from './pages/AdminSheets';
import CreateSheetPage from './pages/CreateSheet';
import AdminRoadmapsPage from './pages/AdminRoadmaps';
import CreateRoadmapPage from './pages/CreateRoadmap';
import AdminUsersPage from './pages/AdminUsers';
import AdminUserDetailPage from './pages/AdminUserDetail';
import NotFound from './pages/NotFound';
import GoogleCallback from './pages/GoogleCallback';

const queryClient = new QueryClient();

function AppLayout() {
  const location = useLocation();
  const isProblemDetail = location.pathname.startsWith('/problem/');
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-1'>
        <Routes>
          {/* ── Public routes ── */}
          <Route path='/' element={<Index />} />
          <Route path='/problems' element={<ProblemsPage />} />
          <Route path='/problem/:id' element={<ProblemDetailPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/leaderboard' element={<LeaderboardPage />} />
          <Route path='/sheets' element={<SheetsPage />} />
          <Route path='/sheets/:id' element={<SheetDetail />} />
          <Route path='/roadmaps' element={<RoadmapsPage />} />
          <Route path='/roadmaps/:slug' element={<RoadmapDetailPage />} />
          <Route path='/discussions' element={<DiscussionsPage />} />
          <Route path='/discussions/:id' element={<DiscussionDetail />} />

          <Route path='/auth/google/callback' element={<GoogleCallback />} />

          {/* ── Public with guest fallback UI (no redirect) ── */}
          <Route path='/dashboard' element={<DashboardPage />} />

          {/* ── Protected: must be logged in ── */}
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/settings'
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* ── Protected: must be ADMIN ── */}
          <Route
            path='/admin'
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path='problems' element={<AdminProblemsPage />} />
            <Route path='problems/create' element={<CreateProblemPage />} />
            <Route path='problems/edit/:id' element={<CreateProblemPage />} />
            <Route path='sheets' element={<AdminSheetsPage />} />
            <Route path='sheets/create' element={<CreateSheetPage />} />
            <Route path='sheets/edit/:id' element={<CreateSheetPage />} />
            <Route path='roadmaps' element={<AdminRoadmapsPage />} />
            <Route path='roadmaps/create' element={<CreateRoadmapPage />} />
            <Route path='roadmaps/edit/:id' element={<CreateRoadmapPage />} />
            <Route path='users' element={<AdminUsersPage />} />
            <Route path='users/:id' element={<AdminUserDetailPage />} />
          </Route>

          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      {!isProblemDetail && !isAdmin && <Footer />}
    </div>
  );
}

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme='dark'>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <AppLayout />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);

export default App;
