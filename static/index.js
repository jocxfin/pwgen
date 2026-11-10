const passphraseToggle = document.getElementById('passphraseToggle');
const saveSettingsCheckbox = document.getElementById('saveSettings');
const capitalizeWords = document.getElementById('capitalizeWords');
const wordCountSlider = document.getElementById('wordCountSlider');
const wordCountValue = document.getElementById('wordCountValue');
const separator = document.getElementById('separator');
const customSeparator = document.getElementById('customSeparator');
const maxWordLength = document.getElementById('maxWordLength');
const passwordInput = document.getElementById('password');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const includeUppercase = document.getElementById('includeUppercase');
const includeDigits = document.getElementById('includeDigits');
const includeSpecial = document.getElementById('includeSpecial');
const includeNumbers = document.getElementById('includeNumbers');
const includeSpecialChars = document.getElementById('includeSpecialChars');
const excludeHomoglyphs = document.getElementById('excludeHomoglyphs');
const refreshpw = document.getElementById('refreshpw');
const languageSelect = document.getElementById('languageSelect');
const BASE_PATH = window.BASE_PATH || '';

separator.onchange = () => {
  customSeparator.style.display = separator.value === 'custom' ? 'block' : 'none';
  generatePassword();
  saveSettings();
};

passphraseToggle.onchange = () => {
  togglePassphraseOptions();
  saveSettings();
};

if (saveSettingsCheckbox) {
  saveSettingsCheckbox.addEventListener('change', saveSettings);
}

function togglePassphraseOptions() {
  document.getElementById('passwordOptions').style.display = passphraseToggle.checked ? 'none' : 'block';
  document.getElementById('passphraseOptions').style.display = passphraseToggle.checked ? 'block' : 'none';
  customSeparator.style.display = 'none';
  generatePassword();
}

document.querySelectorAll('input, select').forEach(element => {
  if (element.id !== 'passphraseToggle' && element.id !== 'separator' && element.id !== 'saveSettings') {
    element.addEventListener('change', () => {
      generatePassword();
      saveSettings();
    });
  }
});

async function generatePassword() {
  const formData = new FormData();
  formData.append('length', lengthSlider.value);
  formData.append('include_uppercase', includeUppercase.checked);
  formData.append('include_digits', includeDigits.checked);
  formData.append('include_special', includeSpecial.checked);
  formData.append('exclude_homoglyphs', excludeHomoglyphs.checked);
  formData.append('include_numbers', includeNumbers.checked);
  formData.append('include_special_chars', includeSpecialChars.checked);
  formData.append('capitalize', capitalizeWords.checked);
  formData.append('word_count', wordCountSlider.value);
  formData.append('separator_type', separator.value === 'custom' ? 'single_character' : separator.value);
  if (separator.value === 'custom') {
    formData.append('user_defined_separator', customSeparator.value);
  }
  formData.append('max_word_length', maxWordLength.value);
  formData.append('type', passphraseToggle.checked ? 'passphrase' : 'password');
  formData.append('language', languageSelect.value);
  if (languageSelect.value === 'custom') {
    formData.append('languageCustom', customLanguage.value);
  }

  fetch(`${BASE_PATH}generate-password`, {
    method: 'POST',
    body: formData
  })
    .then(refreshpw.classList.add('loading'))
    .then(response => response.json())
    .then(data => {
      if (data.passwords && Array.isArray(data.passwords)) {
        data.passwords.forEach((pwd, index) => {
          if (index < 5) {
            document.querySelector(`.multipw${index}`).textContent = pwd;
            refreshpw.classList.remove('loading');
          }
        });
      } else {
        passwordInput.value = data.password;
        scrambleAnimation(data.password);
        refreshpw.classList.remove('loading');
      }
    })
    .catch(error => {
      console.error('Error generating password:', error);
    });
}

function scrambleAnimation(finalPassword) {
  let scrambled = Array.from({ length: finalPassword.length }, () => getRandomCharacter());
  passwordInput.value = scrambled.join('');
  const maxDelay = 300;

  finalPassword.split('').forEach((char, index) => {
    let delay = Math.random() * maxDelay;
    setTimeout(() => {
      scrambled[index] = char;
      passwordInput.value = scrambled.join('');
    }, delay);
  });
}

function getRandomCharacter() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{ }|;:\'",.<>/?';
  return characters.charAt(Math.floor(Math.random() * characters.length));
}

