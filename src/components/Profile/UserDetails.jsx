
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const userFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  bio: z.string().max(160, {
    message: 'Bio must not be longer than 160 characters.',
  }),
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

// Mock user data - in a real app, this would come from your backend
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  bio: 'Software developer passionate about solving problems and learning new technologies.',
  username: 'johndoe',
  avatarUrl: '/placeholder.svg?height=100&width=100',
  level: 'Advanced',
  joinDate: 'Jan 2023',
  badges: ['Problem Solver', 'Fast Learner', 'Team Player'],
};

export function UserDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(mockUser);

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: user.bio,
      username: user.username,
    },
  });

  function onSubmit(values) {
    // In a real app, you would send this data to your backend
    setUser({
      ...user,
      ...values,
    });
    setIsEditing(false);
    toast.success('Your profile has been updated successfully');
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-20 w-20'>
              <AvatarImage
                src={user.avatarUrl || '/placeholder.svg'}
                alt={user.name}
              />
              <AvatarFallback>
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
              <div className='flex flex-wrap gap-2 mt-2'>
                {user.badges.map((badge) => (
                  <Badge key={badge} variant='secondary'>
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className='flex flex-col items-end'>
            <div className='text-sm text-muted-foreground'>
              Member since {user.joinDate}
            </div>
            <div className='mt-1'>
              <Badge variant='outline' className='font-semibold'>
                {user.level}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Your name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='Username' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Tell us a little bit about yourself'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      You can <span className='font-medium'>@mention</span>{' '}
                      other users and organizations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-end gap-2'>
                <Button
                  variant='outline'
                  type='button'
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type='submit'>Save Changes</Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className='space-y-4'>
            <div>
              <h3 className='text-sm font-medium'>Email</h3>
              <p className='text-sm text-muted-foreground mt-1'>{user.email}</p>
            </div>
            <div>
              <h3 className='text-sm font-medium'>Bio</h3>
              <p className='text-sm text-muted-foreground mt-1'>{user.bio}</p>
            </div>
            <div className='flex justify-end'>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
