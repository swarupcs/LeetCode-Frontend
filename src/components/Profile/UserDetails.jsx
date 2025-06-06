import { useState, useEffect } from 'react';
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
import { format } from 'date-fns';

const userFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  bio: z.string().max(160).optional(),
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

export function UserDetails({ usersDetails }) {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (usersDetails) {
      const createdAt = new Date(usersDetails.createdAt);
      const isValidDate = !isNaN(createdAt);

      const day = isValidDate ? format(createdAt, 'dd') : 'Unknown';
      const month = isValidDate ? format(createdAt, 'MMM') : 'Unknown';
      const year = isValidDate ? format(createdAt, 'yyyy') : 'Unknown';

      setUser({
        ...usersDetails,
        bio: usersDetails.bio || '',
        avatarUrl: usersDetails.image || '/placeholder.svg',
        level: usersDetails.role || 'Member',
        joinDate: isValidDate ? `${day} ${month} ${year}` : 'Unknown', // "17 May 2025"
        badges: ['Active Member', 'Contributor'],
        createdDay: day,
        createdMonth: month,
        createdYear: year,
      });
    }
  }, [usersDetails]);
  

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: usersDetails?.name || '',
      email: usersDetails?.email || '',
      bio: '',
      username: usersDetails?.username || '',
    },
  });

  function onSubmit(values) {
    setUser((prev) => ({
      ...prev,
      ...values,
    }));
    setIsEditing(false);
    toast.success('Your profile has been updated successfully');
  }

  if (!user) return null;

  return (
    <Card className='bg-gradient-to-r from-[#fef08a] via-[#84cc16] to-[#16a34a]'>
      <CardHeader>
        <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-20 w-20'>
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>
                {user.name?.substring(0, 2)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
              <div className='flex flex-wrap gap-2 mt-2'>
                {user.badges?.map((badge) => (
                  <Badge key={badge} variant='secondary'>
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className='flex flex-col items-end'>
            <div className='text-sm  text-shadow-cyan-800'>
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
              <p className='text-sm text-blue-950 mt-1'>{user.email}</p>
            </div>
            {user.bio && (
              <div>
                <h3 className='text-sm font-medium'>Bio</h3>
                <p className='text-sm text-orange-600 mt-1'>{user.bio}</p>
              </div>
            )}
            {/* <div className='flex justify-end'>
              <Button
                onClick={() => {
                  form.reset({
                    name: user.name || '',
                    username: user.username || '',
                    email: user.email || '',
                    bio: user.bio || '',
                  });
                  setIsEditing(true);
                }}
              >
                Edit Profile
              </Button>
            </div> */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
