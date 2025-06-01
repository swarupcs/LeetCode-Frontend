import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignin } from '@/hooks/apis/auth/useSignin';
import { FaCheck } from 'react-icons/fa';
import { LucideLoader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from '@/config/axiosConfig';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/features/auth/authSlice';


export function Login({ className, ...props }) {

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const { isPending, isSuccess, error, signinMutation } = useSignin();


  const handleEmailChange = (e) => setLoginData({...loginData, email: e.target.value});
  const handlePasswordChange = (e) => setLoginData({...loginData, password: e.target.value});

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/v1';

    const dispatch = useDispatch();


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    await signinMutation({
      email: loginData.email,
      password: loginData.password,
    });
  };

    useEffect(() => {
      if (isSuccess) {
        setTimeout(() => {
          navigate('/problem-set');
        }, 2000);
      }
    }, [isSuccess, navigate]);

  const handleGoogleSignin = async () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `${backendUrl}/auth/google`,
      'Google Sign In',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const messageListener = async (event) => {
      console.log('Message received:', event);

      if (event.data === 'success') {
        window.removeEventListener('message', messageListener);

        try {
          const response = await axios.get(`${backendUrl}/auth/me`, {
            withCredentials: true,
          });

          const user = response.data.user;
          console.log('Fetched user:', user);

          toast.success('Successfully signed in with Google!');

          dispatch(
            loginSuccess({
              user: user.name,
              role: user.role,
              id: user.id,
              isAuthenticated: true,
            })
          );

          // ✅ Close popup first
          if (popup) popup.close();

          // ✅ THEN navigate
          console.log('Navigating to /problem-set');
          navigate('/problem-set');
        } catch (error) {
          console.error('Error fetching user details:', error);
          toast.error('Failed to get user details. Please try again.');
          if (popup) popup.close();
        }
      }
    };

    window.addEventListener('message', messageListener);
  }

  // console.log("loginData", loginData);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='bg-premium-darker border border-premium-blue/20 text-white shadow-lg premium-border-gradient'>
        <CardHeader className='border-b border-premium-blue/20'>
          <CardTitle className='premium-text-gradient text-2xl'>
            Login to your account
          </CardTitle>
          <CardDescription className='text-gray-400'>
            Enter your email below to login to your account
          </CardDescription>
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
        <CardContent className=''>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-3'>
                <Label htmlFor='email' className='text-gray-200'>
                  Email
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                  value={loginData.email}
                  onChange={handleEmailChange}
                  className='bg-premium-dark border-premium-blue/40 text-white placeholder:text-gray-500 focus:border-premium-cyan focus:ring-premium-cyan/20'
                />
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center'>
                  <Label htmlFor='password' className='text-gray-200'>
                    Password
                  </Label>
                  <a
                    href='/forgot-password'
                    className='ml-auto inline-block text-sm text-premium-cyan hover:text-premium-highlight underline-offset-4 hover:underline'
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id='password'
                  type='password'
                  required
                  value={loginData.password}
                  onChange={handlePasswordChange}
                  className='bg-premium-dark border-premium-blue/40 text-white focus:border-premium-cyan focus:ring-premium-cyan/20'
                />
              </div>
              <div className='flex flex-col gap-3'>
                <Button
                  type='submit'
                  className='w-full bg-premium-purple hover:bg-premium-highlight text-white transition-colors'
                >
                  Login
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full border-premium-blue/50 bg-premium-darker text-white hover:bg-premium-blue/20 hover:text-premium-cyan transition-colors'
                  onClick={handleGoogleSignin}
                >
                  Login with Google
                </Button>
              </div>
            </div>
            <div className='mt-6 text-center text-sm text-gray-400'>
              Don't have an account?{' '}
              <Link
                to='/signup'
                className='text-premium-cyan hover:text-premium-highlight underline underline-offset-4'
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
