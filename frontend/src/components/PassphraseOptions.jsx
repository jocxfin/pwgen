import React, { useState, useEffect } from 'react';
import Toggle from './Toggle';
import Slider from './Slider';

const PassphraseOptions = ({ options, onChange, noLang }) => {
  const [showCustomSeparator, setShowCustomSeparator] = useState(options.separator_type === 'custom');
  const [showCustomLanguage, setShowCustomLanguage] = useState(options.language === 'custom');

  useEffect(() => {
    setShowCustomSeparator(options.separator_type === 'custom');
  }, [options.separator_type]);

  useEffect(() => {
    setShowCustomLanguage(options.language === 'custom');
  }, [options.language]);

  const handleToggleChange = (name) => (value) => {
    onChange(name, value);
  };

  const handleSelectChange = (name) => (e) => {
    onChange(name, e.target.value);
  };

  const handleWordCountChange = (value) => {
    onChange('word_count', value);
  };

  const handleInputChange = (name) => (e) => {
    onChange(name, e.target.value);
  };

  return (
    <div className="bg-primary bg-opacity-30 rounded-lg p-4 mb-6">
      <Toggle 
        label="Capitalize Words" 
        checked={options.capitalize} 
        onChange={handleToggleChange('capitalize')} 
        id="capitalizeWords"
      />
      
      <div className="my-3">
        <Toggle 
          label="Include Numbers" 
          checked={options.include_numbers} 
          onChange={handleToggleChange('include_numbers')} 
          id="includeNumbers"
        />
      </div>
      
      <div className="my-3">
        <Toggle 
          label="Include Special Characters" 
          checked={options.include_special_chars} 
          onChange={handleToggleChange('include_special_chars')} 
          id="includeSpecialChars"
        />
      </div>
      
      {!noLang && (
        <div className="my-3">
          <label htmlFor="languageSelect" className="block mb-2 text-sm md:text-base">Language:</label>
          <select
            id="languageSelect"
            value={options.language}
            onChange={handleSelectChange('language')}
            className="w-full bg-primary border-2 border-accent1 text-textColor rounded-lg px-3 py-2"
          >
            <option value="en">English</option>
            <option value="fi">Finnish</option>
            <option value="fr">French</option>
            <option value="custom">Custom list</option>
          </select>
          
          {showCustomLanguage && (
            <input
              type="text"
              id="customLanguage"
              placeholder="Enter custom url for text file"
              value={options.languageCustom}
              onChange={handleInputChange('languageCustom')}
              className="w-full mt-2 bg-primary border-2 border-accent1 text-textColor rounded-lg px-3 py-2"
            />
          )}
        </div>
      )}
      
      <div className="my-3">
        <label htmlFor="separator" className="block mb-2 text-sm md:text-base">Separator:</label>
        <select
          id="separator"
          value={options.separator_type}
          onChange={handleSelectChange('separator_type')}
          className="w-full bg-primary border-2 border-accent1 text-textColor rounded-lg px-3 py-2"
        >
          <option value="dash">Dash</option>
          <option value="number">Random Number</option>
          <option value="special">Random Special Character</option>
          <option value="space">Space</option>
          <option value="custom">User Defined</option>
        </select>
        
        {showCustomSeparator && (
          <input
            type="text"
            id="customSeparator"
            placeholder="Enter custom separator"
            value={options.user_defined_separator}
            onChange={handleInputChange('user_defined_separator')}
            className="w-full mt-2 bg-primary border-2 border-accent1 text-textColor rounded-lg px-3 py-2"
          />
        )}
      </div>
      
      <div className="my-3">
        <label htmlFor="maxWordLength" className="block mb-2 text-sm md:text-base">Max Word Length:</label>
        <select
          id="maxWordLength"
          value={options.max_word_length}
          onChange={handleSelectChange('max_word_length')}
          className="w-full bg-primary border-2 border-accent1 text-textColor rounded-lg px-3 py-2"
        >
          {[3, 5, 6, 7, 9, 12, 16].map(length => (
            <option key={length} value={length}>{length}</option>
          ))}
        </select>
      </div>
      
      <div className="mt-4">
        <Slider
          label="Word Count"
          value={options.word_count}
          onChange={handleWordCountChange}
          min={2}
          max={10}
          id="wordCountSlider"
        />
      </div>
    </div>
  );
};

export default PassphraseOptions;
