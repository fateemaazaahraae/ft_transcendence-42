re:
	docker compose down -v
	docker compose up --build -d

down:
	docker compose down -v

up:
	docker compose up --build -d

logs:
	docker compose logs -f

ps:
	docker compose ps