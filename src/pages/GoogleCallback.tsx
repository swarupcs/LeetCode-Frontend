/**
 * GoogleCallback.tsx
 *
 * This page handles the redirect from your backend after Google OAuth.
 * Your backend redirects to /problem-set?success=google_login — but instead
 * of handling it there, add this as a dedicated route: /auth/google/callback
 * OR update your backend's redirect URL to point here.
 *
 * OPTION A (recommended): Change your backend's googleAuthCallback to redirect to:
 *   /auth/google/callback?success=google_login
 *
 * OPTION B: Keep your backend redirecting to /problem-set?success=google_login
 * and handle it inside your ProblemSet page by checking for the query param.
 *
 * This file implements OPTION A.
 */

import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/features/auth/authSlice';

import { Loader2 } from 'lucide-react';
import type { AppDispatch } from '@/app/store';

const API_URL = import.meta.env.VITE_BACKEND_API_URL ;

export default function GoogleCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const hasFetched = useRef(false);

  useEffect(() => {
    // Avoid double-fetch in React Strict Mode
    if (hasFetched.current) return;
    hasFetched.current = true;

    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (error || !success) {
      navigate('/login?error=google_login_failed');
      return;
    }

    // The JWT cookie is already set by the backend.
    // Now fetch the authenticated user from the /check endpoint.
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/check`, {
          method: 'GET',
          credentials: 'include', // sends the jwt cookie
        });

        if (!res.ok) throw new Error('Not authenticated');

        const response = await res.json();
        const data = response.data;

        console.log("data", data)

        if (data) {
          dispatch(
            loginSuccess({
              user: data.name,
              role: data.role,
              id: data.id,
              username: data.username,
              email: data.email,
            }),
          );
        }

        navigate('/dashboard');
      } catch {
        navigate('/login?error=google_login_failed');
      }
    };

    fetchUser();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-4'>
      <Loader2 className='h-8 w-8 animate-spin text-primary' />
      <p className='text-muted-foreground text-sm'>
        Signing you in with Google...
      </p>
    </div>
  );
}
