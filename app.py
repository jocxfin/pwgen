from flask import Flask, jsonify, render_template, request, send_file
from asgiref.wsgi import WsgiToAsgi
from flask_caching import Cache
import logging
import config
import string
import secrets
from password_utils import (calculate_entropy, check_password_pwned,generate_passphrase, get_random_separator, filter_homoglyphs)

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': config.CACHE_TYPE})

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
    include_uppercase = request.form.get('include_uppercase', config.PW_INCLUDE_UPPERCASE).lower() == 'true'
    include_digits = request.form.get('include_digits', config.PW_INCLUDE_DIGITS).lower() == 'true'
    include_special = request.form.get('include_special', config.PW_INCLUDE_SPECIAL).lower() == 'true'
    exclude_homoglyphs = request.form.get('exclude_homoglyphs', config.PW_EXCLUDE_HOMOGLYPHS).lower() == 'true'
    generate_type = request.form.get('type', 'password')
    capitalize = request.form.get('capitalize', config.PP_CAPITALIZE).lower() == 'true'
    separator_type = request.form.get('separator_type', config.PP_SEPARATOR_TYPE)
    max_word_length = request.form.get('max_word_length', type=int, default=config.PP_MAX_WORD_LENGTH)
    user_defined_separator = request.form.get('user_defined_separator', config.PP_USER_DEFINED_SEPARATOR)
    word_count = request.form.get('word_count', type=int, default=config.PP_WORD_COUNT)
    include_numbers = request.form.get('include_numbers', config.PP_INCLUDE_NUMBERS).lower() == 'true'
    include_special_chars = request.form.get('include_special_chars', config.PP_INCLUDE_SPECIAL_CHARS).lower() == 'true'

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