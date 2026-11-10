import os
import logging

CACHE_TYPE = 'SimpleCache'
ROBOTS_ALLOW = os.getenv('ROBOTS_ALLOW', 'false').lower() == 'true'
GOOGLE_SITE_VERIFICATION = os.getenv('GOOGLE_SITE_VERIFICATION', '')
PW_LENGTH = int(os.getenv('PW_LENGTH', '12') or '12')
PW_INCLUDE_UPPERCASE = os.getenv('PW_INCLUDE_UPPERCASE', 'true').lower() == 'true'
PW_INCLUDE_DIGITS = os.getenv('PW_INCLUDE_DIGITS', 'true').lower() == 'true'
PW_INCLUDE_SPECIAL = os.getenv('PW_INCLUDE_SPECIAL', 'true').lower() == 'true'
PW_EXCLUDE_HOMOGLYPHS = os.getenv('PW_EXCLUDE_HOMOGLYPHS', 'false').lower() == 'true'
PP_WORD_COUNT = int(os.getenv('PP_WORD_COUNT', '4') or '4')
PP_CAPITALIZE = os.getenv('PP_CAPITALIZE', 'false').lower() == 'true'
PP_SEPARATOR_TYPE = os.getenv('PP_SEPARATOR_TYPE', 'dash')
PP_USER_DEFINED_SEPARATOR = os.getenv('PP_USER_DEFINED_SEPARATOR', '') or ''
PP_MAX_WORD_LENGTH = int(os.getenv('PP_MAX_WORD_LENGTH', '7') or '7')
PP_INCLUDE_NUMBERS = os.getenv('PP_INCLUDE_NUMBERS', 'false').lower() == 'true'
PP_INCLUDE_SPECIAL_CHARS = os.getenv('PP_INCLUDE_SPECIAL_CHARS', 'false').lower() == 'true'
PP_LANGUAGE = os.getenv('PP_LANGUAGE', 'en')
PP_LOCAL_WORDLIST = os.getenv('PP_LOCAL_WORDLIST', '').strip()
PP_LANGUAGE_CUSTOM = os.getenv('PP_LANGUAGE_CUSTOM', '')
NO_API_CHECK = os.getenv('NO_API_CHECK', 'false').lower() == 'true'
MULTI_GEN = os.getenv('MULTI_GEN', 'false').lower() == 'true'
PP_HIDE_LANG = os.getenv('PP_HIDE_LANG', 'false').lower() == 'true'
GENERATE_PP = os.getenv('GENERATE_PP', 'false').lower() == 'true'
DISABLE_URL_CHECK = os.getenv('DISABLE_URL_CHECK', 'false').lower() == 'true'
BASE_PATH = os.getenv('BASE_PATH', '/') or '/'
SHOW_SAVE_SETTINGS = os.getenv('SHOW_SAVE_SETTINGS', 'true').lower() == 'true'

special_characters = "!£$%^&*(){},./;:#*-+"
homoglyphs = {'o', '0', 'O', 'l', '1', 'I'}

if PP_LOCAL_WORDLIST:
    try:
        with open(PP_LOCAL_WORDLIST, 'r') as file:
            word_list_en = [line.strip() for line in file.readlines() if len(line.strip()) <= 30]
    except Exception as e:
        logging.error(f"Failed to load local wordlist from {PP_LOCAL_WORDLIST}: {e}")
        with open('wordlist.txt', 'r') as file:
            word_list_en = [line.strip() for line in file.readlines() if len(line.strip()) <= 30]
else:
    with open('wordlist.txt', 'r') as file:
        word_list_en = [line.strip() for line in file.readlines() if len(line.strip()) <= 30]

with open('wordlist_fi.txt', 'r') as file:
    word_list_fi = [line.strip() for line in file.readlines() if len(line.strip()) <= 30]

with open('wordlist_fr.txt', 'r') as file:
    word_list_fr = [line.strip() for line in file.readlines() if len(line.strip()) <= 30]

haveibeenpwnedapi = 'https://api.pwnedpasswords.com/range/'
