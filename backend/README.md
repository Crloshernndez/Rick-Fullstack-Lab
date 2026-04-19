# Rick & Morty Character Catalog - Backend

Backend API desarrollado con Node.js, TypeScript, Express, GraphQL (Apollo Server) y Sequelize siguiendo arquitectura hexagonal.

## Arquitectura

Este proyecto implementa **Hexagonal Architecture (Ports & Adapters)** con separación en capas:

```
src/
├── app.ts                  # Application factory (Express setup)
├── server.ts               # Entry point (Listen port)
├── core/                   # Infraestructura central
│   ├── database/           # Database configuration
│   │   └── migrations/     # Database migrations
│   ├── cache/              # Cache layer (Redis, in-memory, etc.)
│   └── middlewares/        # Express Middlewares
├── modules/                # Business modules
│   ├── character-catalog/
│   │   ├── domain/         # Domain Layer
│   │   │   ├── entities/   # Business entities
│   │   │   ├── ports/      # Repository interfaces
│   │   │   └── services/   # Domain services
│   │   ├── application/    # Application Layer
│   │   │   ├── use-cases/  # Use cases (business logic)
│   │   │   └── dtos/       # Input/Output DTOs
│   │   └── infrastructure/ # Infrastructure Layer
│   │       ├── persistence/
│   │       │   └── sequelize/
│   │       │       ├── repositories/ # Sequelize repository implementations
│   │       │       └── models/       # Sequelize models
│   │       └── entrypoints/
│   │           └── graphql/  # GraphQL API
│   │               ├── types/       # GraphQL type definitions
│   │               ├── resolvers/   # GraphQL resolvers
│   │               ├── controllers/ # Adaptation layer
│   │               ├── dto/         # GraphQL DTOs
│   │               └── index.ts     # Apollo Server config
│   └── data-sync/          # Data synchronization module
│       ├── domain/
│       ├── application/
│       │   └── use-cases/
│       └── infrastructure/
│           └── persistence/
│               └── sequelize/
│                   └── models/
└── shared/                 # Shared code
    ├── domain/             # BaseEntity, ValueObject
    ├── exceptions/         # Custom exceptions system
    └── models/             # Shared Sequelize models
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
npm run sync:initial # Sincronización inicial de personajes
npm run sync:manual  # Sincronización manual de personajes
```

## Sincronización de Datos

El sistema implementa sincronización automática de personajes desde la API de Rick and Morty, con tres tipos de sincronización:

### Tipos de Sincronización

1. **Initial Sync** (`npm run sync:initial`):
   - Se ejecuta al iniciar la aplicación por primera vez
   - Sincroniza un número limitado de personajes (configurable con `INITIAL_CHARACTERS` en `.env`)
   - Solo se ejecuta una vez (usa guard para prevenir ejecuciones duplicadas)
   - Registra el tipo como `initial` en los logs

2. **Scheduled Sync** (Cron automático):
   - Se ejecuta cada 12 horas automáticamente
   - Sincroniza todos los personajes disponibles
   - Marca personajes faltantes como deprecados
   - Registrado en `src/crons/sync-characters.cron.ts`

3. **Manual Sync** (`npm run sync:manual`):
   - Permite ejecutar sincronización completa manualmente
   - Útil para actualizar datos bajo demanda
   - Registra el tipo como `manual` en los logs

### Funcionamiento

- **Paginación**: Procesa personajes página por página
- **Bulk Operations**: Usa operaciones masivas para mejor rendimiento
- **Logging**: Registra cada sincronización en la tabla `cron_logs` con estadísticas
- **Error Handling**: Captura y registra errores sin detener la aplicación
- **Deprecation**: En sincronizaciones completas, marca personajes que ya no existen en la API

### Configuración

```env
INITIAL_CHARACTERS=15              # Límite de personajes en sync inicial
RICK_AND_MORTY_API_URL=...         # URL de la API de Rick and Morty
```

## Sistema de Excepciones

El proyecto implementa un sistema de excepciones personalizado basado en el **Principio de Sustitución de Liskov (LSP)**, permitiendo que todas las excepciones derivadas de `BaseApplicationError` puedan ser tratadas de manera polimórfica.

### Arquitectura de Excepciones

```typescript
BaseApplicationError (abstract)
├── DomainException           // 400 - Violaciones de reglas de negocio
├── ValidationException       // 422 - Errores de validación de datos
├── NotFoundException         // 404 - Recursos no encontrados
├── InfrastructureException   // 503 - Errores de servicios externos
└── RepositoryException       // 500 - Errores de base de datos
```

### Características

- **Códigos de error consistentes**: Generación automática de códigos desde el nombre de la clase
- **HTTP status codes**: Cada excepción mapea a un código HTTP apropiado
- **Metadata flexible**: Campo `details` para información adicional contextual
- **Stack traces**: Captura automática para debugging
- **Integración GraphQL**: Formato de error estandarizado en respuestas GraphQL

### Ejemplo de Uso

```typescript
// En casos de uso o servicios
if (!character) {
  throw new NotFoundException('Character', characterId);
}

if (!isValidEmail(email)) {
  throw new ValidationException('Invalid email format', {
    field: 'email',
    value: email
  });
}
```

### Formato de Respuesta GraphQL

```json
{
  "errors": [{
    "message": "Character with id '999' not found",
    "extensions": {
      "code": "NOT_FOUND",
      "status": 404,
      "details": {}
    }
  }]
}
```

## Principios de Diseño

- **Dependency Inversion**: El dominio no depende de infraestructura
- **Single Responsibility**: Cada capa tiene una responsabilidad clara
- **Open/Closed**: Extensible sin modificar código existente
- **Liskov Substitution**: Sistema de excepciones polimórfico y extensible
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
