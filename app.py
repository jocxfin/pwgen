from flask import Flask, jsonify, render_template, request, send_file, Response
from asgiref.wsgi import WsgiToAsgi
from flask_caching import Cache
import logging
import config
from utils.password_utils import (
    calculate_entropy,
    check_password_pwned,
    generate_passphrase,
    get_random_separator,
    filter_homoglyphs
)
from handlers.request_handler import handle_generate_password_request

app = Flask(__name__, static_url_path=config.BASE_PATH + 'static')
cache = Cache(app, config={'CACHE_TYPE': config.CACHE_TYPE})

@app.route(config.BASE_PATH + '/')
def index():
    no_api_check = config.NO_API_CHECK
    multi_gen = config.MULTI_GEN
    no_lang = config.PP_HIDE_LANG
    generate_pp = config.GENERATE_PP
    google_site_verification = config.GOOGLE_SITE_VERIFICATION
    show_save_settings = config.SHOW_SAVE_SETTINGS

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
        'languageCustom': config.PP_LANGUAGE_CUSTOM,
        'wordListLocal': config.PP_LOCAL_WORDLIST
    }

    return render_template(
        'index.html',
        no_api_check=no_api_check,
        pw_settings=pw_settings,
        pp_settings=pp_settings,
        multi_gen=multi_gen,
        no_lang=no_lang,
        generate_pp=generate_pp,
        google_site_verification=google_site_verification,
        show_save_settings=show_save_settings,
        base_path=config.BASE_PATH
    )

@app.route(config.BASE_PATH + '/generate-password', methods=['POST'])
async def generate_password_route():
    if config.MULTI_GEN:
        passwords = [await handle_generate_password_request(request.form) for _ in range(5)]
        response_data = {"passwords": [pwd["password"] for pwd in passwords]}
    else:
        response_data = await handle_generate_password_request(request.form)
    return jsonify(response_data)

@app.route(config.BASE_PATH + '/robots.txt')
def robots():
    if not config.ROBOTS_ALLOW:
        content = """
        User-agent: *
        Disallow: /
        """
    else:
        content = """
        User-agent: *
        Disallow:
        """
    return Response(content, mimetype='text/plain')

@app.route(config.BASE_PATH + '/manifest.json')
def serve_manifest():
    return send_file('manifest.json', mimetype='application/manifest+json')

@app.route(config.BASE_PATH + '/service-worker.js')
def serve_sw():
    return send_file('service-worker.js', mimetype='application/javascript')

app_asgi = WsgiToAsgi(app)
