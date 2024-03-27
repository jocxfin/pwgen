# Secure Password Generator

## Description

This is a simple docker web application designed to generate secure passwords or passphrases with customizable options. Users can select to generate either a random password with specific criteria or a passphrase composed of random words. Additional features include the option to include uppercase letters, digits, and special characters for passwords, or to capitalize words and specify separators for passphrases.

Demo of the software is available on [https://pwgen.joonatanh.com](https://pwgen.joonatanh.com). (`main`-branch)

## Features

- Progressive Web Application(PWA)
- Generate a random password with options to include:
  - Uppercase letters
  - Digits
  - Special characters
- Generate a passphrase with options to:
  - Capitalize the first letter of each word
  - Choose a separator between words (space, random number, random special character, or a user-defined character)
  - Set the maximum word length
- Display the generated password or passphrase in a user-friendly interface
- Option to copy the generated password or passphrase to the clipboard
- More to come soon👍

## How to Use

1. Install docker
2. Run the generator by pulling the image jocxfin/pwgen:latest and then running it with the command
```bash
docker pull jocxfin/pwgen:latest
docker run -d -p 5069:5069 jocxfin/pwgen:latest
```
## Requirements

- Docker
- Any modern web browser

## License

This project is open-source and available under the AGPL-3.0 license.
