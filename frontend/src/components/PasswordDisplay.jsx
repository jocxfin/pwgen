import React, { useState, useEffect, useRef } from 'react';

const PasswordDisplay = ({ password }) => {
  const [copied, setCopied] = useState(false);
  const passwordRef = useRef(null);
  
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [copied]);
  
  const copyPassword = () => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(password)
        .then(() => {
          setCopied(true);
        })
        .catch(err => {
          console.error('Error copying password to clipboard:', err);
          fallbackCopy();
        });
    } else {
      fallbackCopy();
    }
  };
  
  const fallbackCopy = () => {
    if (passwordRef.current) {
      passwordRef.current.select();
      try {
        document.execCommand('copy');
        setCopied(true);
      } catch (err) {
        console.error('Fallback: Could not copy password', err);
      }
    }
  };
  
  return (
    <div className="relative mt-6">
      <div 
        className="bg-accent1 text-xs text-right px-2 py-1 rounded-t-md cursor-pointer"
        onClick={copyPassword}
      >
        {copied ? 'copied!' : 'copy password'}
      </div>
      <input
        ref={passwordRef}
        type="text"
        value={password}
        readOnly
        className="w-full bg-primary border-2 border-accent1 border-t-0 text-textColor rounded-b-md px-3 py-2 text-center focus:outline-none"
        onClick={(e) => e.target.select()}
      />
    </div>
  );
};

export default PasswordDisplay;
