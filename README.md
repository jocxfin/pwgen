# Secure Password Generator

## Description

This simple docker web application is designed to generate secure passwords or passphrases with customizable options. Users can opt to generate either a random password with specific criteria or a passphrase composed of random words. It includes features for enhancing password strength, such as including uppercase letters, digits, and special characters for passwords, or capitalizing words and specifying separators for passphrases.

A demo of the software is available on [https://pwgen.joonatanh.com](https://pwgen.joonatanh.com) (`main` branch).

## Features

- **Progressive Web Application (PWA)**
- **Password Generation**: Generate a random password with options to include:
  - Uppercase letters
  - Digits
  - Special characters
  - Option to exclude homoglyphs (similar-looking characters)
- **Passphrase Generation**: Generate a passphrase with options to:
  - Capitalize the first letter of each word
  - Choose a separator between words (space, random number, random special character, or a user-defined character)
  - Option to add either numbers or special characters after the words
  - Set the maximum word length
  - Use either English or Finnish word list
- **User Interface**: Display the generated password or passphrase in a user-friendly interface with the option to copy it to the clipboard.
- **Security Check**: Check all generated passwords and passphrases against the haveibeenpwned database using their API to ensure users are not shown a compromised password.
- **Offline Mode**: Added a feature to disable checking passwords against the haveibeenpwned API, suitable for instances running in isolated networks or where external API access is unnecessary.
- **Environment Variable Configuration for Password/Passphrase Defaults**: Functionality to allow users to define default settings for password and passphrase generation using environment variables. 

## How to Use

1. **Install Docker** if you haven't already.
2. **Run the Generator**: Pull the image `jocxfin/pwgen:latest` and then run it using the following commands:

```bash
docker pull jocxfin/pwgen:latest
docker run -d -p 5069:5069 jocxfin/pwgen:latest
```

To enable **Offline Mode**, append `-e NO_API_CHECK=true` to the `docker run` command:

```bash
docker run -d -p 5069:5069 -e NO_API_CHECK=true jocxfin/pwgen:latest
```

With environmental variables defining settings:

```bash
docker pull jocxfin/pwgen:latest
docker run -d -p 5069:5069 \
  -e NO_API_CHECK=false \
  -e PW_LENGTH=12 \
  -e PW_INCLUDE_UPPERCASE=false \
  -e PW_INCLUDE_DIGITS=false \
  -e PW_INCLUDE_SPECIAL=false \
  -e PW_EXCLUDE_HOMOGLYPHS=true \
  -e PP_WORD_COUNT=4 \
  -e PP_CAPITALIZE=false \
  -e PP_SEPARATOR_TYPE=space \
  -e PP_USER_DEFINED_SEPARATOR='' \
  -e PP_MAX_WORD_LENGTH=12 \
  -e PP_INCLUDE_NUMBERS=false \
  -e PP_INCLUDE_SPECIAL_CHARS=false \
  -e PP_LANGUAGE=en \
  jocxfin/pwgen:latest
```
## Requirements

- Docker
- Any modern web browser

## License

This project is open-source and available under the AGPL-3.0 license.
