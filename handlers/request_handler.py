import config
import string
import secrets
from utils.password_utils import (
    calculate_entropy, check_password_pwned, generate_passphrase,
    get_random_separator, filter_homoglyphs, fetch_custom_wordlist)

def get_bool(request_form, field_name, default):
    return request_form.get(field_name, str(default)).lower() == 'true'

async def handle_generate_password_request(request_form):
    language = request_form.get('language', config.PP_LANGUAGE)
    languageCustom = request_form.get('languageCustom', config.PP_LANGUAGE_CUSTOM)
    length = int(request_form.get('length', config.PW_LENGTH))
    include_uppercase = get_bool(request_form, 'include_uppercase', config.PW_INCLUDE_UPPERCASE)
    include_digits = get_bool(request_form, 'include_digits', config.PW_INCLUDE_DIGITS)
    include_special = get_bool(request_form, 'include_special', config.PW_INCLUDE_SPECIAL)
    exclude_homoglyphs = get_bool(request_form, 'exclude_homoglyphs', config.PW_EXCLUDE_HOMOGLYPHS)
    generate_type = request_form.get('type', 'password')
    capitalize = get_bool(request_form, 'capitalize', config.PP_CAPITALIZE)
    separator_type = request_form.get('separator_type', config.PP_SEPARATOR_TYPE)
    max_word_length = int(request_form.get('max_word_length', config.PP_MAX_WORD_LENGTH))
    user_defined_separator = request_form.get('user_defined_separator', config.PP_USER_DEFINED_SEPARATOR)
    word_count = int(request_form.get('word_count', config.PP_WORD_COUNT))
    include_numbers = get_bool(request_form, 'include_numbers', config.PP_INCLUDE_NUMBERS)
    include_special_chars = get_bool(request_form, 'include_special_chars', config.PP_INCLUDE_SPECIAL_CHARS)

    custom_word_list = None
    if language not in ['en', 'fi']:
        try:
            custom_word_list = await fetch_custom_wordlist(languageCustom)
        except Exception as e:
            return {"password": f"Error: Failed to fetch custom word list due to {e}", "entropy": 0}
        language = 'custom'

    characters = string.ascii_lowercase
    if exclude_homoglyphs:
        characters = filter_homoglyphs(characters, True)
    if include_uppercase:
        characters += string.ascii_uppercase if not exclude_homoglyphs else filter_homoglyphs(string.ascii_uppercase, True)
    if include_digits:
        characters += string.digits if not exclude_homoglyphs else filter_homoglyphs(string.digits, True)
    if include_special:
        characters += config.special_characters if not exclude_homoglyphs else filter_homoglyphs(config.special_characters, True)

    if generate_type == 'passphrase':
        password = await generate_passphrase(word_count, capitalize, separator_type, max_word_length, user_defined_separator, include_numbers, include_special_chars, language, custom_word_list)
        while True:
            passphrase_is_pwned = await check_password_pwned(password)
            if not passphrase_is_pwned or attempt > 10:
                break
            attempt += 1
    else:
        password = ''.join(secrets.choice(characters) for _ in range(length))
        attempt = 0
        while True:
            password_is_pwned = await check_password_pwned(password)
            if not password_is_pwned or attempt > 10:
                break
            password = ''.join(secrets.choice(characters) for _ in range(length))
            attempt += 1

    entropy = calculate_entropy(password)
    return {"password": password, "entropy": entropy}