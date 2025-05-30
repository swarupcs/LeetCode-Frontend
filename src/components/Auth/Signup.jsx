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

export function Signup({ className, ...props }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const navigate = useNavigate();


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
    // Redirect browser to backend Google OAuth endpoint
    window.location.href = 'http://localhost:8080/api/v1/auth/google';
  };

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
