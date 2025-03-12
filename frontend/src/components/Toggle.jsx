import React from 'react';

const Toggle = ({ checked, onChange, id, label }) => {
  return (
    <div className="flex items-center justify-between py-2 relative group animate-fade-in">
      <span className="text-sm md:text-base font-medium text-white/90 group-hover:text-white transition-colors duration-200">
        {label}
      </span>
      <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          id={id} 
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-12 h-6 bg-primary-dark peer-focus:outline-none rounded-full peer 
                      peer-checked:after:translate-x-7 
                      peer-checked:after:border-white 
                      after:content-[''] 
                      after:absolute 
                      after:top-[2px] 
                      after:left-[2px] 
                      after:bg-white/80 
                      after:border-transparent 
                      after:border 
                      after:rounded-full 
                      after:h-5 
                      after:w-5 
                      after:shadow-md 
                      after:transition-all 
                      peer-checked:bg-accent 
                      peer-checked:after:bg-white 
                      peer-focus:ring-2 
                      peer-focus:ring-accent/30 
                      border border-white/10 
                      transition-all duration-300 
                      group-hover:border-white/30">
        </div>
      </label>
    </div>
  );
};

export default Toggle;
