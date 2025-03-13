import React, { useState, useEffect, useRef } from 'react';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const PasswordDisplay = ({ password }) => {
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({ level: 0, text: '' });
  const passwordRef = useRef(null);
  
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [copied]);
  
  useEffect(() => {
    
    if (password) {
      const strength = calculatePasswordStrength(password);
      setStrength(strength);
    }
  }, [password]);
  
  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    
    
    if (pwd.length >= 12) score += 2;
    else if (pwd.length >= 8) score += 1;
    
    
    if (/[A-Z]/.test(pwd)) score += 1; 
    if (/[a-z]/.test(pwd)) score += 1; 
    if (/[0-9]/.test(pwd)) score += 1; 
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1; 
    
    
    let level = 0;
    let text = '';
    
    if (score >= 6) { level = 4; text = 'Very Strong'; }
    else if (score >= 4) { level = 3; text = 'Strong'; }
    else if (score >= 3) { level = 2; text = 'Good'; }
    else if (score >= 2) { level = 1; text = 'Weak'; }
    else { level = 0; text = 'Very Weak'; }
    
    return { level, text };
  };
  
  
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
    <div className="relative mt-8 animate-fade-in animate-stagger-4 overflow-visible">
      {/* Top Bar with strength indicator */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary-dark border-b border-white/5 rounded-t-2xl">
        <PasswordStrengthIndicator strength={strength} />
        <button 
          onClick={copyPassword}
          className={`text-xs font-medium text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-1 ${copied ? 'text-accent' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      
      {/* Password Display */}
      <div className="p-5 text-center bg-primary bg-opacity-80 backdrop-blur-sm border-x border-white/5">
        <div className="line-password inline-block">
          <div 
            ref={passwordRef}
            onClick={(e) => {
              // Create a range and select the text for copying
              const range = document.createRange();
              range.selectNodeContents(e.target);
              const selection = window.getSelection();
              selection.removeAllRanges();
              selection.addRange(range);
            }}
            className="font-mono text-lg md:text-xl text-accent cursor-pointer tracking-wide break-all select-all"
          >
            {password}
          </div>
        </div>
      </div>
      
      {/* Password Length Indicator */}
      <div className="border-t border-white/5 px-4 py-2 flex justify-between items-center bg-primary-dark/50 rounded-b-2xl border-x border-b border-white/5">
        <div className="text-xs text-white/60">
          Length: <span className="text-accent font-medium">{password?.length || 0}</span> characters
        </div>
        <button
          onClick={copyPassword}
          className={`btn text-xs py-1 px-3 ${copied ? 'bg-accent/20 text-accent' : 'bg-primary-light hover:bg-accent/30'} transition-all duration-300`}
        >
          {copied ? 'Copied!' : 'Copy to clipboard'}
        </button>
      </div>
    </div>
  );
};

export default PasswordDisplay;
