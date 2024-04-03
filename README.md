# Secure Password Generator

## Description

This simple docker web application is designed to generate secure passwords or passphrases with customizable options. Users can opt to generate either a random password with specific criteria or a passphrase composed of random words. It includes features for enhancing password strength, such as including uppercase letters, digits, and special characters for passwords, or capitalizing words and specifying separators for passphrases.

A demo of the software is available on [https://pwgen.joonatanh.com](https://pwgen.joonatanh.com) (`main` branch).

## Features

- **User Interface**: Display the generated password or passphrase in a user-friendly interface with the option to copy it to the clipboard.
- **Security Check**: Check all generated passwords and passphrases against the haveibeenpwned database using their API to ensure users are not shown a compromised password.
- **Offline Mode**: Added a feature to disable checking passwords against the haveibeenpwned API, suitable for instances running in isolated networks or where external API access is unnecessary.
- **Environment Variable Configuration for Password/Passphrase Defaults**: Functionality to allow users to define default settings for password and passphrase generation using environment variables.
- - **Environment Variable Customization**: Configure default settings for password and passphrase generation through environment variables.
- **Security Checks**: Validates all generated passwords and passphrases against the haveibeenpwned database to ensure they haven't been previously compromised.
- **Offline Mode**: Provides an option to disable online checks against the haveibeenpwned API, ideal for isolated networks or enhanced privacy needs.
- **Multiple Generation**: Generates up to 5 passwords or passphrases simultaneously, configurable via an environment variable (`MULTI_GEN=true`).
- **Language Dropdown Control**: Allows the disabling of the language dropdown menu through an environment variable (`PP_HIDE_LANG=true`), simplifying the UI based on user preference.
- **Progressive Web Application (PWA)**: Ensures a seamless, app-like experience on various devices.
- **Comprehensive Password Generation Options**: Includes uppercase letters, digits, and special characters, with an option to exclude homoglyphs.
- **Flexible Passphrase Generation**: Offers capitalization of words, choice of separators (space, number, special character, or user-defined character), and inclusion of numbers or special characters.
- **User Interface**: Features a user-friendly interface with clipboard copy functionality for easy password and passphrase use.
- **Language Support**: Supports English and Finnish word lists for passphrase generation.
- **Custom Word Lists**: Supports fetching custom word lists from specified URLs, facilitating personalized passphrase generation. Requires URLs to start with `https://raw.githubusercontent.com/` and point to `.txt` files.



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
docker run -d -p 5069:5069 \\
  -e NO_API_CHECK=false \\
  -e PW_LENGTH=12 \\
  -e PW_INCLUDE_UPPERCASE=false \\
  -e PW_INCLUDE_DIGITS=false \\
  -e PW_INCLUDE_SPECIAL=false \\
  -e PW_EXCLUDE_HOMOGLYPHS=true \\
  -e PP_WORD_COUNT=4 \\
  -e PP_CAPITALIZE=false \\
  -e PP_SEPARATOR_TYPE=space \\
  -e PP_USER_DEFINED_SEPARATOR='' \\
  -e PP_MAX_WORD_LENGTH=12 \\
  -e PP_INCLUDE_NUMBERS=false \\
  -e PP_INCLUDE_SPECIAL_CHARS=false \\
  -e PP_LANGUAGE=en \\
  -e PP_HIDE_LANG=false \\
  -e PP_LANGUAGE_CUSTOM='' \\
  -e MULTI_GEN=true \\
  jocxfin/pwgen:latest
```
## Requirements

- Docker
- Any modern web browser

## License

This project is open-source and available under the AGPL-3.0 license.
