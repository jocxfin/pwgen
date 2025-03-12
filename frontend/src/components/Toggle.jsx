import React from 'react';

const Toggle = ({ checked, onChange, id, label }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm md:text-base">{label}</span>
      <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          id={id} 
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent2"></div>
      </label>
    </div>
  );
};

export default Toggle;
