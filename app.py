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

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache'})

word_list_en = []
with open('wordlist.txt', 'r') as file:
    word_list_en = [line.strip() for line in file.readlines() if len(line.strip()) <= 12]

word_list_fi = []
with open('wordlist_fi.txt', 'r') as file:
    word_list_fi = [line.strip() for line in file.readlines() if len(line.strip()) <= 12]

special_characters = "!£$%^&*(){},./;:#*-+"

homoglyphs = {
    'o': ['0'], '0': ['o'],
    'l': ['1', 'I'], '1': ['l', 'I'], 'I': ['1', 'l'],
}

def filter_homoglyphs(characters):
    if not exclude_homoglyphs:
        return characters
    filtered_chars = ""
    for char in characters:
        if char not in homoglyphs and all(char not in group for group in homoglyphs.values()):
            filtered_chars += char
    return filtered_chars


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
        return False

    sha1_password = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    prefix, suffix = sha1_password[:5], sha1_password[5:]
    async with httpx.AsyncClient() as client:
        response = await client.get(f'https://api.pwnedpasswords.com/range/{prefix}')
    hashes = (line.split(':') for line in response.text.splitlines())
    for hash_suffix, count in hashes:
        if hash_suffix == suffix:
            return True
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
    return render_template('index.html', no_api_check=no_api_check)

@app.route('/generate-password', methods=['POST'])
async def generate_password_route():
    language = request.form.get('language', 'en')
    length = request.form.get('length', type=int, default=12)
    include_uppercase = request.form.get('include_uppercase', 'false') == 'true'
    include_digits = request.form.get('include_digits', 'false') == 'true'
    include_special = request.form.get('include_special', 'false') == 'true'
    generate_type = request.form.get('type', 'password')
    capitalize = request.form.get('capitalize', 'false') == 'true'
    separator_type = request.form.get('separator_type', '-')
    max_word_length = request.form.get('max_word_length', type=int, default=12)
    user_defined_separator = request.form.get('user_defined_separator', '')
    word_count = request.form.get('word_count', type=int, default=4)
    include_numbers = request.form.get('include_numbers', 'false') == 'true' 
    include_special_chars = request.form.get('include_special_chars', 'false') == 'true' 
    exclude_homoglyphs = request.form.get('exclude_homoglyphs', 'false') == 'true'

    if generate_type == 'passphrase':
        password = await generate_passphrase(word_count, capitalize, separator_type, max_word_length, user_defined_separator, include_numbers, include_special_chars, language)
    else:
        characters = string.ascii_lowercase
        if include_uppercase:
            characters += string.ascii_uppercase
        if include_digits:
            characters += string.digits
        if include_special:
            characters += special_characters
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