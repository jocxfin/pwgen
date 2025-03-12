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
    <div className="bg-primary bg-opacity-30 rounded-lg p-4 mb-6">
      <Toggle 
        label="Include Uppercase Letters" 
        checked={options.include_uppercase} 
        onChange={handleToggleChange('include_uppercase')} 
        id="includeUppercase"
      />
      
      <div className="my-3">
        <Toggle 
          label="Include Digits" 
          checked={options.include_digits} 
          onChange={handleToggleChange('include_digits')} 
          id="includeDigits"
        />
      </div>
      
      <div className="my-3">
        <Toggle 
          label="Include Special Characters" 
          checked={options.include_special} 
          onChange={handleToggleChange('include_special')} 
          id="includeSpecial"
        />
      </div>
      
      <div className="my-3">
        <Toggle 
          label="Exclude Homoglyphs" 
          checked={options.exclude_homoglyphs} 
          onChange={handleToggleChange('exclude_homoglyphs')} 
          id="excludeHomoglyphs"
        />
      </div>
      
      <div className="mt-4">
        <Slider
          label="Length"
          value={options.length}
          onChange={handleSliderChange}
          min={1}
          max={69}
          id="lengthSlider"
        />
      </div>
    </div>
  );
};

export default PasswordOptions;
