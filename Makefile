.PHONY: up up-offline down password

up:
	docker-compose up -d

up-offline:
	docker-compose up -d -e NO_API_CHECK=true

down:
	docker-compose down

password:
	@if echo "$(ARGS)" | grep -q "\-\-help\|-h"; then \
		python3 $(PWD)/get_passwords.py --help; \
	else \
		if [ ! -f .env.password ]; then \
			cp .env.password.sample .env.password; \
			echo "Created .env.password from .env.password.sample"; \
		fi; \
		no_caps=$$(echo "$(ARGS)" | grep -q "\-\-no-caps" && echo "true" || echo "false"); \
		no_numbers=$$(echo "$(ARGS)" | grep -q "\-\-no-numbers" && echo "true" || echo "false"); \
		no_special=$$(echo "$(ARGS)" | grep -q "\-\-no-special" && echo "true" || echo "false"); \
		chars=$$(echo "$(ARGS)" | grep -oP "\-\-chars\s+\K\d+" || echo "12"); \
		no_list=$$(echo "$(ARGS)" | grep -q "\-\-no-list" && echo "true" || echo "false"); \
		quantity=$$(echo "$(ARGS)" | grep -oP "\-\-quantity=\K\d+" || echo "5"); \
		caps=$$([ "$$no_caps" = "true" ] && echo "false" || echo "true"); \
		numbers=$$([ "$$no_numbers" = "true" ] && echo "false" || echo "true"); \
		special=$$([ "$$no_special" = "true" ] && echo "false" || echo "true"); \
		container_running=$$(docker-compose ps 2>/dev/null | grep -q "Up" && echo "1" || echo "0"); \
		if [ "$$container_running" = "0" ]; then docker-compose down 2>/dev/null || true; fi; \
		sed -i.bak "s/PW_LENGTH=.*/PW_LENGTH=$$chars/; s/PW_INCLUDE_UPPERCASE=.*/PW_INCLUDE_UPPERCASE=$$caps/; s/PW_INCLUDE_DIGITS=.*/PW_INCLUDE_DIGITS=$$numbers/; s/PW_INCLUDE_SPECIAL=.*/PW_INCLUDE_SPECIAL=$$special/" .env.password; \
		docker-compose --env-file .env.password up -d 2>&1 | grep -v "Creating\|Starting\|created\|started" || true; \
		cmd="get_passwords.py"; \
		[ "$$no_caps" = "true" ] && cmd="$$cmd --no-caps"; \
		[ "$$no_numbers" = "true" ] && cmd="$$cmd --no-numbers"; \
		[ "$$no_special" = "true" ] && cmd="$$cmd --no-special"; \
		[ "$$chars" != "12" ] && cmd="$$cmd --chars $$chars"; \
		[ "$$quantity" != "5" ] && cmd="$$cmd --quantity=$$quantity"; \
		[ "$$no_list" = "true" ] && cmd="$$cmd --no-list"; \
		echo ""; \
		echo ""; \
		no_caps_val=$$([ "$$no_caps" = "true" ] && echo "true" || echo "false"); \
		no_numbers_val=$$([ "$$no_numbers" = "true" ] && echo "true" || echo "false"); \
		no_special_val=$$([ "$$no_special" = "true" ] && echo "true" || echo "false"); \
		no_list_val=$$([ "$$no_list" = "true" ] && echo "true" || echo "false"); \
		full_cmd="get_passwords.py --chars $$chars --no-caps=$$no_caps_val --no-numbers=$$no_numbers_val --no-special=$$no_special_val --quantity=$$quantity --no-list=$$no_list_val"; \
		echo "Generated Passwords via:"; \
		echo "$$full_cmd"; \
		echo "============"; \
		python3 $(PWD)/get_passwords.py $$([ "$$no_list" = "true" ] && echo "--no-list" || echo "") "--quantity=$$quantity" 2>/dev/null; \
		echo "============"; \
		echo ""; \
		if [ "$$container_running" = "0" ]; then docker-compose down 2>&1 > /dev/null || true; fi; \
		rm -f .env.password.bak; \
	fi
