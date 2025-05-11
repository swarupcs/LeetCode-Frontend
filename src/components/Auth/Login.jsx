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
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Login({ className, ...props }) {

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleEmailChange = (e) => setLoginData({...loginData, email: e.target.value});
  const handlePasswordChange = (e) => setLoginData({...loginData, password: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  console.log("loginData", loginData);

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
