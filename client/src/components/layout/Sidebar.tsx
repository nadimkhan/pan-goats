// Sidebar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

const Sidebar: React.FC = () => {
  const [isLivestockOpen, setIsLivestockOpen] = useState(false);

  const handleLivestockClick = () => {
    setIsLivestockOpen(!isLivestockOpen);
  };

  return (
    <div className="p-2 bg-gray-800 w-64 h-full fixed">
    <div className="text-white text-2xl mb-4 text-center h-32 flex items-center justify-center mt-4">
      <Link to="/dashboard">
        <img src={logo} alt="Logo" className="w-32 h-32" />
      </Link>
    </div>
    <ul className='py-2 px-2 mt-4'>
      <li className="text-white mb-2 flex justify-between items-center" onClick={handleLivestockClick}>
        <Link to="#">
          <span  className='px-2'>Livestock Management</span>
          <FontAwesomeIcon icon={isLivestockOpen ? faCaretUp : faCaretDown} />
        </Link>
      </li>
      <CSSTransition
        in={isLivestockOpen}
        timeout={300}
        classNames="submenu"
        unmountOnExit
      >
        <ul className="pl-4 submenu">
          <li className="text-white mb-2"><Link to="/dashboard/livestock/goats">Goats</Link></li>
          <li className="text-white mb-2"><Link to="/dashboard/livestock/breeds">Breeds</Link></li>
          <li className="text-white mb-2"><Link to="/dashboard/livestock/medicines">Medicines</Link></li>
          <li className="text-white mb-2"><Link to="/dashboard/livestock/feed">Feed</Link></li>
          <li className="text-white mb-2"><Link to="/dashboard/livestock/vendor">Vendor</Link></li>
          <li className="text-white mb-2"><Link to="/dashboard/livestock/breeding">Breeding</Link></li>
          <li className="text-white mb-2"><Link to="/dashboard/livestock/tags">Tags</Link></li>
          {/* Add other sub-links here */}
        </ul>
      </CSSTransition>
        <li className="text-white mb-2">Crop Management</li>
        <li className="text-white mb-2">Equipment Management</li>
        <li className="text-white mb-2">User Management</li>
        <li className="text-white mb-2">Reporting</li>
      </ul>
    </div>
  );
};

export default Sidebar;
