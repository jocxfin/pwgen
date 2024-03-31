from flask import Flask, jsonify, render_template, request, send_file
from asgiref.wsgi import WsgiToAsgi
from flask_caching import Cache
import os
import string
import math
import asyncio
import httpx
import hashlib
import secrets
import logging
import config

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': config.CACHE_TYPE})

def filter_homoglyphs(characters, exclude_homoglyphs=False):
    if not exclude_homoglyphs:
        return characters
    filtered_chars = "".join(char for char in characters if char not in config.homoglyphs)
    return filtered_chars

def calculate_entropy(password):
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

async def generate_passphrase(word_count=4, capitalize=False, separator_type='space', max_word_length=12, user_defined_separator='', include_numbers=False, include_special_chars=False, language='en'):
    attempt = 0
    word_list = config.word_list_en if language == 'en' else config.word_list_fi
    
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
                word += secrets.choice(config.special_characters)

            passphrase_elements.append(word)

        passphrase = separator.join(passphrase_elements)

        if not await check_password_pwned(passphrase) or attempt > 10:
            break
        attempt += 1
    return passphrase


@app.route('/')
def index():
    no_api_check = config.NO_API_CHECK
    
    pw_settings = {
        'length': config.PW_LENGTH,
        'include_uppercase': config.PW_INCLUDE_UPPERCASE,
        'include_digits': config.PW_INCLUDE_DIGITS,
        'include_special': config.PW_INCLUDE_SPECIAL,
        'exclude_homoglyphs': config.PW_EXCLUDE_HOMOGLYPHS
    }
    
    pp_settings = {
        'word_count': config.PP_WORD_COUNT,
        'capitalize': config.PP_CAPITALIZE,
        'separator_type': config.PP_SEPARATOR_TYPE,
        'user_defined_separator': config.PP_USER_DEFINED_SEPARATOR,
        'max_word_length': config.PP_MAX_WORD_LENGTH,
        'include_numbers': config.PP_INCLUDE_NUMBERS,
        'include_special_chars': config.PP_INCLUDE_SPECIAL_CHARS,
        'language': config.PP_LANGUAGE
    }
    
    return render_template('index.html', no_api_check=no_api_check, pw_settings=pw_settings, pp_settings=pp_settings)


@app.route('/generate-password', methods=['POST'])
async def generate_password_route():
    language = request.form.get('language', config.PP_LANGUAGE)
    length = request.form.get('length', type=int, default=config.PW_LENGTH)
    include_uppercase = request.form.get('include_uppercase', 'true').lower() == 'true' if config.PW_INCLUDE_UPPERCASE else 'false'
    include_digits = request.form.get('include_digits', 'true').lower() == 'true' if config.PW_INCLUDE_DIGITS else 'false'
    include_special = request.form.get('include_special', 'true').lower() == 'true' if config.PW_INCLUDE_SPECIAL else 'false'
    exclude_homoglyphs = request.form.get('exclude_homoglyphs', 'true').lower() == 'true' if config.PW_EXCLUDE_HOMOGLYPHS else 'false'
    generate_type = request.form.get('type', 'password')
    capitalize = request.form.get('capitalize', 'true').lower() == 'true' if config.PP_CAPITALIZE else 'false'
    separator_type = request.form.get('separator_type', config.PP_SEPARATOR_TYPE)
    max_word_length = request.form.get('max_word_length', type=int, default=config.PP_MAX_WORD_LENGTH)
    user_defined_separator = request.form.get('user_defined_separator', config.PP_USER_DEFINED_SEPARATOR)
    word_count = request.form.get('word_count', type=int, default=config.PP_WORD_COUNT)
    include_numbers = request.form.get('include_numbers', 'true').lower() == 'true' if config.PP_INCLUDE_NUMBERS else 'false'
    include_special_chars = request.form.get('include_special_chars', 'true').lower() == 'true' if config.PP_INCLUDE_SPECIAL_CHARS else 'false'

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
            special_chars = filter_homoglyphs(config.special_characters, True)
            characters += special_chars
    else:
        if include_uppercase:
            characters += string.ascii_uppercase
        if include_digits:
            characters += string.digits
        if include_special:
            characters += config.special_characters



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