

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
## registry-service

Lightweight CDS Hooks registry mock used for development and testing.

This service exposes a small registry of clients and their published CDS services. It loads entries from `src/registry/db.json` and exposes HTTP endpoints to query registered clients and discover their services.


## Table of contents

- [Key features](#key-features)
- [Quick start](#quick-start)
- [Endpoints](#endpoints)
- [Data file](#data-file)
- [Docker](#docker)
- [Tests](#tests)
- [JWT / CDS Hooks notes](#jwt--cds-hooks-notes)
- [Contributing](#contributing)
- [License](#license)


## Key features

- Query the registry by `iss` and `jku`.
- Discovery endpoint that returns a `services` array for a matching client.
- Small, dependency-free implementation suitable for local development and CI tests.

## Quick start

Install dependencies and run in development mode:

```bash
npm install
npm run start:dev
```

Open http://localhost:3000

## Endpoints

- `GET /registry`
  - Optional query params: `iss`, `jku`.
  - If no params provided returns the full registry array (contents of `src/registry/db.json`).
  - If `iss` and `jku` provided, returns the single matching registry entry.

 `GET /registry/discovery`
   - Returns all services aggregated from `src/registry/db.json`.
   - No query parameters required.
   - Response: `{ "services": [ ... ] }` (empty array if no services found).

Example discovery request:

```http
GET /registry/discovery
```

Example discovery response:

```json
{
  "services": [
    {
      "id": "crd-service",
      "name": "CRD Service",
      "description": "CRD CDS service",
      "hook": "order-sign"
    }
  ]
}
```

## Data file

Registry entries are stored in `src/registry/db.json`. This is read at runtime (the service uses the source file so it works both in dev and the Docker image). Edit that file to add, remove, or modify registry entries.

## Docker

Build and run with Docker (multi-stage build included in repository):

```bash
docker build -t registry-service .
docker run -p 3000:3000 registry-service
```

This image copies the built `dist` and includes `src/registry/db.json` so discovery will work inside the container.

## Tests

Run unit and e2e tests with npm scripts:

```bash
npm run test         # unit tests
npm run test:e2e     # e2e tests
```

There is an integration test for the discovery endpoint at `test/discovery.e2e-spec.ts`.

## JWT / CDS Hooks notes

- If you need to generate JWTs for testing CDS Hooks workflow, generate an RSA keypair and sign an RS256 JWT whose header includes a `jku` pointing to your JWKS endpoint. The repo includes a short example used during development (see `/tmp/cds_jwt_demo` in local runs when generated).
- When registering clients for CDS Hooks, include `iss`, `jku`, `clientId`, `clientName`, and a `services` array describing each CDS service.

## Contributing

PRs and issues welcome. For changes that affect API/behavior, include tests and update this README when necessary.

## License

This project is provided under the repository's license.
