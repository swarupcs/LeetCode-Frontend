import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  // Function to determine if a route is active
  const isActive = (route) => location.pathname === route;

  // Navigation items configuration
  const navItems = [
    // { path: '/explore', label: 'Explore' },
    { path: '/problem-set', label: 'Problems' },
    // { path: '/discuss', label: 'Discuss' },
    { path: '/dsaSheet', label: 'DSA Sheet' },
    { path: '/discussion', label: 'Discussion' },
    { path: '/leaderboard', label: 'Leaderboard' },
  ];

  return (
    <header className='border-b border-gray-800'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center h-14'>
          <Link
            to='/'
            className='mr-6 p-2 rounded-md hover:bg-gray-800 transition-colors duration-200 active:scale-95 transform'
          >
            <ArrowLeft className='h-5 w-5' />
          </Link>
          <nav className='flex space-x-2'>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md transition-all duration-200 active:scale-95 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  isActive(item.path)
                    ? 'text-white font-medium bg-gray-700 border-b-2 border-white hover:bg-gray-600'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
