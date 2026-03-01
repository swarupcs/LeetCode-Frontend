import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Code2,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { useSignin } from '@/hooks/auth/useSignin';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/features/auth/authSlice';
import type { AppDispatch } from '@/app/store';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { signinMutation, isPending } = useSignin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await signinMutation({ email, password });

      // data should be the response from your API: { success, message, user }
      if (data?.user) {
        dispatch(
          loginSuccess({
            user: data.user.name,
            role: data.user.role,
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
          }),
        );
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint.
    // The backend will handle the OAuth flow and redirect back to
    // /problem-set?success=google_login on success (per your googleAuthCallback).
    // We intercept that on a dedicated callback route — see GoogleCallback.tsx.
    const backendUrl = import.meta.env.VITE_BACKEND_API_URL;
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-12 relative'>
      {/* Background */}
      <div className='absolute inset-0 dot-pattern opacity-20' />
      <div className='absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-radial from-primary/8 via-transparent to-transparent' />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md relative z-10'
      >
        {/* Logo */}
        <div className='text-center mb-8'>
          <Link to='/' className='inline-flex items-center gap-2.5 mb-6'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20'>
              <Code2 className='h-5 w-5 text-primary' />
            </div>
            <span className='text-2xl font-bold'>
              <span className='gradient-text'>Algo</span>
              <span className='text-foreground'>Drill</span>
            </span>
          </Link>
          <h1 className='text-2xl font-bold mb-2'>Welcome back</h1>
          <p className='text-muted-foreground text-sm'>
            Sign in to continue your coding journey
          </p>
        </div>

        <Card className='glass-card border-border/50'>
          <CardContent className='pt-6'>
            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='space-y-2'>
                <Label
                  htmlFor='email'
                  className='text-sm font-medium text-foreground'
                >
                  Email
                </Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='email'
                    type='email'
                    placeholder='you@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='pl-10 bg-surface-2 border-border/50 focus:border-primary/50 h-11'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label
                    htmlFor='password'
                    className='text-sm font-medium text-foreground'
                  >
                    Password
                  </Label>
                  <a
                    href='#'
                    className='text-xs text-primary hover:text-primary/80 transition-colors'
                  >
                    Forgot password?
                  </a>
                </div>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='pl-10 pr-10 bg-surface-2 border-border/50 focus:border-primary/50 h-11'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type='submit'
                disabled={isPending || !email || !password}
                className='w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold'
              >
                {isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </>
                )}
              </Button>

              <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-border/50' />
                </div>
                <div className='relative flex justify-center text-xs'>
                  <span className='bg-card px-3 text-muted-foreground'>
                    or continue with
                  </span>
                </div>
              </div>

              <Button
                type='button'
                variant='outline'
                onClick={handleGoogleLogin}
                className='w-full h-11 border-border/50 text-foreground hover:bg-surface-2'
              >
                <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
                  <path
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z'
                    fill='#4285F4'
                  />
                  <path
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    fill='#34A853'
                  />
                  <path
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    fill='#FBBC05'
                  />
                  <path
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    fill='#EA4335'
                  />
                </svg>
                Continue with Google
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className='text-center text-sm text-muted-foreground mt-6'>
          Don&apos;t have an account?{' '}
          <Link
            to='/signup'
            className='text-primary hover:text-primary/80 font-medium transition-colors'
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
