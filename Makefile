re:
	docker compose down
	docker compose up --build -d

down:
	docker compose down

up:
	docker compose up --build -d

logs:
	docker compose logs -f

ps:
	docker compose ps