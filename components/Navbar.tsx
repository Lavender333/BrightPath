
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Page } from '../types';

interface NavbarProps {
  userType?: 'staff' | 'student' | null;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userType, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: Page.Home },
    { label: 'Program', path: Page.Program },
    { label: 'Impact', path: Page.Impact },
    { label: 'About', path: Page.About },
    { label: 'Sponsor', path: Page.Sponsor },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    if (onLogout) onLogout();
    setIsOpen(false);
    navigate(Page.Home);
  };

  return (
    <nav className="fixed w-full z-50 bg-bgSoft/90 backdrop-blur-md border-b border-primary/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex justify-between items-center">
        {/* Logo */}
        <Link to={Page.Home} className="text-xl font-bold tracking-[0.2em] text-primary">
          BRIGHTPATH
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10 text-sm tracking-widest uppercase font-medium text-primary/70">
          {!userType && navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`hover:text-primary transition-colors duration-300 ${isActive(link.path) ? 'text-primary' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          
          {userType === 'staff' && (
            <Link to={Page.Staff} className={`hover:text-primary transition-colors ${isActive(Page.Staff) ? 'text-primary' : ''}`}>Dashboard</Link>
          )}
          
          {userType === 'student' && (
            <Link to={Page.StudentPortal} className={`hover:text-primary transition-colors ${isActive(Page.StudentPortal) ? 'text-primary' : ''}`}>My Portal</Link>
          )}

          {userType ? (
            <button 
              onClick={handleLogout} 
              className="text-primary/50 hover:text-primary border border-primary/20 px-4 py-2 text-[10px] tracking-widest uppercase"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center space-x-6">
              <Link to={Page.Login} className="hover:text-primary text-[10px] tracking-widest uppercase font-bold border-b border-transparent hover:border-accent">Login</Link>
              <Link
                to={Page.Apply}
                className="bg-accent text-white px-8 py-3 rounded-sm hover:bg-[#B38E3D] transition-all duration-300 shadow-sm"
              >
                Apply
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-bgSoft h-screen w-full fixed inset-0 z-40 p-8 flex flex-col space-y-8 text-center justify-center fade-in">
           {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-serif text-primary"
            >
              {link.label}
            </Link>
          ))}
          {userType && (
             <button onClick={handleLogout} className="text-xl font-serif text-primary/50">Logout</button>
          )}
          {!userType && (
            <>
              <Link to={Page.Login} onClick={() => setIsOpen(false)} className="text-xl font-serif text-primary">Login</Link>
              <Link
                to={Page.Apply}
                onClick={() => setIsOpen(false)}
                className="bg-accent text-white px-8 py-4 rounded-sm text-lg font-medium"
              >
                Apply
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
