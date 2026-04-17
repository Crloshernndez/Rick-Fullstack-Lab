# Variables
DOCKER_COMPOSE = docker-compose
BACKEND_DIR = backend
FRONTEND_DIR = frontend

.PHONY: help install dev build start stop restart logs clean test

# =============================================================================
# HELP
# =============================================================================
help: ## Muestra los comandos disponibles
	@echo "Comandos disponibles:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# =============================================================================
# LOCAL DEVELOPMENT (sin Docker)
# =============================================================================
install: ## Instala dependencias localmente (backend + frontend)
	@echo "Installing backend dependencies..."
	cd $(BACKEND_DIR) && npm install
	@echo "Installing frontend dependencies..."
	cd $(FRONTEND_DIR) && npm install

dev-backend: ## Ejecuta el backend en modo desarrollo (local)
	cd $(BACKEND_DIR) && npm run dev

dev-frontend: ## Ejecuta el frontend en modo desarrollo (local)
	cd $(FRONTEND_DIR) && npm run dev

dev: ## Ejecuta backend y frontend en modo desarrollo (local) - requiere terminales separadas
	@echo "⚠️  Ejecuta 'make dev-backend' y 'make dev-frontend' en terminales separadas"

build-backend: ## Compila el backend (local)
	cd $(BACKEND_DIR) && npm run build

build-frontend: ## Compila el frontend (local)
	cd $(FRONTEND_DIR) && npm run build

test-backend-local: ## Ejecuta los tests del backend (local)
	cd $(BACKEND_DIR) && npm run test

test-frontend-local: ## Ejecuta los tests del frontend (local)
	cd $(FRONTEND_DIR) && npm run test

test-local: ## Ejecuta todos los tests (local)
	@echo "Running backend tests..."
	cd $(BACKEND_DIR) && npm run test
	@echo "Running frontend tests..."
	cd $(FRONTEND_DIR) && npm run test

lint-backend: ## Ejecuta el linter del backend (local)
	cd $(BACKEND_DIR) && npm run lint

lint-frontend: ## Ejecuta el linter del frontend (local)
	cd $(FRONTEND_DIR) && npm run lint

# =============================================================================
# DOCKER DEVELOPMENT
# =============================================================================
docker-build: ## Construye las imágenes de Docker
	$(DOCKER_COMPOSE) build

docker-up: ## Levanta los contenedores en segundo plano
	$(DOCKER_COMPOSE) up -d

docker-up-logs: ## Levanta los contenedores mostrando logs
	$(DOCKER_COMPOSE) up

docker-down: ## Detiene y elimina los contenedores
	$(DOCKER_COMPOSE) down

docker-restart: docker-down docker-up ## Reinicia todos los servicios Docker

docker-logs: ## Muestra los logs en tiempo real
	$(DOCKER_COMPOSE) logs -f

docker-logs-backend: ## Muestra los logs del backend
	$(DOCKER_COMPOSE) logs -f backend

docker-logs-frontend: ## Muestra los logs del frontend
	$(DOCKER_COMPOSE) logs -f frontend

docker-logs-db: ## Muestra los logs de la base de datos
	$(DOCKER_COMPOSE) logs -f db

docker-logs-redis: ## Muestra los logs de Redis
	$(DOCKER_COMPOSE) logs -f redis

docker-ps: ## Muestra el estado de los contenedores
	$(DOCKER_COMPOSE) ps

docker-shell-backend: ## Abre una shell en el contenedor del backend
	$(DOCKER_COMPOSE) exec backend sh

docker-shell-frontend: ## Abre una shell en el contenedor del frontend
	$(DOCKER_COMPOSE) exec frontend sh

docker-shell-db: ## Abre una shell en el contenedor de PostgreSQL
	$(DOCKER_COMPOSE) exec db psql -U postgres -d rickmortydb

docker-shell-redis: ## Abre una shell en el contenedor de Redis
	$(DOCKER_COMPOSE) exec redis redis-cli

# =============================================================================
# DATABASE (Docker)
# =============================================================================
docker-migrate: ## Ejecuta las migraciones de Sequelize (Docker)
	$(DOCKER_COMPOSE) exec backend npx sequelize-cli db:migrate

docker-migrate-undo: ## Revierte la última migración (Docker)
	$(DOCKER_COMPOSE) exec backend npx sequelize-cli db:migrate:undo

docker-seed: ## Ejecuta los seeders (Docker)
	$(DOCKER_COMPOSE) exec backend npx sequelize-cli db:seed:all

docker-seed-undo: ## Revierte los seeders (Docker)
	$(DOCKER_COMPOSE) exec backend npx sequelize-cli db:seed:undo:all

docker-db-reset: ## Resetea la base de datos (Docker)
	$(DOCKER_COMPOSE) exec backend npx sequelize-cli db:drop
	$(DOCKER_COMPOSE) exec backend npx sequelize-cli db:create
	$(DOCKER_COMPOSE) exec backend npx sequelize-cli db:migrate
	$(DOCKER_COMPOSE) exec backend npx sequelize-cli db:seed:all

# =============================================================================
# TESTING (Docker)
# =============================================================================
docker-test-backend: ## Ejecuta los tests del backend (Docker)
	$(DOCKER_COMPOSE) exec backend npm run test

docker-test-frontend: ## Ejecuta los tests del frontend (Docker)
	$(DOCKER_COMPOSE) exec frontend npm run test

docker-test-backend-coverage: ## Ejecuta los tests del backend con coverage (Docker)
	$(DOCKER_COMPOSE) exec backend npm run test:coverage

docker-test-frontend-coverage: ## Ejecuta los tests del frontend con coverage (Docker)
	$(DOCKER_COMPOSE) exec frontend npm run test:coverage

# =============================================================================
# CLEANUP
# =============================================================================
clean: ## Limpia archivos temporales y cache (local)
	@echo "Cleaning build artifacts..."
	rm -rf $(BACKEND_DIR)/dist $(FRONTEND_DIR)/dist
	rm -rf $(BACKEND_DIR)/coverage $(FRONTEND_DIR)/coverage
	rm -rf $(BACKEND_DIR)/node_modules $(FRONTEND_DIR)/node_modules

docker-clean: ## Limpia contenedores, volúmenes e imágenes de Docker
	$(DOCKER_COMPOSE) down -v --remove-orphans --rmi local

docker-clean-all: ## Limpia todo (contenedores, volúmenes, imágenes y cache)
	$(DOCKER_COMPOSE) down -v --remove-orphans --rmi all
	docker system prune -af --volumes

# =============================================================================
# SHORTCUTS
# =============================================================================
up: docker-up ## Alias para docker-up
down: docker-down ## Alias para docker-down
logs: docker-logs ## Alias para docker-logs
restart: docker-restart ## Alias para docker-restart