# Rick & Morty Character Catalog - Backend

Backend API desarrollado con Node.js, TypeScript, Express, GraphQL (Apollo Server) y Sequelize siguiendo arquitectura hexagonal.

## Arquitectura

Este proyecto implementa **Hexagonal Architecture (Ports & Adapters)** con separación en capas:

```
src/
├── app.ts                  # Application factory (Express setup)
├── server.ts               # Entry point (Listen port)
├── core/                   # Infraestructura central
│   ├── database.ts         # Sequelize instance & sync
│   └── middlewares/        # Express Middlewares
├── modules/                # Business modules
│   └── character-catalog/
│       ├── domain/         # Domain Layer
│       │   ├── entities/   # Business entities
│       │   ├── ports/      # Repository interfaces
│       │   └── services/   # Domain services
│       ├── application/    # Application Layer
│       │   ├── use-cases/  # Use cases (business logic)
│       │   └── dtos/       # Input/Output DTOs
│       └── infrastructure/ # Infrastructure Layer
│           ├── repositories/ # Sequelize repository implementations
│           ├── models/       # Sequelize models
│           └── entrypoints/
│               └── graphql/  # GraphQL API
│                   ├── types/       # GraphQL type definitions
│                   ├── resolvers/   # GraphQL resolvers
│                   ├── controllers/ # Adaptation layer
│                   ├── dto/         # GraphQL DTOs
│                   └── index.ts     # Apollo Server config
├── shared/                 # Shared code
│   └── domain/             # BaseEntity, ValueObject
└── migrations/             # Database migrations
```

### Capas

#### Domain Layer
- **Entities**: Reglas de negocio puras, independientes de frameworks
- **Ports**: Interfaces que definen contratos (repositories, services)
- **Services**: Lógica de dominio compleja

#### Application Layer
- **Use Cases**: Orquestación de la lógica de negocio
- **DTOs**: Contratos de entrada/salida

#### Infrastructure Layer
- **Repositories**: Implementación de ports usando Sequelize
- **Models**: Definiciones de modelos Sequelize
- **Entrypoints**: Interfaces de entrada (GraphQL)
  - **Types**: Schemas GraphQL
  - **Resolvers**: Funciones resolver (orquestadores)
  - **Controllers**: Adaptadores que llaman use cases
  - **DTOs**: Validación de entrada GraphQL

## Stack Tecnológico

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **API**: GraphQL (Apollo Server)
- **ORM**: Sequelize
- **Database**: PostgreSQL / MySQL
- **Auth**: JWT + Bcrypt
- **Validation**: Zod

## Instalación

```bash
npm install
```

## Configuración

Crear archivo `.env` en la raíz:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/rickmorty
JWT_SECRET=your-secret-key
```

## Scripts

```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Build para producción
npm start            # Ejecutar en producción
npm run migrate      # Ejecutar migraciones
npm test             # Ejecutar tests
```

## Principios de Diseño

- **Dependency Inversion**: El dominio no depende de infraestructura
- **Single Responsibility**: Cada capa tiene una responsabilidad clara
- **Open/Closed**: Extensible sin modificar código existente
- **Interface Segregation**: Interfaces específicas por caso de uso
- **Testability**: Fácil testing mediante inyección de dependencias

## GraphQL API

El servidor GraphQL estará disponible en: `http://localhost:4000/graphql`

### Ejemplo de Query

```graphql
query {
  characters {
    id
    name
    status
    species
  }
}
```

## Estructura de Módulos

Cada módulo sigue la misma estructura hexagonal:
- `domain/`: Lógica de negocio pura
- `application/`: Casos de uso
- `infrastructure/`: Implementaciones técnicas

Para agregar un nuevo módulo, replicar la estructura de `character-catalog/`.
