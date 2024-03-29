from flask import Flask, jsonify, render_template, request, send_file
import secrets
import string
import math
import asyncio
import httpx
from flask_caching import Cache
import hashlib

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache'})

special_characters = "!@/”¥¢Œ¥#$%^&*(Σ)"

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
    sha1_password = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    prefix, suffix = sha1_password[:5], sha1_password[5:]
    async with httpx.AsyncClient() as client:
        response = await client.get(f'https://api.pwnedpasswords.com/range/{prefix}')
    hashes = (line.split(':') for line in response.text.splitlines())
    for hash_suffix, count in hashes:
        if hash_suffix == suffix:
            return True
    return False

async def generate_passphrase(word_list, word_count=4, capitalize=False, separator_type='space', max_word_length=12, user_defined_separator='', include_numbers=False, include_special_chars=False):
    attempt = 0
    while True:
        passphrase_elements = []
        for _ in range(word_count - 1):
            word = secrets.choice([w for w in word_list if len(w) <= max_word_length])
            if capitalize:
                word = word.capitalize()

            if include_numbers:
                word += str(secrets.choice(range(10)))
            if include_special_chars:
                word += secrets.choice(special_characters)

            passphrase_elements.append(word)

        final_word = secrets.choice([w for w in word_list if len(w) <= max_word_length])
        if capitalize:
            final_word = final_word.capitalize()
        passphrase_elements.append(final_word)

        passphrase = get_random_separator(separator_type, user_defined_separator).join(passphrase_elements)

        if not await check_password_pwned(passphrase) or attempt > 10:
            break
        attempt += 1

        return passphrase

@app.route('/generate-password', methods=['POST'])
async def generate_password_route():
    language = request.form.get('language', 'en')
    wordlist_filename = 'wordlist_fi.txt' if language == 'fi' else 'wordlist.txt'
    
    word_list = []
    with open(wordlist_filename, 'r') as file:
        word_list = [line.strip() for line in file.readlines() if len(line.strip()) <= 12]

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

    if generate_type == 'passphrase':
        password = await generate_passphrase(word_list, word_count, capitalize, separator_type, max_word_length, user_defined_separator, include_numbers, include_special_chars)
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

@app.route('/')
async def index():
    return render_template('index.html')

@app.route('/manifest.json')
async def serve_manifest():
    return send_file('manifest.json', mimetype='application/manifest+json')

@app.route('/service-worker.js')
async def serve_sw():
    return send_file('service-worker.js', mimetype='application/javascript')