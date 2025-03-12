import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-4 text-center text-sm fixed bottom-0 bg-bgColor">
      <p>
        Simple password generator made by 
        <a 
          href="https://github.com/jocxfin/pwgen" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-accent2 ml-1 hover:underline"
        >
          jocxFIN
        </a>
      </p>
    </footer>
  );
};

export default Footer;
