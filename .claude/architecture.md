## Architecture Overview

This application adopts a hybrid architecture based on **Next.js 15 + Hono BFF (Backend for Frontend)**.

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   BFF (Hono)     │    │   Database      │
│                 │    │                  │    │                 │
│ • React 19 RSC  │◄──►│ • Type-safe RPC  │◄──►│ • Turso(LibSQL) │
│ • Server Actions│    │ • Zod OpenAPI    │    │ • Drizzle ORM   │
│ • Client Comps  │    │ • Route Handlers │    │ • Schema-driven │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Data Flow
1. **Server Components**: Data fetching and initial rendering on the server side
2. **Client Components**: User interactions and form handling
3. **Server Actions**: Data updates via mutations and cache invalidation
4. **RPC Client**: Type-safe API calls (Hono client and InferResponseType)

### Design Principles
-  **Server-First**: Optimization on server side using RSC
-  **Type Safety**: End-to-end type safety
-  **Performance**: Minimize JavaScript bundle size
-  **Testability**: Independent testing of each layer
-  **Maintainability**: Responsibility separation driven by features


### About testing
-  Implement various unit tests using Vitest
-  Perform E2E tests using Playwright

### Test Database Configuration

#### Overview of Test Database
During E2E testing, a local SQLite database completely isolated from production and development environments is used.

#### Reasons for choosing SQLite (not Turso replication)
-  **Cost-effective**: Completely free (no additional charges)
-  **Fast execution**: Local file access without network communication
-  **Full isolation**: No impact on production/development data
-  **Simple**: Easy setup and management
-  **CI/CD friendly**: Easy environment setup

#### Current setup
-  **Test DB**: `DATABASE_URL=file:./test.db`
-  **Env file**: `.env.test`
-  **Automatic initialization**: Creates and migrates the database before tests run
-  **Automatic cleanup**: Uses a fresh database for each test run

#### How to run tests
```bash
# Run E2E tests with automatic DB initialization
bun test:e2e

# Run only the database setup
bun test:e2e:setup
```

#### How it works
1. **Automatic DB initialization**: `scripts/setup-test-db.ts` initializes `test.db` before tests
2. **Environment variable switching**: `.env.test` is automatically loaded via Playwright configuration
3. **Complete separation**: No impact on production or development databases
4. **Fast testing**: Local file access ensures quick test execution

## API Documentation

This application provides API documentation using [Scalar](https://scalar.com/). Scalar automatically generates beautiful, easy-to-use API references based on OpenAPI specifications.

### How to access Scalar API documentation

After starting the development server, access the API docs at:

-  **Scalar UI**: `http://localhost:3000/api/scalar`
  - Interactive API documentation UI
  - View request/response details
  - Test API calls directly in the browser

-  **OpenAPI Specification**: `http://localhost:3000/api/doc`
  - Raw OpenAPI 3.0 spec (JSON format)
  - View detailed API definitions
  - Import into other tools

### Usage
1. Check API endpoints: review detailed specifications, parameters, and response formats
2. Send test requests: try API requests directly in the browser
3. Refer to code examples: see request examples in various languages
4. Set authentication info if needed for testing

### Features
-  **Real-time sync**: Changes in code automatically reflected in documentation
-  **Type safety**: Strict type definitions and validation via Zod schemas
-  **Development efficiency**: Easier frontend-backend integration verification