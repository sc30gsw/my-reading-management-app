# Test Specification Document

## Overview

読書管理アプリケーションのメール/パスワード認証機能に対する包括的なテスト戦略。TDD（Test-Driven Development）アプローチに基づき、要件からテストケースを導出し、実装前にテスト仕様を定義する。

Better Auth 1.3.6、Next.js 15 App Router、TypeScript環境に特化したテスト設計により、セキュアで信頼性の高い認証システムの品質を保証する。

## Test Framework Configuration

- **Unit Test Framework**: Vitest 3.2.4
- **UI Testing Library**: React Testing Library 16.3.0
- **E2E Framework**: Playwright 1.54.2
- **API Testing Library**: Supertest (Hono API統合)
- **Coverage Target**: 85%
- **Mock Strategy**: Auto-generation with manual overrides

## Requirements Traceability Matrix

| Requirement ID | Test Type | Test Case ID | Coverage Status |
|---------------|-----------|--------------|-----------------|
| REQ-1.1 | Component | TC-C-001 | ✅ Planned |
| REQ-1.2 | Unit | TC-U-001 | ✅ Planned |
| REQ-1.3 | E2E | TC-E-001 | ✅ Planned |
| REQ-2.1 | Component | TC-C-002 | ✅ Planned |
| REQ-2.2 | Unit | TC-U-002 | ✅ Planned |
| REQ-2.3 | E2E | TC-E-002 | ✅ Planned |
| REQ-3.1 | Component | TC-C-003 | ✅ Planned |
| REQ-3.2 | Unit | TC-U-003 | ✅ Planned |
| REQ-4.1 | Unit | TC-U-004 | ✅ Planned |
| REQ-4.2 | API | TC-A-001 | ✅ Planned |
| REQ-5.1 | Unit | TC-U-005 | ✅ Planned |
| REQ-5.2 | API | TC-A-002 | ✅ Planned |
| REQ-6.1 | Unit | TC-U-006 | ✅ Planned |
| REQ-6.2 | API | TC-A-003 | ✅ Planned |

## Test Strategy

### Unit Testing Strategy
- **Scope**: Zod schema validation, Server Actions, Better Auth integration, エラーハンドリング
- **Approach**: Test-first development (Red-Green-Refactor)
- **Isolation**: Better Auth API, Database connection, External services
- **Coverage Goal**: ≥85% line coverage

### Component Testing Strategy  
- **Scope**: RegisterForm, LoginForm, ProfileForm, AuthLayout components
- **Approach**: Behavior-driven testing with user interactions
- **Rendering**: React Testing Library render methods
- **User Events**: Form submission, validation errors, success states

### Hook Testing Strategy
- **Scope**: useSignIn, useSignUp, useProfile custom hooks
- **Approach**: renderHook with act for state changes
- **Isolation**: Better Auth calls, Router navigation
- **Coverage**: All hook paths, error states, loading states

### API Testing Strategy
- **Scope**: Better Auth endpoints integration, middleware validation
- **Approach**: Contract testing with Hono app testing
- **Data**: Mock user data and session tokens
- **Authentication**: Session validation, unauthorized access tests

### E2E Testing Strategy
- **Scope**: Complete authentication workflows
- **Approach**: User journey testing with Playwright
- **Environment**: Test database with seed data
- **Data Management**: Database cleanup between tests

## Test Execution Plan

### Phase 1: Foundation Tests (TDD Red Phase)
1. Zod schema validation tests (失敗)
2. Better Auth integration mocks (失敗)
3. Form component rendering tests (失敗)
4. Server Actions validation tests (失敗)

### Phase 2: Implementation (TDD Green Phase)
1. Zod schema実装でvalidation tests成功
2. Better Auth設定でintegration tests成功
3. Form component実装でUI tests成功
4. Server Actions実装でAPI tests成功

### Phase 3: Integration Tests (TDD Refactor Phase)
1. Component間のintegration tests
2. Better Auth + Drizzle integration tests
3. Middleware + Session validation tests
4. リファクタリングしながらテスト維持

### Phase 4: E2E Tests
1. ユーザー登録〜ログインフロー
2. セッション管理とタイムアウト
3. エラーハンドリングとリダイレクト
4. パフォーマンスとアクセシビリティ

## Mock Strategy

### Data Mocks
- User fixtures with realistic data
- Better Auth API response mocks
- Database seed data for E2E tests
- Session token and cookie mocks

### Service Mocks
- Better Auth API client mocks
- Database connection mocks
- Router navigation mocks
- Toast notification mocks

## CI/CD Integration

### Test Pipeline
```yaml
test:
  - lint (Biome)
  - unit-tests (Vitest)
  - component-tests (Testing Library)
  - hook-tests (renderHook)
  - api-tests (Supertest + Hono)
  - e2e-tests (Playwright)
  - coverage-report (85% threshold)
```

### Coverage Gates
- Minimum coverage: 85%
- Build fails if coverage drops below threshold
- Coverage trend reporting with GitHub Actions
- Security vulnerability scanning

## Testing Environment Setup

### Vitest Configuration
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        }
      }
    }
  }
})
```

### Testing Library Setup
```typescript
// tests/setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Better Auth mocks
vi.mock('~/lib/auth', () => ({
  auth: {
    api: {
      signUpEmail: vi.fn(),
      signInEmail: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn()
    }
  }
}))

// Router mocks
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn()
  })
}))
```

### Playwright Configuration
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'bun dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Performance Testing

### Load Testing Strategy
- 同時ログインユーザー数: 1,000人以上
- 認証レスポンス時間: p95 < 200ms
- セッション検証時間: p99 < 50ms
- Database query performance: p95 < 100ms

### Security Testing
- OWASP ZAP integration
- SQL injection prevention tests
- XSS attack prevention tests
- CSRF token validation tests
- Session hijacking prevention tests