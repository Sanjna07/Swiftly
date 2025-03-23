import { UserButton, SignInButton, useUser } from '@clerk/clerk-react';
import { Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { isSignedIn } = useUser();
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`relative bg-gradient-to-r from-white via-blue-300 to-gray-700 shadow-lg transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      {/* Shimmering overlay */}
      <div className="absolute inset-0 bg-white opacity-10 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.5)_50%,transparent_100%)] animate-shimmer"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group relative">
              {/* Glow effect for logo */}
              <div className="absolute -inset-2 rounded-full bg-blue-300 opacity-0 blur-md group-hover:opacity-30 transition-opacity duration-700"></div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-blue-200 rounded-full blur-md opacity-0 group-hover:opacity-70 transition-all duration-500"></div>
                <Car className="h-8 w-8 text-blue-500 filter drop-shadow-md transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:drop-shadow-xl" />
              </div>
              
              <div className="overflow-hidden">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-gray-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-300 relative">
                  Swiftly
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300 group-hover:w-full transition-all duration-500"></span>
                </span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="relative group">
                <div className="absolute inset-0 rounded-full bg-blue-200 blur-md opacity-0 group-hover:opacity-70 scale-75 group-hover:scale-150 transition-all duration-700"></div>
                <UserButton 
                  afterSignOutUrl="/"
                  className="relative z-10 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="relative overflow-hidden bg-gradient-to-r from-blue-300 via-gray-200 to-blue-300 text-blue-700 font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:text-white group">
                  {/* Multiple layers of effects */}
                  <span className="relative z-20">Sign In</span>
                  
                  {/* Base hover effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></span>
                  
                  {/* Shine effect */}
                  <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out z-10"></span>
                  
                  {/* Glow effect */}
                  <span className="absolute -inset-1 rounded-lg blur-md bg-gradient-to-r from-blue-400 to-gray-300 opacity-0 group-hover:opacity-70 transition-opacity duration-500 z-0"></span>
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}