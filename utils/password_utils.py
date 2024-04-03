import string
import secrets
import config
import httpx
import logging

async def fetch_custom_wordlist(url):
    if not url.endswith('.txt'):
        raise ValueError("Only .txt files are allowed for custom word lists.")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
        response.raise_for_status()
        word_list = [word.replace(" ", "-").strip() for word in response.text.splitlines() if word.strip()]
        return word_list
    except Exception as e:
        logging.error(f"Failed to fetch custom word list: {e}")
        raise
    



def filter_homoglyphs(characters, exclude_homoglyphs=False):
    if not exclude_homoglyphs:
        return characters
    filtered_chars = "".join(char for char in characters if char not in config.homoglyphs)
    return filtered_chars

def calculate_entropy(password):
    import math
    pool_size = len(set(password))
    entropy = len(password) * math.log2(pool_size)
    return entropy

def get_random_separator(separator_type, user_defined_separator=''):
    if separator_type == "number":
        return str(secrets.choice(string.digits))
    elif separator_type == "special":
        return secrets.choice(config.special_characters)
    elif separator_type == "single_character":
        return user_defined_separator
    return '-'

async def check_password_pwned(password):
    import httpx
    import hashlib
    import logging
    
    if config.NO_API_CHECK:
        logging.info("Password check against HIBP API is disabled by environment variable.")
        return False

    sha1_password = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    prefix, suffix = sha1_password[:5], sha1_password[5:]
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f'{config.haveibeenpwnedapi}{prefix}')
        hashes = (line.split(':') for line in response.text.splitlines())
        for hash_suffix, count in hashes:
            if hash_suffix == suffix:
                logging.info("Password found in HIBP database. Creating new password.")
                return True
        logging.info("Password not found in HIBP database. Serving to user.")
        return False
    except Exception as e:
        logging.error(f"Error checking password against HIBP API: {e}")
        return False

async def generate_passphrase(word_count=4, capitalize=False, separator_type='space', max_word_length=12, user_defined_separator='', include_numbers=False, include_special_chars=False, language='en', custom_word_list=None):
    if language == 'custom' and custom_word_list is not None:
        word_list = custom_word_list
    elif language == 'en':
        word_list = config.word_list_en
    elif language == 'fi':
        word_list = config.word_list_fi
    else:
        word_list = config.word_list_en    
    
    separator = get_random_separator(separator_type, user_defined_separator)

    passphrase_elements = []
    for _ in range(word_count): 
        word = secrets.choice([w for w in word_list if len(w) <= max_word_length])
        if capitalize:
            word = word.capitalize()

        if include_numbers:
            word += str(secrets.choice(range(10)))
        if include_special_chars:
            word += secrets.choice(config.special_characters)

        passphrase_elements.append(word)

    passphrase = separator.join(passphrase_elements)
    return passphrase
