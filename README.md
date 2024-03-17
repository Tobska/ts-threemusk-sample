# nextpay-backend

NextPay Backend (v2).

Wanna start right away? Go to [Quick Start](#quick-start)!

## Prerequisites

- Docker
- Docker Compose
- Make

## Usage

#### configure

```bash
$ make .env
```

- See generated `.env` file for configuration.

#### install dependencies (generate `node_modules`)

```bash
$ make deps
```

#### install dependencies (generate `node_modules`) using [clean install](https://docs.npmjs.com/cli/v9/commands/npm-ci)

```bash
$ make depsCi
```

#### install new dependencies

```bash
$ make depsAdd packages="${packages}"
```

#### uninstall existing dependencies

```bash
$ make depsRemove packages="${packages}"
```

#### run all tests

```bash
$ make test
```

#### run unit tests

```bash
$ make testUnit
```

#### run integration tests

```bash
$ make testInt
```

#### run particular test spec (i.e., specific test, not test filename)

```bash
$ make testSpec spec="{name}"
```

#### run particular test file or tests in path

```bash
$ make testFile file="{file}"

# e.g.
# make testFile file="src/middlewares/auth.test.ts"
# make testFile file="src/middlewares"
```

#### run particular unit test file or unit tests in path (NOTE: This does not load .env, check for node modules nor start containers)

```bash
$ make testUnitFile file="{file}"

# e.g.
# make testUnitFile file="src/middlewares/auth.test.ts"
# make testUnitFile file="src/middlewares"
```

#### run linter (autofix)

```bash
$ make lint
```

#### run code formatter

```bash
$ make format
```

#### transpile TS -> JS (generate `dist`)

```bash
$ make compile
```

#### build Docker image

```bash
$ make build
```

#### start local database

```bash
$ make startDb
```

#### start local Redis server

```bash
$ make startRedis
```

#### start local Unleash server

```bash
$ make startUnleash
```

#### start local dummy server (used for mocking BE v1 endpoints)

```bash
$ make startDummyServer
```

#### start local services (e.g., DB, Redis, Unleash)

```bash
$ make startLocalServices
```

#### start application (using ts-node with nodemon)

```bash
$ make startDev
```

#### start application (requires TS to have already been transpiled to JS)

```bash
$ make start
```

#### stop docker compose containers

```bash
$ make stop
```

#### sync `schema.prisma` with DB and update Prisma client

```bash
$ make prismaSyncSchema
```

- **Caution:** This executes `prisma db pull` which can [potentially overwrite](https://www.prisma.io/docs/reference/api-reference/command-reference#db-pull) previous manual changes to `schema.prisma`. Unfortunately, until Prisma addresses this [issue](https://github.com/prisma/prisma/issues/13517), entity relationships would probably need to be defined manually in `schema.prisma` to allow querying of related entities using Prisma client (i.e., Strapi API DB does not make use of foreign keys). Possible alternatives include:
  - using a separate query for related entities
  - using [raw SQL](https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw) with join

#### generate `schema.graphql`

```bash
$ make graphqlSchema
```

#### generate TS types based on `schema.graphql`

```bash
$ make graphqlTypes
```

#### run lint, format, and test for merge request readiness

```bash
$ make mrReady
```

### Note:

Make targets that utilize Docker containers (i.e., executing `docker compose`) have corresponding targets that can be run on host machine directly which typically come in the form of "\_" + target using Docker container (e.g., `make compile` has matching `make _compile` which does not spin up a Docker container). The targets that start with underscore will naturally have assumptions as to the execution environment (i.e, specific versions of tools intalled, etc.).

## Quick Start

```bash
# directly after cloning this repository:

# install node_modules
$ make deps

# ensure all tests are passing
$ make test

# if instances of local services (e.g., DB, Redis, Unleash) should be created
$ make startLocalServices
# NOTE: No need to run this if connecting to existing instances (i.e., local services running from NextPay Strapi API codebase). The .env file can just be configured accordingly ("host.docker.internal" can be used as value for host).

# start local instance of the app (with nodemon to detect code changes)
$ make startDev

# to clean up local dev environment
$ make stop
```

## Migrating a domain from NextPay Strapi API codebase

- Create domain directory `src/domains/{new domain}`
  - Note: subdomains can be grouped under a parent domain for codebase structuring
- Add `schema.ts` with a class implementing the `Schema` interface
  - `typeDefs` should contain the relevant type definitions from the generated GraphQL schema in NextPay Strapi API codebase (i.e., `nextpay` repo)
    - See `packages/backend-api/exports/graphql/schema.graphql`
      - Copy type definitions that are related to the domain being migrated (including the ones under `type Query` and `type Mutation`)
        - The copied type definitions can be placed in a `typedefs.ts` module under the created domain directory and referenced in `schema.ts`
      - Type definitions that are expected to be used by multiple domains can be placed in `src/domains/common/schema.ts`
  - `resolvers` can initially be left empty (`{}`)
- Add an instance of the domain schema in the `subSchemas` list in `src/base/init.ts`
  - Note: `index.ts` can be added first in the domain directory to group exports instead of importing directly from `schema.ts` module
- Run `make graphqlSchema` to generate `schema.graphql` with the newly added type definitions
- Run `make graphqlTypes` to generate TS types based on `schema.graphql` (to avoid writing them manually)
  - The types can be found in `src/types/generated.ts`
- Implement `resolvers` for the domain schema
  - The generated TS types for the domain can be used in the implementation of resolvers
    - The generated type for the main domain entity can be extended in `models.ts` (e.g., `Foo` in `generated.ts` can be extended as `FooEntity`)
      - This allows for adding relationship IDs or other custom attributes to the main domain entity
  - Typically entails implementing the ff:
    - Data access layer
      - i.e., `repository.ts`
      - Encapsulates all DB-related implementation
    - Service layer
      - i.e., `service.ts`
      - Contains any business logic for the domain
      - Service layer can contain the Data access layer (i.e., composition)
        - Possibly multiple Repositories
      - Service layer can also contain other dependencies such as clients for cache, message queue, external API, etc.
        - Interfaces should be used for dependency injection (i.e., should not depend on concrete implementation)
      - If there is a need for an atomic transaction in the Service layer, the `Transactional` abstraction from `src/database/transaction.ts` can be used (e.g., Service class can have an attribute with `Transactional` type to allow mocking in tests)
    - Access validation
      - Can be configured per resolver in `schema.ts`
      - Validation helpers are available under `src/validate`
  - If the interfaces that will be used to communicate between layers could be defined first, the development of the actual implementation of the different layers can be worked on in parallel (i.e., non-blocking)
  - [Child resolvers](https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-chains)
    - Below are the typical use cases where we would want to implement a child resolver for a particular field of a defined GraphQL type:
      - [Parameterized field](https://graphql.org/learn/queries/#arguments)
      - Non-scalar field (i.e., field with a value that does not resolve to a primitive type)
    - Implementation for child resolvers can be optimized by using [DataLoader](https://github.com/graphql/dataloader#using-with-graphql)

## Syncing changes to DB schema

- Dump the latest schema from a running `nextpay_api` database
  - e.g., local database instance running from Strapi API codebase
    - `pg_dump -h localhost -p 5432 -U postgres --schema-only nextpay_api > 01_nextpay_api_db_schema.sql`
- Replace `db/01_nextpay_api_db_schema.sql` with the new schema dump
- Start a new instance of the database
  - Check that there is no currently running `postgres` container for `nextpay-backend`, then run `make startDb`
- Confirm that the database config in `.env` is pointing to the started database instance
- Run `make prismaSyncSchema` to update `db/schema.prisma` and generate the corresponding Prisma client

## Building REST endpoints

- Implement Controller layer for the resource
  - e.g., in `controller.ts` under related domain directory
  - The Controller represents the request handler layer and is analogous to the Schema layer (i.e., `schema.ts`) for GraphQL
- Instantiate the Controller in `init.ts`
  - Inject Services as needed
- Create corresponding Router
  - e.g., in `router.ts` under related domain directory
  - This is where various related endpoints can be grouped
  - Paths are mapped to respective Controller methods
  - Middlewares can be configured in the Router
    - `CommonAccessValidatorMiddleware` can be utilized for common access validation (e.g., validators in `src/validate/validators.ts`)
    - If a custom access validator middleware is required (e.g., based on `Request` data), `BaseAccessValidatorMiddleware` can be extended
      - The concrete class just needs to implement the abstract `checkAccess` method and throw `AccessForbiddenError` if validation fails
      - Domain-specific middleware should also be placed under the corresponding domain directory
- Register the Router in `server.ts`
  - Created routers can be exported in `src/routers/index.ts`
  - The base path for the resource can be specified when registering the Router
- Regarding error handling
  - If a specific instance of `HttpError` (see `src/errors/http.ts`) is thrown, the error handler middleware (i.e., `error-handler.ts`) will automatically set the status code in the response accordingly
