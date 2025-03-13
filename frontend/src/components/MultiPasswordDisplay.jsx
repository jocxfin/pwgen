import React, { useState } from 'react';

const MultiPasswordDisplay = ({ passwords }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  const copyPassword = (index) => {
    const password = passwords[index];
    
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(password)
        .then(() => {
          setCopiedIndex(index);
          setTimeout(() => setCopiedIndex(null), 1500);
        })
        .catch(err => {
          console.error('Error copying password to clipboard:', err);
          fallbackCopy(password, index);
        });
    } else {
      fallbackCopy(password, index);
    }
  };
  
  const fallbackCopy = (password, index) => {
    const textArea = document.createElement("textarea");
    textArea.value = password;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error('Fallback: Could not copy password', err);
    }
    
    document.body.removeChild(textArea);
  };

  return (
    <div className="mt-8 animate-fade-in animate-stagger-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-primary-dark border-b border-white/5 rounded-t-2xl">
        <h3 className="text-white/90 text-sm font-medium">Multiple Passwords</h3>
        <div className="text-xs text-white/50">Click on any password to copy</div>
      </div>
      
      <div className="divide-y divide-white/5 bg-primary bg-opacity-80 backdrop-blur-sm border-x border-white/5">
        {passwords.map((password, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between transition-all duration-300 hover:bg-primary-light/20 group`}
          >
            <div 
              className="py-3 px-4 line-password font-mono text-sm break-all cursor-pointer flex-1 text-white/90 group-hover:text-white transition-colors duration-200"
              onClick={() => copyPassword(index)}
            >
              {password}
            </div>
            <div className="pr-4">
              <button
                onClick={() => copyPassword(index)}
                className={`flex items-center gap-1 ${copiedIndex === index ? 'text-accent' : 'text-white/60 hover:text-white'} transition-colors duration-200 text-xs px-2 py-1 rounded-md ${copiedIndex === index ? 'bg-accent/10' : 'hover:bg-white/5'}`}
              >
                {copiedIndex === index ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-primary-dark/50 px-4 py-2 text-xs text-white/60 rounded-b-2xl border-t border-x border-b border-white/5">
        Generated {passwords.length} unique passwords
      </div>
    </div>
  );
};

export default MultiPasswordDisplay;
