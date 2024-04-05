import os

CACHE_TYPE = 'SimpleCache'
ROBOTS_ALLOW = os.getenv('ROBOTS_ALLOW', 'true').lower() == 'true'
PW_LENGTH = int(os.getenv('PW_LENGTH', '12'))
PW_INCLUDE_UPPERCASE = os.getenv('PW_INCLUDE_UPPERCASE', 'true').lower() == 'true'
PW_INCLUDE_DIGITS = os.getenv('PW_INCLUDE_DIGITS', 'true').lower() == 'true'
PW_INCLUDE_SPECIAL = os.getenv('PW_INCLUDE_SPECIAL', 'true').lower() == 'true'
PW_EXCLUDE_HOMOGLYPHS = os.getenv('PW_EXCLUDE_HOMOGLYPHS', 'false').lower() == 'true'
PP_WORD_COUNT = int(os.getenv('PP_WORD_COUNT', '4'))
PP_CAPITALIZE = os.getenv('PP_CAPITALIZE', 'false').lower() == 'true'
PP_SEPARATOR_TYPE = os.getenv('PP_SEPARATOR_TYPE', 'dash')
PP_USER_DEFINED_SEPARATOR = os.getenv('PP_USER_DEFINED_SEPARATOR', '')
PP_MAX_WORD_LENGTH = int(os.getenv('PP_MAX_WORD_LENGTH', '7'))
PP_INCLUDE_NUMBERS = os.getenv('PP_INCLUDE_NUMBERS', 'false').lower() == 'true'
PP_INCLUDE_SPECIAL_CHARS = os.getenv('PP_INCLUDE_SPECIAL_CHARS', 'false').lower() == 'true'
PP_LANGUAGE = os.getenv('PP_LANGUAGE', 'en')
PP_LANGUAGE_CUSTOM = os.getenv('PP_LANGUAGE_CUSTOM', '')
NO_API_CHECK = os.getenv('NO_API_CHECK', 'false').lower() == 'true'
MULTI_GEN = os.getenv('MULTI_GEN', 'false').lower() == 'true'
PP_HIDE_LANG = os.getenv('PP_HIDE_LANG', 'false').lower() == 'true'
GENERATE_PP = os.getenv('GENERATE_PP', 'false').lower() == 'true'

special_characters = "!£$%^&*(){},./;:#*-+"

homoglyphs = {'o', '0', 'O', 'l', '1', 'I'}

word_list_en = []
with open('wordlist.txt', 'r') as file:
    word_list_en = [line.strip() for line in file.readlines() if len(line.strip()) <= 12]

word_list_fi = []
with open('wordlist_fi.txt', 'r') as file:
    word_list_fi = [line.strip() for line in file.readlines() if len(line.strip()) <= 12]

haveibeenpwnedapi = 'https://api.pwnedpasswords.com/range/'