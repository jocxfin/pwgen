import React from 'react';

const Header = () => {
  return (
    <header className="bg-primary shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-headerColor">PwGen</h1>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><a href="/" className="text-white hover:text-accent2 transition-colors">Home</a></li>
            <li><a href="/about" className="text-white hover:text-accent2 transition-colors">About</a></li>
            <li><a href="/settings" className="text-white hover:text-accent2 transition-colors">Settings</a></li>
            <li>
              <a 
                href="https://github.com/jocxfin/pwgen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-accent2 transition-colors"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
        <button className="md:hidden focus:outline-none">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
