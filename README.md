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
- **Local Settings Storage**: Ability to save all generation settings in a browser cookie for persistence between visits. This can be toggled on or off by the user.
- **Security Checks**: Validates all generated passwords and passphrases against the haveibeenpwned database to ensure they haven't been previously compromised.
- **Offline Mode**: Provides an option to disable online checks against the haveibeenpwned API, ideal for isolated networks or enhanced privacy needs.
- **Multiple Generation**: Generates up to 5 passwords or passphrases simultaneously, configurable via an environment variable (`MULTI_GEN=true`).
- **Language Dropdown Control**: Allows the disabling of the language dropdown menu through an environment variable (`PP_HIDE_LANG=true`), simplifying the UI based on user preference.
- **Progressive Web Application (PWA)**: Ensures a seamless, app-like experience on various devices.
- **Comprehensive Password Generation Options**: Includes uppercase letters, digits, and special characters, with an option to exclude homoglyphs.
- **Flexible Passphrase Generation**: Offers capitalization of words, choice of separators (space, number, special character, or user-defined character), and inclusion of numbers or special characters.
- **User Interface**: Features a user-friendly interface with clipboard copy functionality for easy password and passphrase use.
- **Language Support**: Supports English, Finnish and French word lists for passphrase generation.
- **Custom Word Lists**: Supports fetching custom word lists from specified URLs and local files, facilitating personalized passphrase generation. By default URLs are required to start with `https://raw.githubusercontent.com/` and point to `.txt` files, but this can be disabled to allow other sources as well.

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
  -e PP_SEPARATOR_TYPE=dash \\
  -e PP_USER_DEFINED_SEPARATOR='' \\
  -e PP_MAX_WORD_LENGTH=12 \\
  -e PP_INCLUDE_NUMBERS=false \\
  -e PP_INCLUDE_SPECIAL_CHARS=false \\
  -e PP_LANGUAGE=en \\
  -e PP_HIDE_LANG=false \\
  -e PP_LANGUAGE_CUSTOM='' \\
  -e MULTI_GEN=true \\
  -e GENERATE_PP=true \\
  -e SHOW_SAVE_SETTINGS=true \\
  -e ROBOTS_ALLOW=false \\
  -e GOOGLE_SITE_VERIFICATION='' \\
  -e DISABLE_URL_CHECK=false \\
  -e BASE_PATH='' \\
  -e PP_LOCAL_WORDLIST=/app/custom_wordlist.txt \\
  -v "A:\german.txt:/app/custom_wordlist.txt" \\
  jocxfin/pwgen:latest
```

## Requirements

- Docker
- Any modern web browser

## CLI Usage (Quick Password Generation)

If you want to quickly generate passwords without running a persistent container, you can use the included scripts via the `get_passwords.py` directly or by using `Makefile` to handle handoff, spinnng up, and shutting down Docker.

### Prerequisites

- `make`
- Docker and Docker Compose

### Quick Start

Generate 5 passwords and exit:

```bash
make password
```

Output:

```text
Generated Passwords via:
get_passwords.py --chars 12 --no-caps=false --no-numbers=false --no-special=false --quantity=5 --no-list=false
============

1. v/£mab-Q4h7C
2. zphA£#;Z!Tn2
3. yNPwPmTEX7K,
4. q&eK55tNjBF4
5. $GSP4Q5iRE6E

============
```

### View Help

See all available options:

```bash
make password ARGS="--help"
```

Output:

```text
Usage: get_passwords.py [OPTIONS]

Options:
  --chars N              Password length (default: 12)
  --no-caps              Exclude uppercase letters
  --no-numbers           Exclude digits
  --no-special           Exclude special characters
  --quantity N           Number of passwords to generate (default: 5)
  --no-list              Output passwords without numbering
  --help, -h             Show this help message
```

### Customization Examples

Generate 3 passwords without listing numbers:

```bash
make password ARGS="--quantity=3 --no-list"
```

Generate a longer, safer password (32 characters):

```bash
make password ARGS="--chars 32"
```

Output:

```text
Generated Passwords via:
get_passwords.py --chars 32 --no-caps=false --no-numbers=false --no-special=false --quantity=5 --no-list=false
============

1. Exn-E£wAv9NmjZbN8Xx*L58CbUv8.Twn
2. s!D{9&M*p#£hK}YuZ2vW(xL;q^r@,
3. nJ%kL$mN&*pQ(rS)tU+vW-xY.zA/b[c]
4. 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
5. zA9yB8xC7wD6vE5uF4tG3sH2rI1qJ0kL

============
```

Generate only lowercase and numbers (no special chars, no uppercase):

```bash
make password ARGS="--no-caps --no-special"
```

Generate a single alphanumeric password (no special characters):

```bash
make password ARGS="--chars 20 --no-special --quantity=1"
```

Combine all options:

```bash
make password ARGS="--chars 24 --no-caps --no-numbers --quantity=2 --no-list"
```

Output:

```text
Generated Passwords via:
get_passwords.py --chars 24 --no-caps=true --no-numbers=true --no-special=false --quantity=2 --no-list=true
============

#ip%£j)g$hgdymwq..sz/cs;
mdhn*%f.q/b,%n£z£hgr$&^;

============
```

### Remote Usage

For extremely short-lived requests you can call the makefile in one command by `curl`ing the Makefile and running directly:

```bash
curl https://raw.githubusercontent.com/postphotos/pwgen/main/Makefile | make password ARGS="--chars 20 --no-special"
```

### Direct Python Script Usage

For more advanced use cases or scripting, you can call the Python script directly. The script only supports `--quantity` and `--no-list` parameters (other options must be set via environment variables or the Makefile). First, ensure the service is running:

```bash
# Start the service
make up
```

Then call the script with parameters:

```bash
python get_passwords.py --no-list --quantity=3
```

Output:

```text
Waiting for service to be ready...

v/£mab-Q4h7C
zphA£#;Z!Tn2
yNPwPmTEX7K,

```

With quantity only:

```bash
python get_passwords.py --quantity=2
```

Output:

```text
Waiting for service to be ready...

1. GYtWnfqWkACDvYCGrVVp
2. UHP6DDfRhaDCVfaitmBg

```

**Note:** To use other password options (character length, character types, etc.), use the `make password` command with the ARGS parameter or set environment variables in `.env.password` before running the script.

For a single command without Makefile wrapper:

```bash
# Start service, generate 2 passwords, and shut down
docker-compose up -d && sleep 3 && python get_passwords.py --quantity=2 && docker-compose down
```

### Other Make Targets

- `make up` - Start the service in the foreground
- `make up-offline` - Start in offline mode (no API checks against haveibeenpwned)
- `make down` - Stop the running service

## License

This project is open-source and available under the AGPL-3.0 license.
