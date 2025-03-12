import React from 'react';
import Toggle from './Toggle';
import Slider from './Slider';

const PasswordOptions = ({ options, onChange }) => {
  const handleToggleChange = (name) => (value) => {
    onChange(name, value);
  };

  const handleSliderChange = (value) => {
    onChange('length', value);
  };

  return (
    <div className="card p-5 mb-6 animate-fade-in animate-stagger-2">
      <div className="mb-5">
        <h3 className="text-lg font-semibold mb-3 text-white/90 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Password Options
        </h3>
        <p className="text-sm text-white/60 ml-7">Customize your password generation settings</p>
      </div>
      
      <div className="space-y-1 mb-6 ml-2">
        <Toggle 
          label="Include Uppercase Letters (A-Z)" 
          checked={options.include_uppercase} 
          onChange={handleToggleChange('include_uppercase')} 
          id="includeUppercase"
        />
        
        <Toggle 
          label="Include Digits (0-9)" 
          checked={options.include_digits} 
          onChange={handleToggleChange('include_digits')} 
          id="includeDigits"
        />
        
        <Toggle 
          label="Include Special Characters (!@#$...)" 
          checked={options.include_special} 
          onChange={handleToggleChange('include_special')} 
          id="includeSpecial"
        />
        
        <Toggle 
          label="Exclude Similar Characters (O,0,l,1,I)" 
          checked={options.exclude_homoglyphs} 
          onChange={handleToggleChange('exclude_homoglyphs')} 
          id="excludeHomoglyphs"
        />
      </div>
      
      <div className="mt-6 mb-2">
        <Slider
          label="Password Length"
          value={options.length}
          onChange={handleSliderChange}
          min={8}
          max={64}
          id="lengthSlider"
        />
        
        <div className="mt-5 text-xs text-white/50 text-center">
          <p>Recommended: At least 12 characters with a mix of letters, numbers, and symbols</p>
        </div>
      </div>
    </div>
  );
};

export default PasswordOptions;
