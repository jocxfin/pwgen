import React, { useState, useEffect } from 'react';
// import Header from './components/Header'; // Uncomment when header is implemented
import PasswordOptions from './components/PasswordOptions';
import PassphraseOptions from './components/PassphraseOptions';
import PasswordDisplay from './components/PasswordDisplay';
import MultiPasswordDisplay from './components/MultiPasswordDisplay';
import Footer from './components/Footer';
import Toggle from './components/Toggle';

const App = () => {
  const [passwordOptions, setPasswordOptions] = useState({
    length: 12,
    include_uppercase: true,
    include_digits: true,
    include_special: true,
    exclude_homoglyphs: false,
  });

  const [passphraseOptions, setPassphraseOptions] = useState({
    word_count: 4,
    capitalize: false,
    include_numbers: false,
    include_special_chars: false,
    language: 'en',
    languageCustom: '',
    separator_type: 'dash',
    user_defined_separator: '',
    max_word_length: 7,
  });

  const [generatePassphrase, setGeneratePassphrase] = useState(false);
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [isMultiGen, setIsMultiGen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noApiCheck, setNoApiCheck] = useState(false);
  const [noLang, setNoLang] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then(response => response.json())
      .then(data => {
        setPasswordOptions({
          length: data.pw_settings.length,
          include_uppercase: data.pw_settings.include_uppercase,
          include_digits: data.pw_settings.include_digits,
          include_special: data.pw_settings.include_special,
          exclude_homoglyphs: data.pw_settings.exclude_homoglyphs,
        });
        
        setPassphraseOptions({
          word_count: data.pp_settings.word_count,
          capitalize: data.pp_settings.capitalize,
          include_numbers: data.pp_settings.include_numbers,
          include_special_chars: data.pp_settings.include_special_chars,
          language: data.pp_settings.language,
          languageCustom: data.pp_settings.languageCustom,
          separator_type: data.pp_settings.separator_type,
          user_defined_separator: data.pp_settings.user_defined_separator,
          max_word_length: data.pp_settings.max_word_length,
        });
        
        setGeneratePassphrase(data.generate_pp);
        setIsMultiGen(data.multi_gen);
        setNoApiCheck(data.no_api_check);
        setNoLang(data.no_lang);
        
        generatePassword();
      })
      .catch(error => {
        console.error('Error loading config:', error);
        generatePassword();
      });
  }, []);

  const generatePassword = async () => {
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('length', passwordOptions.length);
    formData.append('include_uppercase', passwordOptions.include_uppercase);
    formData.append('include_digits', passwordOptions.include_digits);
    formData.append('include_special', passwordOptions.include_special);
    formData.append('exclude_homoglyphs', passwordOptions.exclude_homoglyphs);
    formData.append('include_numbers', passphraseOptions.include_numbers);
    formData.append('include_special_chars', passphraseOptions.include_special_chars);
    formData.append('capitalize', passphraseOptions.capitalize);
    formData.append('word_count', passphraseOptions.word_count);
    formData.append('separator_type', passphraseOptions.separator_type === 'custom' ? 'single_character' : passphraseOptions.separator_type);
    
    if (passphraseOptions.separator_type === 'custom') {
      formData.append('user_defined_separator', passphraseOptions.user_defined_separator);
    }
    
    formData.append('max_word_length', passphraseOptions.max_word_length);
    formData.append('type', generatePassphrase ? 'passphrase' : 'password');
    formData.append('language', passphraseOptions.language);
    
    if (passphraseOptions.language === 'custom') {
      formData.append('languageCustom', passphraseOptions.languageCustom);
    }

    try {
      const response = await fetch('/generate-password', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.passwords && Array.isArray(data.passwords)) {
        setPasswords(data.passwords);
      } else {
        setPassword(data.password);
      }
    } catch (error) {
      console.error('Error generating password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordOptionChange = (name, value) => {
    setPasswordOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePassphraseOptionChange = (name, value) => {
    setPassphraseOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePassphraseMode = () => {
    setGeneratePassphrase(!generatePassphrase);
  };

  return (
    <div className="f{/* Header commented out for future use */}
      {/* <Header /> */}
      
ex flex-col min-h{/* Header commented out for future use */}
      {/* <Header /> */}
      
screen bg-bgColor{/* Header commented out for future use */}
      {/* <Header /> */}
      
 text-textColor">
      {/* Header commented out for future use */}
      {/* <Header /> */}
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
        <h1 className="text-3xl md:text-4xl font-bold text-headerColor mb-8">Generate a Secure Password</h1>
        
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Toggle 
              label="Generate Passphrase" 
              checked={generatePassphrase} 
              onChange={togglePassphraseMode} 
              id="passphraseToggle"
            />
          </div>
          
          {generatePassphrase ? (
            <PassphraseOptions 
              options={passphraseOptions}
              onChange={handlePassphraseOptionChange}
              noLang={noLang}
            />
          ) : (
            <PasswordOptions 
              options={passwordOptions}
              onChange={handlePasswordOptionChange}
            />
          )}
          
          {isMultiGen ? (
            <MultiPasswordDisplay 
              passwords={passwords} 
            />
          ) : (
            <PasswordDisplay 
              password={password} 
            />
          )}
          
          <div className="mt-6 flex justify-center">
            <button 
              onClick={generatePassword}
              disabled={isLoading}
              className={`bg-accent1 hover:bg-accent2 text-white py-3 px-6 rounded-lg transition-colors ${isLoading ? 'relative pr-10' : ''}`}
            >
              {isLoading ? (
                <>
                  Generating
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                </>
              ) : (
                'Generate'
              )}
            </button>
          </div>
          
          <div className="mt-8 text-center text-sm">
            {noApiCheck ? (
              <p>Offline mode enabled. No checks are ran against haveibeenpwned-API.</p>
            ) : (
              <p>
                All passwords and passphrases created are cross-referenced with 
                <a href="https://haveibeenpwned.com" target="_blank" rel="noopener noreferrer" className="text-accent2 ml-1 hover:underline">
                  haveibeenpwned
                </a>-API to guarantee they have not been compromised in past data breaches.
              </p>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
