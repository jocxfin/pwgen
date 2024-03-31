document.addEventListener('DOMContentLoaded', function () {
document.getElementById('lengthSlider').value = {{ pw_settings.length }};
document.getElementById('includeUppercase').checked = {{ pw_settings.include_uppercase | tojson }};
document.getElementById('includeDigits').checked = {{ pw_settings.include_digits | tojson }};
document.getElementById('includeSpecial').checked = {{ pw_settings.include_special | tojson }};
document.getElementById('excludeHomoglyphs').checked = {{ pw_settings.exclude_homoglyphs | tojson }};
document.getElementById('lengthValue').innerText = {{ pw_settings.length }};

document.getElementById('wordCountSlider').value = {{ pp_settings.word_count }};
document.getElementById('capitalizeWords').checked = {{ pp_settings.capitalize | tojson }};
document.getElementById('includeNumbers').checked = {{ pp_settings.include_numbers | tojson }};
document.getElementById('includeSpecialChars').checked = {{ pp_settings.include_special_chars | tojson }};
document.getElementById('languageSelect').value = "{{ pp_settings.language }}";
document.getElementById('wordCountValue').innerText = {{ pp_settings.word_count }};

document.getElementById('maxWordLength').value = {{ pp_settings.max_word_length }};
const separatorValue = "{{ pp_settings.separator_type }}";
document.getElementById('separator').value = separatorValue;
if (separatorValue === 'custom') {
    document.getElementById('customSeparator').style.display = 'block';
    document.getElementById('customSeparator').value = "{{ pp_settings.user_defined_separator }}";
}

const passphraseToggle = document.getElementById('passphraseToggle');
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

separator.onchange = () => customSeparator.style.display = separator.value === 'custom' ? 'block' : 'none';

passphraseToggle.onchange = togglePassphraseOptions;

function togglePassphraseOptions() {
    document.getElementById('passwordOptions').style.display = passphraseToggle.checked ? 'none' : 'block';
    document.getElementById('passphraseOptions').style.display = passphraseToggle.checked ? 'block' : 'none';
    customSeparator.style.display = 'none';
    generatePassword();
}

document.querySelectorAll('input, select').forEach(element => {
    if (element.id !== 'passphraseToggle') {
        element.addEventListener('change', generatePassword);
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

    fetch('/generate-password', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok.');
            return response.json();
        })
        .then(data => {
            scrambleAnimation(data.password);
        })
        .catch(error => {
            console.error('Error generating password:', error);
        });
}

function scrambleAnimation(finalPassword) {
    let scrambled = Array.from({ length: finalPassword.length }, () => getRandomCharacter());
    passwordInput.value = scrambled.join('');
    const maxDelay = 300;
    let indexes = Array.from({ length: finalPassword.length }, (_, i) => i);

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

    await generatePassword();

    setTimeout(() => {
        refreshpw.classList.remove('loading');
    }, 690);
}, false);

wordCountSlider.oninput = function () {
    wordCountValue.innerText = this.value;
}

lengthSlider.oninput = function () {
    lengthValue.innerText = this.value;
}

generatePassword();
});