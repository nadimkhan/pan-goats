// Header.tsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  return (
    <header className="bg-gray-100 h-16 flex items-center px-8">
      <button className="text-gray-500 focus:outline-none">
        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>
      <div className="ml-auto">
      <button onClick={() => setDropdownOpen(!isDropdownOpen)}>
          <FontAwesomeIcon icon={faUser} />
        </button>
        {isDropdownOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <Link to="/edit-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Edit Profile</Link>
              <Link to="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Logout</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
