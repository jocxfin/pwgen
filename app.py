from flask import Flask, jsonify, render_template, request, send_file, Response
from asgiref.wsgi import WsgiToAsgi
from flask_caching import Cache
import logging
import config
import string
import secrets
from utils.password_utils import (calculate_entropy, check_password_pwned,generate_passphrase, get_random_separator, filter_homoglyphs)
from handlers.request_handler import handle_generate_password_request

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': config.CACHE_TYPE})

@app.route('/')
def index():
    no_api_check = config.NO_API_CHECK
    multi_gen = config.MULTI_GEN
    no_lang = config.PP_HIDE_LANG
    generate_pp = config.GENERATE_PP
    
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
        'language': config.PP_LANGUAGE,
        'languageCustom': config.PP_LANGUAGE_CUSTOM
    }
    
    return render_template('index.html', no_api_check=no_api_check, pw_settings=pw_settings, pp_settings=pp_settings, multi_gen=multi_gen, no_lang=no_lang, generate_pp=generate_pp)

@app.route('/generate-password', methods=['POST'])
async def generate_password_route():
    if config.MULTI_GEN:
        passwords = [await handle_generate_password_request(request.form) for _ in range(5)]
        response_data = {"passwords": [pwd["password"] for pwd in passwords]}
    else:
        response_data = await handle_generate_password_request(request.form)
    return jsonify(response_data)

@app.route('/manifest.json')
async def serve_manifest():
    cache_key = 'manifest.json'
    cached_content = cache.get(cache_key)
    if cached_content is None:
        with open('manifest.json', 'r') as file:
            content = file.read()
            cache.set(cache_key, content, timeout=3600)
            cached_content = content
    return Response(cached_content, mimetype='application/manifest+json')

@app.route('/service-worker.js')
async def serve_sw():
    return send_file('service-worker.js', mimetype='application/javascript')

app_asgi = WsgiToAsgi(app)