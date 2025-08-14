
## Coding Guidelines
### Introduction
This coding standard is based on Next.js documentation and the [Next.js Principles](https://zenn.dev/akfm/books/nextjs-basic-principle/viewer/intro).

### Common Principles
-  Use routing features and Suspense to perform proper chunking
-  Use slots and Composition Pattern to reduce Client Module Graph size and JS bundle size sent to client (move code into RSC where possible, enlarge Server Module Graph)
-  Since the project uses [React Compiler](https://ja.react.dev/learn/react-compiler), hooks like `useMemo` and `useCallback` are generally unnecessary
-  Before PR, run `bun run build:clean` to ensure build passes

### Naming Conventions
-  Use kebab-case for filenames and folder names (excluding dynamic routes)
-  Use camelCase for variables and functions

### Function Definitions
-  Use function declarations to ensure consistency (e.g., `export default async function sample() {}`)

### API Implementation
-  Implement API definitions using [Zod OpenAPI](https://hono.dev/examples/zod-openapi)

### Component Design
-  Follow [AHA Programming](https://kentcdodds.com/blog/aha-programming)
-  Use components from [shadcn/ui](https://ui.shadcn.com/) as the component library
  - If a component is missing, add it via CLI (example below):

```bash
bunx --bun shadcn@latest add button
```

### Directory Strategy
-  Follow [bulletproof-react](https://github.com/alan2207/bulletproof-react) for directory structure

### Data Fetching
-  Use RequestMemorization, parallel fetch, and preload to avoid waterfall
-  Perform data fetching in leaf components following data colocation
-  Use `src/lib/upfetch.ts` with generics for type-safe fetches, leveraging Hono's PRC features like URL and `InferResponseType`

### Cache Management
-  Use React.cache and Next cache tags for cache control
-  Explicitly specify fetch options:
  - `cache: 'force-cache'` with tags for SSR
  - `cache: 'no-store'` for server-side rendering (Next 15 default is `no-store`)

### Server Actions
-  Use only for mutation processing
-  Do not use as a fetch replacement in Client Components
-  For such cases, consider React's `use` API or client fetch libraries like [tanstack-query](https://tanstack.com/query/latest) or [SWR](https://swr.vercel.app/ja)

## Directory Structure
-  Follow [bulletproof-react](https://github.com/alan2207/bulletproof-react) for directory organization

### Directory Structure by Bulletproof React
```
/skelton-task-app-main
  ├ public : Assets such as images
  ├ src
  |  ├ app: Routing definitions
  |  |  ├ api: Route Handler
  |  |  |  ├ auth : Auth API route
  |  |  |  |  └ [...auth]/route.ts  : Auth API route using catch-all segments
  |  |  |  └[[...route]] : API route using optional catch-all segments
  |  |  |     └ route.ts: API route definition with Hono
  |  |  ├ layout.tsx: Root layout
  |  |  ├ page.tsx : Root page component
  |  |  ├ loading.tsx: Root loading UI
  |  |  ├ error.tsx : Global error page (root error page)
  |  |  ├ not-found.tsx : 404 page
  |  |  ├ globals.css : Global styles
  |  |  ├ favicon.ico : Favicon
  |  |  └ sample-route (Sample routing) *The "sample" part is replaced with the actual path name for each screen
  |  |     ├ layout.tsx : Shared layout for this route
  |  |     ├ loading.tsx : Loading UI for this route
  |  |     ├ error.tsx : Error page for this route
  |  |     └ page.tsx : Page component for this route
  |  ├ components : Components used throughout the app
  |  |  ├ providers: Provider components used throughout the app
  |  |  |  └ *-provider.tsx : Other optional providers
  |  |  └ ui: UI components used across the application
  |  |     ├ header.tsx: Application header
  |  |     ├ footer.tsx: Application footer
  |  |     └ shadcn: shadcn/ui components
  |  |       ├ button.tsx : shadcn/ui Button
  |  |       ├ input.tsx : shadcn/ui Input
  |  |       ├ card.tsx : shadcn/ui Card
  |  |       └ *** : shadcn/ui components
  |  ├ features : Functionality implementation for specific routes
  |  |  ├ tasks: Parent directory grouping feature-related directories (use meaningful naming)
  |  |  |   ├ actions : Store server actions (each server action should be one file (module) with one function)
  |  |  |   |  └ *.ts : Arbitrary server actions
  |  |  |   ├ api : Store API-related processing
  |  |  |   |  └ route.ts : File implementing API
  |  |  |   ├ components : Directory grouping components used in this feature
  |  |  |   |  ├ user-list.ts : Component fetching and displaying user list
  |  |  |   |  └ *.ts : Arbitrary components
  |  |  |   ├ hooks : Directory grouping hooks used in this feature
  |  |  |   |  └ *-hook.ts : Arbitrary hooks
  |  |  |   ├ types : Directory grouping type definitions for this feature
  |  |  |   |  ├ schema : Directory for zod schemas
  |  |  |   |  |  └ *-schema.ts : Arbitrary zod schema
  |  |  |   |  ├ task.ts : Type definitions related to tasks
  |  |  |   |  └ *.ts : Arbitrary type definition files
  |  |  |   └ utils : Directory grouping utility definitions for this feature
  |  |  └ * : Arbitrary feature directories
  |  ├ hooks : Custom hooks used throughout the app (use-***.ts)
  |  ├ middleware.ts : Middleware implementation (see [Middleware documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware))
  ├  ├ types : Type definitions used throughout the app
  |  |   └ *.ts : Arbitrary type definitions
  ├  ├ constants : Constants used throughout the app
  ├  ├ utils : Utility implementations used throughout the app
  ├  ├ db : Database configuration and table schema definitions
  |  |  ├ index.ts : Database configuration definitions
  |  |  └ schema.ts : Table schema definitions
  ├  └ lib : Library configuration and common helper functions used throughout the app
  |     ├ upfetch.ts : Fetch helper using up-fetch
  |     ├ utils.ts : Tailwind CSS styling merge helper
  |     └ schema.ts : Table schema definitions
  ├ tests: Test code
  |  ├ unit: Unit test code
  |  |  ├ api: API unit tests
  |  |  |  └ *-spec.ts : Test code
  |  |  ├ utils: Utility unit tests
  |  |  |  └ *-spec.ts : Test code
  |  |  ├ components: Component unit tests
  |  |  |  └ *-spec.ts : Test code
  |  |  └ hooks: Hook unit tests
  |  |     └ *-hook-spec.ts : Test code
  |  └ e2e: End-to-end test code
  |     └ tasks: Utility end-to-end tests
  |          ├ screenshots: Store screenshots taken during tests (for Visual Regression Testing)
  |          |    └ *.png : Screenshots of arbitrary screens or elements
  |          └ *-spec.ts : Test code
  ├ .env.* : Environment variable configuration files
  ├ .env.test : Environment variable configuration file for testing
  ├ biome.jsonc : Linter and formatter configuration file
  ├ components.json : shadcn/ui configuration file
  ├ next.config.ts : Next.js configuration file
  ├ package.json : Package manager configuration file
  ├ playwright.config.ts : Playwright configuration file
  ├ vitest.config.ts : Vitest configuration file
  ├ postcss.config.mjs : PostCSS configuration file (mainly for Tailwind CSS plugin settings)
  └ tsconfig.json : TypeScript configuration file
```

### Test Pyramid Strategy
In this project, we adopt the [Test Pyramid](https://zenn.dev/coconala/articles/f048377f314507#%E3%83%86%E3%82%B9%E3%83%88%E3%83%94%E3%83%A9%E3%83%9F%E3%83%83%E3%83%89) strategy for quality assurance, but **integration tests (combined tests) are not yet implemented**:

#### 1. Unit Tests (Vitest)
-  **Component Tests**: User interaction simulations using React Testing Library
-  **Hook Tests**: Independent testing of custom hooks
-  **Utility Tests**: Testing pure functions and helper logic
-  **API Tests**: Unit tests for Hono handlers
-  **Server Actions Tests**: Independent testing of form processing logic

#### 2. Integration Tests (Vitest)
-  **Database + Service Integration**: Testing the connection between actual database and service layer
-  **API Route + Handler Integration**: Testing the entire request-response cycle
-  **Server Actions Integration**: End-to-end testing from form submission to database update
-  **Cache Integration**: Testing the integration of `revalidateTag` with actual Next.js cache

#### 3. E2E Tests (Playwright)
-  **User Workflow**: Complete user experience testing in real browsers
-  **Cross-Browser Testing**: Verification in Chromium, Firefox, Safari
-  **Responsive Testing**: Display checks on mobile and desktop

### Current Testing Implementation Status
-  **Unit Tests**: Fully implemented (independent tests for each component, hook, API, and action)
-  **Integration Tests**: Not yet implemented (only mock-dependent unit tests)
-  **E2E Tests**: Major user flows are implemented

### TDD (Test-Driven Development)
-  **Red-Green-Refactor**: Cycle of failing test → implementation → refactoring
-  **Test First**: Clarify specifications before starting implementation
-  **Incremental Implementation**: Currently focused on unit tests, with plans to add integration tests in the future

