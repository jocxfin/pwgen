import React, { useState, useEffect } from 'react';
import PasswordOptions from './components/PasswordOptions';
import PassphraseOptions from './components/PassphraseOptions';
import PasswordDisplay from './components/PasswordDisplay';
import MultiPasswordDisplay from './components/MultiPasswordDisplay';
import Footer from './components/Footer';
import Header from './components/Header';
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
  const [pageLoaded, setPageLoaded] = useState(false);

  
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
        
        
        setTimeout(() => {
          setPageLoaded(true);
        }, 300);
      })
      .catch(error => {
        console.error('Error loading config:', error);
        generatePassword();
        
        
        setTimeout(() => {
          setPageLoaded(true);
        }, 300);
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
    setPasswordOptions(prev => {
      const newOptions = {
        ...prev,
        [name]: value
      };
      
      setTimeout(() => generatePassword(), 10);
      
      return newOptions;
    });
  };

  const handlePassphraseOptionChange = (name, value) => {
    setPassphraseOptions(prev => {
      const newOptions = {
        ...prev,
        [name]: value
      };
      
      setTimeout(() => generatePassword(), 10);
      
      return newOptions;
    });
  };

  const togglePassphraseMode = () => {
    setGeneratePassphrase(prevState => {
      setTimeout(() => generatePassword(), 10);
      return !prevState;
    });
  };

  return (
    <div className="flex flex-col min-h-screen text-textColor relative overflow-x-hidden">
      <Header />


      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-accent-secondary/30 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-20 right-1/3 w-80 h-80 bg-accent-tertiary/20 rounded-full filter blur-3xl opacity-20"></div>
      </div>


      <div 
        className={`fixed inset-0 z-50 bg-bgColor flex items-center justify-center transition-opacity duration-700 ${pageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-accent animate-pulse mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-2xl font-bold text-white mt-4">Loading PwGen</h2>
          <p className="text-white/60 mt-2">Creating secure credentials for you...</p>
        </div>
      </div>
      
      <main className={`flex-1 flex flex-col items-center justify-start px-4 pb-32 mt-4 relative z-1 transition-opacity duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-headerColor mb-3">
            Generate a {generatePassphrase ? 'Passphrase' : 'Password'}
          </h2>
          <p className="text-white/60 max-w-lg">
            Create secure, random {generatePassphrase ? 'passphrases' : 'passwords'} that are checked against known data breaches
          </p>
        </div>
        
        <div className="w-full max-w-2xl">
          <div className="card p-4 mb-6 animate-fade-in">
            <Toggle 
              label={`Generate ${generatePassphrase ? 'Password' : 'Passphrase'} Instead`} 
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
          
          <div className="mt-8 flex justify-center animate-fade-in animate-stagger-5">
            <button 
              onClick={generatePassword}
              disabled={isLoading}
              className={`btn-primary group ${isLoading ? 'opacity-90' : ''}`}
            >
              <span className="flex items-center">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Generate New {generatePassphrase ? 'Passphrase' : 'Password'}
                  </>
                )}
              </span>
            </button>
          </div>
          
          <div className="card mt-8 p-4 text-center text-sm bg-opacity-50 animate-fade-in animate-stagger-5">
            <div className="flex items-center justify-center mb-2">
              {noApiCheck ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              )}
              <span className="font-medium text-white/80">
                {noApiCheck ? 'Offline Mode' : 'Security Check'}
              </span>
            </div>
            {noApiCheck ? (
              <p className="text-white/60">No checks are performed against haveibeenpwned API.</p>
            ) : (
              <p className="text-white/60">
                All generated credentials are checked against the
                <a href="https://haveibeenpwned.com" target="_blank" rel="noopener noreferrer" className="text-accent mx-1 hover:underline font-medium">
                  haveibeenpwned
                </a>
                database to ensure they haven't been compromised.
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
