import React from 'react';

const PasswordStrengthIndicator = ({ strength }) => {
  const getStrengthColor = () => {
    const colors = [
      'bg-danger', 
      'bg-warning', 
      'bg-warning/80', 
      'bg-success/80', 
      'bg-success', 
    ];
    return colors[strength.level] || colors[0];
  };

  return (
    <div className="flex items-center gap-2 animate-fade-in">
      <div className="text-xs font-medium text-white/70">Strength:</div>
      <div className="flex gap-0.5">
        {[0, 1, 2, 3, 4].map((level) => (
          <div 
            key={level}
            className={`h-1.5 w-5 rounded-full transition-all duration-300 ${level <= strength.level ? getStrengthColor() : 'bg-primary-light'}`}
          ></div>
        ))}
      </div>
      <div 
        className="text-xs font-medium ml-1" 
        style={{ 
          color: strength.level >= 3 ? '#10b981' : strength.level >= 2 ? '#f59e0b' : '#ef4444'
        }}
      >
        {strength.text}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
