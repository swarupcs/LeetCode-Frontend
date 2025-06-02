import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, UserCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import axios from '@/config/axiosConfig';
import { toast } from 'sonner';

const ProfileIcon = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      axios
        .post('/auth/logout')
        .then(() => {
          console.log('Successfully logged out');
          dispatch(logout());
          navigate('/', { replace: true });
          toast.success('Successfully logged out');
          
        })
        .catch((error) => {
          console.error('Logout failed:', error);
        });
    } catch (error) {
      console.log("error", error);
      toast.error('Logout failed. Please try again later.');
      // Handle error if the logout request fails
      throw new Error('Logout failed. Please try again later.');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='w-8 h-8 rounded-full bg-premium-purple flex items-center justify-center hover:bg-premium-highlight cursor-pointer transition-colors'>
          <User className='h-5 w-5 text-white' />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-48' align='end'>
        <DropdownMenuLabel>Your Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to='/profile' className='flex items-center cursor-pointer'>
            <UserCircle className='mr-2 h-4 w-4' />
            View Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className='text-red-600 focus:text-red-600 cursor-pointer'
        >
          <LogOut className='mr-2 h-4 w-4' />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileIcon;
