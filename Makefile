docker-up-admin:
	docker compose -f docker-compose.yaml -f docker-compose.admin.yaml up --build -d

docker-down-admin:
	docker compose -f docker-compose.yaml -f docker-compose.admin.yaml down

docker-up-dev:
	docker compose -f docker-compose.dev.yml up

docker-down-dev:
	docker compose -f docker-compose.dev.yml down

docker-up:
	docker compose -f docker-compose.yaml up --build -d

docker-down:
	docker compose -f docker-compose.yaml down