refreshpw.addEventListener("click", async function () {
  refreshpw.classList.add('loading');
  generatePassword();
}, false);

wordCountSlider.oninput = function () {
  wordCountValue.innerText = this.value;
};

lengthSlider.oninput = function () {
  lengthValue.innerText = this.value;
};

function copyPassword(index) {
  let password;
  if (index === 100) {
    password = document.querySelector('.password-container #password').value;
  } else {
    password = document.querySelector(`.multipw${index}`).textContent;
  }

  function updateButtonText(isFallback = false) {
    if (index === 100) {
      const button = document.querySelector('.password-container #copypwd');
      button.innerHTML = "copied!";
      setTimeout(() => {
        button.innerHTML = 'copy password';
      }, 1500);
    } else {
      const buttons = document.querySelectorAll(`.multipwcp${index}`);
      buttons.forEach(button => {
        button.innerHTML = "copied!";
        setTimeout(() => {
          button.innerHTML = 'copy';
        }, 1500);
      });
    }
  }

  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(password).then(() => {
      console.log('Password copied to clipboard');
      updateButtonText();
    }).catch((err) => {
      console.error('Error copying password to clipboard, using fallback:', err);
      fallbackCopy();
    });
  } else {
    fallbackCopy();
  }

  function fallbackCopy() {
    const textArea = document.createElement("textarea");
    textArea.value = password;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      console.log(`Fallback: Copying text command was ${successful ? 'successful' : 'unsuccessful'}`);
      updateButtonText(true);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  }
}

function saveSettings() {
  if (saveSettingsCheckbox) {
    if (saveSettingsCheckbox.checked) {
      const settings = {
        includeUppercase: includeUppercase.checked,
        includeDigits: includeDigits.checked,
        includeSpecial: includeSpecial.checked,
        excludeHomoglyphs: excludeHomoglyphs.checked,
        length: lengthSlider.value,
        passphraseToggle: passphraseToggle.checked,
        capitalizeWords: capitalizeWords.checked,
        includeNumbers: includeNumbers.checked,
        includeSpecialChars: includeSpecialChars.checked,
        wordCount: wordCountSlider.value,
        separator: separator.value,
        customSeparator: customSeparator.value,
        maxWordLength: maxWordLength.value,
        language: languageSelect.value,
        customLanguage: document.getElementById('customLanguage').value,
      };
      document.cookie = `pwgen-settings=${JSON.stringify(settings)};path=/;max-age=31536000;samesite=strict`;
    } else {
      document.cookie = 'pwgen-settings=;path=/;max-age=-1';
    }
  }
}

function loadSettings() {
  const cookies = document.cookie.split('; ');
  const settingsCookie = cookies.find(row => row.startsWith('pwgen-settings='));
  if (settingsCookie) {
    try {
      const settings = JSON.parse(settingsCookie.substring(settingsCookie.indexOf('=') + 1));

      includeUppercase.checked = settings.includeUppercase;
      includeDigits.checked = settings.includeDigits;
      includeSpecial.checked = settings.includeSpecial;
      excludeHomoglyphs.checked = settings.excludeHomoglyphs;
      lengthSlider.value = settings.length;
      lengthValue.innerText = settings.length;
      passphraseToggle.checked = settings.passphraseToggle;
      capitalizeWords.checked = settings.capitalizeWords;
      includeNumbers.checked = settings.includeNumbers;
      includeSpecialChars.checked = settings.includeSpecialChars;
      wordCountSlider.value = settings.wordCount;
      wordCountValue.innerText = settings.wordCount;
      separator.value = settings.separator;
      if (separator.value === 'custom') {
        customSeparator.style.display = 'block';
        customSeparator.value = settings.customSeparator;
      }
      maxWordLength.value = settings.maxWordLength;
      languageSelect.value = settings.language;
      if (languageSelect.value === 'custom') {
        document.getElementById('customLanguage').style.display = 'block';
        document.getElementById('customLanguage').value = settings.customLanguage;
      }
      if (saveSettingsCheckbox) {
        saveSettingsCheckbox.checked = true;
      }
      togglePassphraseOptions();
    } catch (e) {
      console.error('Error parsing settings cookie:', e);
      document.cookie = 'pwgen-settings=;path=/;max-age=-1';
    }
  }
}

window.addEventListener('load', loadSettings);
