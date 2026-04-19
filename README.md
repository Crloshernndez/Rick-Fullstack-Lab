# Rick and Morty Character Browser

A full-stack application for browsing Rick and Morty characters with advanced filtering, sorting, and search capabilities.

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Apollo Client
- **Backend**: Node.js + Express + Apollo Server + GraphQL + PostgreSQL + Redis
- **Infrastructure**: Docker + Docker Compose

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- Make (optional, for using Makefile commands)

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
```bash
git clone <repository-url>
cd Rick-Fullstack-Lab
```

2. **Start all services**
```bash
docker compose up -d
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend GraphQL API**: http://localhost:4000/graphql
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

3. **Check service status**
```bash
docker compose ps
```

4. **View logs**
```bash
docker compose logs -f
docker compose logs -f frontend
docker compose logs -f backend
```

### Using Makefile

```bash
# Start all services
make up

# Stop all services
make down

# Restart services
make restart

# View logs
make logs

# Clean up everything
make clean
```

## 🔧 Local Development (Without Docker)

### Backend Setup

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Configure environment variables**
Create a `.env` file in the `backend` directory:
```env
NODE_ENV=development
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rickmorty
DB_USER=postgres
DB_PASSWORD=postgres
REDIS_HOST=localhost
REDIS_PORT=6379
RICK_MORTY_API=https://rickandmortyapi.com/api
```

3. **Start PostgreSQL and Redis** (using Docker)
```bash
docker compose up -d db redis
```

4. **Run migrations**
```bash
cd backend
npm run migrate
```

5. **Start development server**
```bash
npm run dev
```

Backend will be available at http://localhost:4000/graphql

### Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Configure environment variables**
Create a `.env` file in the `frontend` directory:
```env
VITE_GRAPHQL_URI=http://localhost:4000/graphql
```

3. **Start development server**
```bash
npm run dev
```

Frontend will be available at http://localhost:5173

## 📚 API Documentation

### GraphQL Schema

The API exposes a GraphQL endpoint at `/graphql` with the following operations:

#### Query: `characters`

Fetch characters with pagination, filtering, and sorting.

**Arguments:**
- `page` (Int): Page number (default: 1)
- `limit` (Int): Items per page (default: 20)
- `filters` (CharacterFilters): Filter criteria
- `sorting` (String): Sort order - "ASC" or "DESC" (default: "ASC")

**Filters:**
- `name` (String): Filter by character name (partial match)
- `status` (String): Filter by status - "Alive", "Dead", or "unknown"
- `species` (String): Filter by species - "Human", "Alien", etc.
- `gender` (String): Filter by gender - "Male", "Female", "Genderless", or "unknown"

**Example Query:**
```graphql
query GetCharacters {
  characters(
    page: 1
    limit: 10
    filters: {
      name: "Rick"
      status: "Alive"
      species: "Human"
    }
    sorting: "ASC"
  ) {
    info {
      count
      pages
      next
      prev
    }
    results {
      id
      name
      status
      species
      gender
      image
      origin {
        name
      }
      location {
        name
      }
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "characters": {
      "info": {
        "count": 826,
        "pages": 83,
        "next": 2,
        "prev": null
      },
      "results": [
        {
          "id": 1,
          "name": "Rick Sanchez",
          "status": "Alive",
          "species": "Human",
          "gender": "Male",
          "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
          "origin": {
            "name": "Earth (C-137)"
          },
          "location": {
            "name": "Citadel of Ricks"
          }
        }
      ]
    }
  }
}
```

### Available Species
- Alien
- Animal
- Cronenberg
- Disease
- Human
- Humanoid
- Mythological Creature
- Poopybutthole
- Robot
- unknown

### Available Statuses
- Alive
- Dead
- unknown

### Available Genders
- Female
- Genderless
- Male
- unknown

## 🎨 Frontend Features

### Search & Filter
- **Real-time search**: Search characters by name with 500ms debounce
- **Advanced filters**: Filter by status, species, and gender
- **Persistent filters**: Filters are maintained across searches
- **Active filter badge**: Shows count of active filters

### Sorting
- **A→Z / Z→A**: Sort characters alphabetically by name
- **Persistent sorting**: Sort order is maintained across filters

### UI Components
- **Responsive design**: Mobile-first approach with Tailwind breakpoints
- **Character list**: Sidebar with scrollable character items
- **Character detail**: Full character information view
- **Starred characters**: Mark favorites (frontend only, not persisted)
- **Loading states**: Skeleton screens and loading indicators
- **Error handling**: User-friendly error messages

### Component Architecture
```
src/
├── components/
│   ├── features/          # Business logic components
│   │   ├── CharacterItem
│   │   ├── CharacterDetail
│   │   ├── SearchBar
│   │   └── FilterPanel
│   ├── layout/            # Layout components
│   │   ├── CharacterSidebar
│   │   └── MainContent
│   └── ui/                # Reusable UI components
│       ├── Avatar
│       ├── FavoriteButton
│       ├── FilterGroup
│       └── FilterOption
├── hooks/                 # Custom React hooks
│   └── useCharacters.ts
├── services/             # API services
│   └── graphql/
└── types/                # TypeScript types
```

## 🗃️ Database

### Migrations
```bash
cd backend
npm run migrate           # Run pending migrations
npm run migrate:undo     # Rollback last migration
npm run migrate:status   # Check migration status
```

### Data Synchronization
The backend automatically syncs data from the Rick and Morty API:
- **Initial sync**: Runs on first startup
- **Scheduled sync**: Runs daily via cron job
- **Manual sync**: `npm run sync:manual`

## 🐳 Docker Commands

```bash
# Build and start services
docker compose up -d --build

# Stop services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v

# View logs
docker compose logs -f [service_name]

# Rebuild specific service
docker compose build [service_name]

# Execute command in container
docker compose exec backend npm run migrate
docker compose exec frontend npm run build
```

## 🔍 Troubleshooting

### Frontend container not starting
```bash
# Rebuild without cache
docker compose down
docker compose build --no-cache frontend
docker compose up -d
```

### Backend database connection issues
```bash
# Check database is running
docker compose ps db

# Check logs
docker compose logs db

# Restart database
docker compose restart db
```

### Redis connection issues
```bash
# Check Redis is running
docker compose ps redis

# Test Redis connection
docker compose exec redis redis-cli ping
```

## 📦 Production Build

### Frontend
```bash
cd frontend
npm run build
# Output: dist/
```

### Backend
```bash
cd backend
npm run build
# Output: dist/
npm start
```

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=4000
DB_HOST=db
DB_PORT=5432
DB_NAME=rickmorty
DB_USER=postgres
DB_PASSWORD=<secure-password>
REDIS_HOST=redis
REDIS_PORT=6379
RICK_MORTY_API=https://rickandmortyapi.com/api
```

### Frontend (.env)
```env
VITE_GRAPHQL_URI=http://localhost:4000/graphql
```

## 📝 Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- CSS Modules
- Apollo Client (GraphQL)
- React Router DOM

### Backend
- Node.js 20
- Express
- Apollo Server
- GraphQL
- TypeScript
- Sequelize (ORM)
- PostgreSQL
- Redis (caching)
- Node-cron (scheduled tasks)

### DevOps
- Docker & Docker Compose
- Vitest (testing)
- ESLint & Prettier
- Makefile automation