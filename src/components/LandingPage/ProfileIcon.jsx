import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/authSlice';

const ProfileIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative' onMouseEnter={() => setIsOpen(true)}>
        <div className='w-8 h-8 rounded-full bg-premium-purple flex items-center justify-center hover:bg-premium-highlight cursor-pointer transition-colors'>
          <User className='h-5 w-5 text-white' />
        </div>
      {isOpen && (
        <div
          ref={dropdownRef}
          className='absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50'
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className='p-4'>
            <p className='text-black font-bold'>Your Profile</p>
            <Link
              to='/profile'
              className='block mt-2 text-sm text-blue-600 hover:underline'
            >
              View Profile
            </Link>
            <button
              onClick={handleLogout}
              className='mt-2 w-full text-sm text-red-600 hover:underline'
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
