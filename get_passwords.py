#!/usr/bin/env python3
import sys
import json
import time
import urllib.request
import urllib.error
import asyncio

async def wait_for_service(max_retries=60, timeout=1):
	"""Wait for service to be ready with exponential backoff"""
	for attempt in range(max_retries):
		try:
			req = urllib.request.Request('http://localhost:5069/generate-password', method='POST')
			response = urllib.request.urlopen(req, timeout=timeout)
			return True
		except urllib.error.URLError:
			if attempt < max_retries - 1:
				await asyncio.sleep(0.5)
			continue
		except Exception:
			if attempt < max_retries - 1:
				await asyncio.sleep(0.5)
			continue
	return False

async def fetch_passwords(quantity=5):
	"""Fetch passwords from the API"""
	passwords = []
	try:
		req = urllib.request.Request('http://localhost:5069/generate-password', method='POST')
		response = urllib.request.urlopen(req)
		if response.status == 200:
			data = json.loads(response.read().decode())
			if 'passwords' in data:
				passwords = data.get('passwords', [])
			else:
				passwords = [data.get('password', 'Error generating password')]
		else:
			passwords = [f'Error: {response.status}' for _ in range(quantity)]
	except Exception as e:
		passwords = [f'Error: {str(e)}' for _ in range(quantity)]
	return passwords

async def main():
	# Check for help flag first
	if '--help' in sys.argv or '-h' in sys.argv:
		print("""Usage: get_passwords.py [OPTIONS]

Options:
  --chars N              Password length (default: 12)
  --no-caps              Exclude uppercase letters
  --no-numbers           Exclude digits
  --no-special           Exclude special characters
  --quantity N           Number of passwords to generate (default: 5)
  --no-list              Output passwords without numbering
  --help, -h             Show this help message""")
		return
	
	# Parse command line arguments more flexibly
	no_list = False
	quantity = 5
	
	# Look through all arguments for --no-list and --quantity=N
	for arg in sys.argv[1:]:
		if arg == '--no-list':
			no_list = True
		elif arg.startswith('--quantity='):
			try:
				quantity = int(arg.split('=')[1])
			except (ValueError, IndexError):
				quantity = 5
	
	# Wait for service to be ready
	print("Waiting for service to be ready...", file=sys.stderr)
	ready = await wait_for_service()
	
	if not ready:
		print("Error: Service did not become ready in time", file=sys.stderr)
		for i in range(1, quantity + 1):
			print(f'{i}. Error: Service timeout')
		return
	
	# Fetch passwords
	passwords = await fetch_passwords(quantity)
	
	# Trim to requested quantity (API may return more due to MULTI_GEN setting)
	passwords = passwords[:quantity]
	
	# Print passwords
	print()  # Blank line before passwords
	if no_list:
		# Just print passwords separated by newlines
		for pwd in passwords:
			print(pwd)
	else:
		# Print with numbering
		for idx, pwd in enumerate(passwords, 1):
			print(f'{idx}. {pwd}')
	print()  # Blank line after passwords

if __name__ == '__main__':
	asyncio.run(main())
