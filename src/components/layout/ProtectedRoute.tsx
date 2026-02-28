// ─── src/components/layout/ProtectedRoute.tsx ────────────────────────────────

import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import type { RootState } from '@/app/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.auth,
  );
  const location = useLocation();

  if (!isAuthenticated) {
    // Preserve the intended destination so we can redirect back after login
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (requireAdmin && role !== 'ADMIN') {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
}
