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
    <div className="mt-6 border-2 border-accent1 rounded-lg overflow-hidden">
      <div className="grid grid-cols-5">
        {passwords.map((password, index) => (
          <React.Fragment key={index}>
            <div 
              className={`col-span-4 px-3 py-2 break-all ${index < passwords.length - 1 ? 'border-b border-accent1' : ''}`}
            >
              {password}
            </div>
            <button
              onClick={() => copyPassword(index)}
              className={`px-2 py-2 text-center text-sm ${index % 2 === 1 ? 'bg-accent1 bg-opacity-70' : 'bg-accent1'} hover:bg-accent2 transition-colors ${index < passwords.length - 1 ? 'border-b border-accent1' : ''}`}
            >
              {copiedIndex === index ? 'copied!' : 'copy'}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MultiPasswordDisplay;
