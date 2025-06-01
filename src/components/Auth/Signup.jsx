import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@/lib/validations/signupSchema';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useSignup } from '@/hooks/apis/auth/useSignup';
import { Link, useNavigate } from 'react-router-dom';
import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { LucideLoader2, TriangleAlert } from 'lucide-react';
import { FaCheck } from 'react-icons/fa';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/features/auth/authSlice';
import axios from '@/config/axiosConfig';

export function Signup({ className, ...props }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const backendUrl = import.meta.env.VITE_BACKEND_API_URL;

  const { isPending, isSuccess, error, signupMutation } = useSignup();

  const onSubmit = async (data) => {
    await signupMutation({
      name: data.fullName,
      email: data.email,
      password: data.password,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate('/problem-set');
      }, 2000);
    }
  }, [isSuccess, navigate]);

  const handleGoogleSignup = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `${backendUrl}/auth/google`,
      'google-auth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    let messageReceived = false;
    let authTimeout;

    const messageListener = (event) => {
      console.log('Message received from origin:', event.origin);
      console.log('Message data:', event.data);
      console.log('Current window origin:', window.location.origin);

      // More flexible origin checking - include your backend URL
      const allowedOrigins = [
        window.location.origin, // Current origin
        backendUrl, // Backend origin
        // Add any other trusted origins if needed
      ];

      // Check if the origin matches any allowed origin
      const isAllowedOrigin = allowedOrigins.some(
        (origin) =>
          event.origin === origin ||
          event.origin.startsWith(origin.split('://')[0] + '://')
      );

      if (!isAllowedOrigin) {
        console.warn('Ignoring message from unexpected origin:', event.origin);
        return;
      }

      messageReceived = true;

      // Clear the timeout since we got a message
      if (authTimeout) {
        clearTimeout(authTimeout);
      }

      window.removeEventListener('message', messageListener);

      // Handle structured response
      if (event.data && typeof event.data === 'object' && event.data.type) {
        if (event.data.type === 'auth_success') {
          const user = event.data.user;
          console.log('Authentication successful, user:', user);

          toast.success('Successfully signed up with Google!');

          dispatch(
            loginSuccess({
              user: user.name,
              role: user.role,
              id: user.id,
              isAuthenticated: true,
            })
          );

          // Only close popup on successful authentication
          safeClosePopup(popup);

          // Navigate after a short delay to ensure state updates
          setTimeout(() => {
            console.log('Navigating to /problem-set');
            navigate('/problem-set');
          }, 100);
        } else if (event.data.type === 'auth_error') {
          console.error('Authentication error:', event.data.message);
          toast.error(event.data.message || 'Authentication failed');
          // Close popup on error
          safeClosePopup(popup);
        } else if (event.data.type === 'auth_cancelled') {
          console.log('Authentication cancelled by user');
          // Close popup if user cancelled
          safeClosePopup(popup);
          // Don't show error toast for user cancellation
        }
      }
      // Handle simple string response (backward compatibility)
      else if (event.data === 'success') {
        console.log('Received success message, fetching user data...');
        // Fallback to API call
        fetchUserAfterAuth();
      } else if (event.data === 'error') {
        toast.error('Authentication failed. Please try again.');
        safeClosePopup(popup);
      }
    };

    // Safe popup closing function
    const safeClosePopup = (popupWindow) => {
      try {
        if (popupWindow && !popupWindow.closed) {
          popupWindow.close();
        }
      } catch (error) {
        console.log('Could not close popup due to COOP policy:', error.message);
        // This is expected with COOP, popup will close itself
      }
    };

    // Fallback function for API-based user fetching
    const fetchUserAfterAuth = async () => {
      try {
        const response = await axios.get(`${backendUrl}/auth/me`, {
          withCredentials: true,
        });

        const user = response.data.user;
        console.log('Fetched user:', user);

        toast.success('Successfully signed up with Google!');

        dispatch(
          loginSuccess({
            user: user.name,
            role: user.role,
            id: user.id,
            isAuthenticated: true,
          })
        );

        // Close popup after successful authentication
        safeClosePopup(popup);

        setTimeout(() => {
          navigate('/problem-set');
        }, 100);
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error('Failed to get user details. Please try again.');
        safeClosePopup(popup);
      }
    };

    // Start message listening
    window.addEventListener('message', messageListener);

    // Set up timeout for authentication (5 minutes) - but don't auto-close
    authTimeout = setTimeout(() => {
      if (!messageReceived) {
        console.log('Authentication timeout - no response received');
        window.removeEventListener('message', messageListener);

        // Try one last check to see if auth was successful
        setTimeout(async () => {
          try {
            const response = await axios.get(`${backendUrl}/auth/me`, {
              withCredentials: true,
            });

            if (response.data.user) {
              console.log('Authentication was successful (timeout fallback)');
              const user = response.data.user;

              toast.success('Successfully signed up with Google!');

              dispatch(
                loginSuccess({
                  user: user.name,
                  role: user.role,
                  id: user.id,
                  isAuthenticated: true,
                })
              );

              // Close popup after successful authentication
              safeClosePopup(popup);
              navigate('/problem-set');
            } else {
              // No successful auth found
              toast.error('Authentication timed out. Please try again.');
              safeClosePopup(popup);
            }
          } catch (error) {
            console.log(
              'Timeout check - user not authenticated:',
              error.message
            );
            toast.error('Authentication timed out. Please try again.');
            safeClosePopup(popup);
          }
        }, 1000);
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Handle popup blocked scenario
    if (!popup) {
      toast.error('Popup blocked. Please allow popups for this site.');
      if (authTimeout) {
        clearTimeout(authTimeout);
      }
      window.removeEventListener('message', messageListener);
    }

    // Optional: Add a manual cleanup method you can call if needed
    // This could be useful if you want to provide a "Cancel" button in your UI
    window.cancelGoogleAuth = () => {
      console.log('Manually cancelling Google authentication');
      messageReceived = true; // Prevent timeout actions

      if (authTimeout) {
        clearTimeout(authTimeout);
      }

      window.removeEventListener('message', messageListener);
      safeClosePopup(popup);

      // Clean up the global function
      delete window.cancelGoogleAuth;
    };
  };

  console.log('window.location.origin:', window.location.origin);
  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      <Card className='bg-premium-darker border border-premium-blue/20 text-white shadow-lg premium-border-gradient'>
        <CardHeader className='border-b border-premium-blue/20'>
          <CardTitle className='premium-text-gradient text-2xl'>
            Create your account
          </CardTitle>
        </CardHeader>
        {isSuccess && (
          <div className='bg-primary/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-primary mb-5'>
            <FaCheck className='size-8 fill-green-500' />
            <p className='text-sm text-white'>
              Successfully signed in. You will be redirected to the problem page
              in a few seconds.
              <LucideLoader2 className='animate-spin ml-2' />
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className='flex flex-col gap-3'>
              <div className='grid gap-1.5'>
                <Label htmlFor='fullName' className='text-gray-200'>
                  Full Name
                </Label>
                <Input
                  id='fullName'
                  {...register('fullName')}
                  placeholder='John Doe'
                  className='bg-premium-dark border-premium-blue/40 text-white placeholder:text-gray-500'
                />
                {errors.fullName && (
                  <p className='text-sm text-red-500'>
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className='grid gap-1.5'>
                <Label htmlFor='email' className='text-gray-200'>
                  Email
                </Label>
                <Input
                  id='email'
                  type='email'
                  {...register('email')}
                  placeholder='john@example.com'
                  className='bg-premium-dark border-premium-blue/40 text-white placeholder:text-gray-500'
                />
                {errors.email && (
                  <p className='text-sm text-red-500'>{errors.email.message}</p>
                )}
              </div>

              <div className='grid gap-1.5'>
                <Label htmlFor='password' className='text-gray-200'>
                  Password
                </Label>
                <Input
                  id='password'
                  type='password'
                  {...register('password')}
                  className='bg-premium-dark border-premium-blue/40 text-white'
                />
                {errors.password && (
                  <p className='text-sm text-red-500'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className='grid gap-1.5'>
                <Label htmlFor='confirmPassword' className='text-gray-200'>
                  Confirm Password
                </Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  {...register('confirmPassword')}
                  className='bg-premium-dark border-premium-blue/40 text-white'
                />
                {errors.confirmPassword && (
                  <p className='text-sm text-red-500'>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className='flex flex-col gap-4 pt-2'>
            <Button
              type='submit'
              className='w-full bg-premium-purple hover:bg-premium-highlight text-white transition-colors'
            >
              Create Account
            </Button>
            <Button
              type='button'
              variant='outline'
              className='w-full border-premium-blue/50 bg-premium-darker text-white hover:bg-premium-blue/20 hover:text-premium-cyan'
              onClick={handleGoogleSignup}
            >
              Sign up with Google
            </Button>
            <div className='mt-2 text-center text-sm text-gray-400'>
              Already have an account?{' '}
              <Link
                to='/login'
                className='text-premium-cyan hover:text-premium-highlight underline underline-offset-4'
              >
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
