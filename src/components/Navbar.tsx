import { UserButton, SignInButton, useUser } from '@clerk/clerk-react';
import { Car } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Swiftly</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}