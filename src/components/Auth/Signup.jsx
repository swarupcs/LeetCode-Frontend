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
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

import { Link } from 'react-router-dom';

export function Signup({ className, ...props }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
  };

  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      <Card className='bg-premium-darker border border-premium-blue/20 text-white shadow-lg premium-border-gradient'>
        <CardHeader className='border-b border-premium-blue/20'>
          <CardTitle className='premium-text-gradient text-2xl'>
            Create your account
          </CardTitle>
        </CardHeader>
        <CardContent className=''>
          <div className='flex flex-col gap-3'>
            <div className='grid gap-3'>
              <Label htmlFor='fullName' className='text-gray-200'>
                Full Name
              </Label>
              <Input
                id='fullName'
                type='text'
                placeholder='John Doe'
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className='bg-premium-dark border-premium-blue/40 text-white placeholder:text-gray-500 focus:border-premium-cyan focus:ring-premium-cyan/20'
              />
            </div>

            <div className='grid gap-3'>
              <Label htmlFor='email' className='text-gray-200'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='john@example.com'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='bg-premium-dark border-premium-blue/40 text-white placeholder:text-gray-500 focus:border-premium-cyan focus:ring-premium-cyan/20'
              />
            </div>

            <div className='grid gap-3'>
              <Label htmlFor='password' className='text-gray-200'>
                Password
              </Label>
              <Input
                id='password'
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='bg-premium-dark border-premium-blue/40 text-white focus:border-premium-cyan focus:ring-premium-cyan/20'
              />
              {/* <p className='text-xs text-gray-400'>
                Password must be at least 8 characters long with a mix of
                letters, numbers, and symbols
              </p> */}
            </div>

            <div className='grid gap-3'>
              <Label htmlFor='confirmPassword' className='text-gray-200'>
                Confirm Password
              </Label>
              <Input
                id='confirmPassword'
                type='password'
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='bg-premium-dark border-premium-blue/40 text-white focus:border-premium-cyan focus:ring-premium-cyan/20'
              />
            </div>

            {/* <div className='flex items-center space-x-2'>
              <Checkbox
                id='terms'
                checked={agreed}
                onCheckedChange={setAgreed}
                className='border-premium-blue/40 data-[state=checked]:bg-premium-cyan data-[state=checked]:border-premium-cyan'
              />
              <Label htmlFor='terms' className='text-sm text-gray-300'>
                I agree to the{' '}
                <a
                  href='#'
                  className='text-premium-cyan hover:text-premium-highlight underline underline-offset-4'
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href='#'
                  className='text-premium-cyan hover:text-premium-highlight underline underline-offset-4'
                >
                  Privacy Policy
                </a>
              </Label>
            </div> */}
          </div>
        </CardContent>
        <CardFooter className='flex flex-col gap-4 pt-2'>
          <Button
            onClick={handleSubmit}
            // disabled={!agreed}
            className='w-full bg-premium-purple hover:bg-premium-highlight text-white transition-colors disabled:bg-gray-600 disabled:text-gray-400'
          >
            Create Account
          </Button>
          <Button
            variant='outline'
            className='w-full border-premium-blue/50 bg-premium-darker text-white hover:bg-premium-blue/20 hover:text-premium-cyan transition-colors'
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
      </Card>
    </div>
  );
}
