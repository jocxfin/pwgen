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
    <div className="card p-5 mb-6 animate-fade-in animate-stagger-2">
      <div className="mb-5">
        <h3 className="text-lg font-semibold mb-3 text-white/90 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Passphrase Options
        </h3>
        <p className="text-sm text-white/60 ml-7">Create a memorable passphrase with multiple words</p>
      </div>
      
      <div className="space-y-1 mb-6 ml-2">
        <Toggle 
          label="Capitalize Words" 
          checked={options.capitalize} 
          onChange={handleToggleChange('capitalize')} 
          id="capitalizeWords"
        />
        
        <Toggle 
          label="Include Numbers" 
          checked={options.include_numbers} 
          onChange={handleToggleChange('include_numbers')} 
          id="includeNumbers"
        />
        
        <Toggle 
          label="Include Special Characters" 
          checked={options.include_special_chars} 
          onChange={handleToggleChange('include_special_chars')} 
          id="includeSpecialChars"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
        {!noLang && (
          <div className="space-y-2">
            <label htmlFor="languageSelect" className="block text-sm font-medium text-white/90">Word List Language:</label>
            <div className="relative">
              <select
                id="languageSelect"
                value={options.language}
                onChange={handleSelectChange('language')}
                className="input-field appearance-none pr-10"
              >
                <option value="en">English</option>
                <option value="fi">Finnish</option>
                <option value="fr">French</option>
                <option value="custom">Custom list</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/50">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {showCustomLanguage && (
              <div className="mt-3">
                <label htmlFor="customLanguage" className="block text-xs font-medium text-white/70 mb-1">Custom Word List URL:</label>
                <input
                  type="text"
                  id="customLanguage"
                  placeholder="https://raw.githubusercontent.com/...txt"
                  value={options.languageCustom}
                  onChange={handleInputChange('languageCustom')}
                  className="input-field text-sm"
                />
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="separator" className="block text-sm font-medium text-white/90">Word Separator:</label>
          <div className="relative">
            <select
              id="separator"
              value={options.separator_type}
              onChange={handleSelectChange('separator_type')}
              className="input-field appearance-none pr-10"
            >
              <option value="dash">Dash (-)</option>
              <option value="number">Random Number</option>
              <option value="special">Random Special Character</option>
              <option value="space">Space</option>
              <option value="custom">Custom Separator</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/50">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {showCustomSeparator && (
            <div className="mt-3">
              <label htmlFor="customSeparator" className="block text-xs font-medium text-white/70 mb-1">Custom Separator:</label>
              <input
                type="text"
                id="customSeparator"
                placeholder="Enter your custom separator"
                value={options.user_defined_separator}
                onChange={handleInputChange('user_defined_separator')}
                className="input-field text-sm"
                maxLength={3}
              />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="maxWordLength" className="block text-sm font-medium text-white/90">Maximum Word Length:</label>
          <div className="relative">
            <select
              id="maxWordLength"
              value={options.max_word_length}
              onChange={handleSelectChange('max_word_length')}
              className="input-field appearance-none pr-10"
            >
              {[3, 5, 6, 7, 9, 12, 16].map(length => (
                <option key={length} value={length}>{length} characters</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/50">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 mb-2">
        <Slider
          label="Number of Words"
          value={options.word_count}
          onChange={handleWordCountChange}
          min={2}
          max={10}
          id="wordCountSlider"
        />
        
        <div className="mt-5 text-xs text-white/50 text-center">
          <p>Tip: A passphrase with 4-5 random words is typically very secure and easier to remember</p>
        </div>
      </div>
    </div>
  );
};

export default PassphraseOptions;
