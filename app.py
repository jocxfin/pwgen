from flask import Flask, jsonify, render_template, request, send_file
from asgiref.wsgi import WsgiToAsgi
import os
import string
import math
import asyncio
import httpx
from flask_caching import Cache
import hashlib
import secrets
import logging

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache'})

word_list_en = []
with open('wordlist.txt', 'r') as file:
    word_list_en = [line.strip() for line in file.readlines() if len(line.strip()) <= 12]

word_list_fi = []
with open('wordlist_fi.txt', 'r') as file:
    word_list_fi = [line.strip() for line in file.readlines() if len(line.strip()) <= 12]

special_characters = "!£$%^&*(){},./;:#*-+"

homoglyphs = {'o', '0', 'O', 'l', '1', 'I'}

def filter_homoglyphs(characters, exclude_homoglyphs=False):
    if not exclude_homoglyphs:
        return characters
    filtered_chars = "".join(char for char in characters if char not in homoglyphs)
    return filtered_chars

def load_env_defaults():
    global env_pw_settings, env_pp_settings
    env_pw_settings = {
        'length': int(os.getenv('PW_LENGTH', '12')),
        'include_uppercase': os.getenv('PW_INCLUDE_UPPERCASE', 'true').lower() == 'true',
        'include_digits': os.getenv('PW_INCLUDE_DIGITS', 'true').lower() == 'true',
        'include_special': os.getenv('PW_INCLUDE_SPECIAL', 'true').lower() == 'true',
        'exclude_homoglyphs': os.getenv('PW_EXCLUDE_HOMOGLYPHS', 'false').lower() == 'true'
    }
    
    env_pp_settings = {
        'word_count': int(os.getenv('PP_WORD_COUNT', '4')),
        'capitalize': os.getenv('PP_CAPITALIZE', 'false').lower() == 'true',
        'separator_type': os.getenv('PP_SEPARATOR_TYPE', 'space'),
        'user_defined_separator': os.getenv('PP_USER_DEFINED_SEPARATOR', ''),
        'max_word_length': int(os.getenv('PP_MAX_WORD_LENGTH', '7')),
        'include_numbers': os.getenv('PP_INCLUDE_NUMBERS', 'false').lower() == 'true',
        'include_special_chars': os.getenv('PP_INCLUDE_SPECIAL_CHARS', 'false').lower() == 'true',
        'language': os.getenv('PP_LANGUAGE', 'en')
    }

load_env_defaults()


def calculate_entropy(password):
    pool_size = len(set(password))
    entropy = len(password) * math.log2(pool_size)
    return entropy

def get_random_separator(separator_type, user_defined_separator=''):
    if separator_type == "number":
        return str(secrets.choice(string.digits))
    elif separator_type == "special":
        return secrets.choice(special_characters)
    elif separator_type == "single_character":
        return user_defined_separator
    return '-'

async def check_password_pwned(password):
    if os.getenv('NO_API_CHECK', 'false').lower() == 'true':
        logging.info("Password check against HIBP API is disabled by environment variable.")
        return False

    sha1_password = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    prefix, suffix = sha1_password[:5], sha1_password[5:]
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f'https://api.pwnedpasswords.com/range/{prefix}')
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

async def generate_passphrase(word_count=4, capitalize=False, separator_type='space', max_word_length=12, user_defined_separator='', include_numbers=False, include_special_chars=False, language='en'):
    attempt = 0
    word_list = word_list_en if language == 'en' else word_list_fi
    
    separator = get_random_separator(separator_type, user_defined_separator)

    while True:
        passphrase_elements = []
        for _ in range(word_count): 
            word = secrets.choice([w for w in word_list if len(w) <= max_word_length])
            if capitalize:
                word = word.capitalize()

            if include_numbers:
                word += str(secrets.choice(range(10)))
            if include_special_chars:
                word += secrets.choice(special_characters)

            passphrase_elements.append(word)

        passphrase = separator.join(passphrase_elements)

        if not await check_password_pwned(passphrase) or attempt > 10:
            break
        attempt += 1
    return passphrase


@app.route('/')
def index():
    no_api_check = os.getenv('NO_API_CHECK', 'false').lower() == 'true'
    return render_template('index.html', no_api_check=no_api_check, pw_settings=env_pw_settings, pp_settings=env_pp_settings)



@app.route('/generate-password', methods=['POST'])
async def generate_password_route():
    language = request.form.get('language', env_pp_settings['language'])
    length = request.form.get('length', type=int, default=env_pw_settings['length'])
    include_uppercase = request.form.get('include_uppercase', 'true' if env_pw_settings['include_uppercase'] else 'false') == 'true'
    include_digits = request.form.get('include_digits', 'true' if env_pw_settings['include_digits'] else 'false') == 'true'
    include_special = request.form.get('include_special', 'true' if env_pw_settings['include_special'] else 'false') == 'true'
    exclude_homoglyphs = request.form.get('exclude_homoglyphs', 'true' if env_pw_settings['exclude_homoglyphs'] else 'false') == 'true'
    generate_type = request.form.get('type', 'password')
    capitalize = request.form.get('capitalize', 'true' if env_pp_settings['capitalize'] else 'false') == 'true'
    separator_type = request.form.get('separator_type', env_pp_settings['separator_type'])
    max_word_length = request.form.get('max_word_length', type=int, default=env_pp_settings['max_word_length'])
    user_defined_separator = request.form.get('user_defined_separator', env_pp_settings['user_defined_separator'])
    word_count = request.form.get('word_count', type=int, default=env_pp_settings['word_count'])
    include_numbers = request.form.get('include_numbers', 'true' if env_pp_settings['include_numbers'] else 'false') == 'true'
    include_special_chars = request.form.get('include_special_chars', 'true' if env_pp_settings['include_special_chars'] else 'false') == 'true'

    characters = string.ascii_lowercase
    if exclude_homoglyphs:
        characters = filter_homoglyphs(characters, True)
        if include_uppercase:
            uppercase_chars = filter_homoglyphs(string.ascii_uppercase, True)
            characters += uppercase_chars
        if include_digits:
            digit_chars = filter_homoglyphs(string.digits, True)
            characters += digit_chars
        if include_special:
            special_chars = filter_homoglyphs(special_characters, True)
            characters += special_chars
    else:
        if include_uppercase:
            characters += string.ascii_uppercase
        if include_digits:
            characters += string.digits
        if include_special:
            characters += special_characters



    if generate_type == 'passphrase':
        password = await generate_passphrase(word_count, capitalize, separator_type, max_word_length, user_defined_separator, include_numbers, include_special_chars, language)
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
    return jsonify(password=password, entropy=entropy)




@app.route('/manifest.json')
async def serve_manifest():
    return send_file('manifest.json', mimetype='application/manifest+json')

@app.route('/service-worker.js')
async def serve_sw():
    return send_file('service-worker.js', mimetype='application/javascript')

app_asgi = WsgiToAsgi(app)