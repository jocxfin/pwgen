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

word_list = []
with open('wordlist.txt', 'r') as file:
    word_list = [line.strip() for line in file.readlines() if len(line.strip()) <= 12]

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

async def generate_passphrase(word_count=4, capitalize=False, separator_type='space', max_word_length=12, user_defined_separator=''):
    attempt = 0
    while True:
        filtered_word_list = [word for word in word_list if len(word) <= max_word_length]
        passphrase_words = [secrets.choice(filtered_word_list) for _ in range(word_count)]
        if capitalize:
            passphrase_words = [word.capitalize() for word in passphrase_words]
        separator = get_random_separator(separator_type, user_defined_separator)
        passphrase = separator.join(passphrase_words)
        if not await check_password_pwned(passphrase) or attempt > 10:
            break
        attempt += 1
    return passphrase

@app.route('/')
async def index():
    return render_template('index.html')

@app.route('/generate-password', methods=['POST'])
async def generate_password_route():
    length = request.form.get('length', type=int, default=12)
    include_uppercase = request.form.get('include_uppercase', 'false') == 'true'
    include_digits = request.form.get('include_digits', 'false') == 'true'
    include_special = request.form.get('include_special', 'false') == 'true'
    generate_type = request.form.get('type', 'password')
    capitalize = request.form.get('capitalize', 'false') == 'true'
    separator_type = request.form.get('separator_type', 'space')
    max_word_length = request.form.get('max_word_length', type=int, default=12)
    user_defined_separator = request.form.get('user_defined_separator', '')
    word_count = request.form.get('word_count', type=int, default=4)

    if generate_type == 'passphrase':
        password = await generate_passphrase(word_count, capitalize, separator_type, max_word_length, user_defined_separator)
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