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

db:
	rm -rf backend/auth-service/database.sqlite backend/game-service/game_data.sqlite backend/profile-service/profileDb.sqlite \
	backend/tournament-service/tournament_data.sqlite backend/chat-service/chat.sqlite backend/notification-service/notifications.sqlite \
	backend/relationship-service/relation.sqlite