# Authentication Mocks Specification

## Mock Strategy Overview
認証システムテストで使用するモック定義とセットアップ仕様

## Mock Categories

### Better Auth API Mocks
Better Auth APIレスポンスの標準化されたモック定義

#### signUpEmail API Mock
```typescript
// mocks/auth-api-mocks.ts
export const mockSignUpEmailSuccess = {
  user: {
    id: 'mock-user-123',
    email: 'test@example.com',
    name: 'Test User',
    emailVerified: false,
    image: null,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  },
  session: {
    id: 'mock-session-123',
    token: 'mock-session-token',
    userId: 'mock-user-123',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

export const mockSignUpEmailError = new APIError(400, {
  message: 'EMAIL_ALREADY_EXISTS',
  code: 'VALIDATION_ERROR'
})

export const mockSignUpEmailValidationError = new APIError(400, {
  message: 'Invalid email format',
  code: 'VALIDATION_ERROR',
  fieldErrors: {
    email: ['メールアドレスが不正です']
  }
})
```

#### signInEmail API Mock
```typescript
export const mockSignInEmailSuccess = {
  user: {
    id: 'mock-user-123',
    email: 'user@example.com',
    name: 'Existing User'
  },
  session: {
    id: 'mock-session-456',
    token: 'mock-session-token-login',
    userId: 'mock-user-123',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
}

export const mockSignInEmailError = new APIError(401, {
  message: 'INVALID_CREDENTIALS',
  code: 'AUTHENTICATION_ERROR'
})
```

#### getSession API Mock
```typescript
export const mockGetSessionSuccess = {
  session: {
    id: 'mock-session-123',
    token: 'mock-session-token',
    userId: 'mock-user-123',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  user: {
    id: 'mock-user-123',
    email: 'user@example.com',
    name: 'Test User'
  }
}

export const mockGetSessionExpired = {
  session: null,
  user: null
}
```

#### signOut API Mock
```typescript
export const mockSignOutSuccess = {
  success: true,
  message: 'Successfully signed out'
}
```

### Database Mocks
Drizzle ORMクエリ結果のモック定義

#### User Database Mocks
```typescript
// mocks/database-mocks.ts
export const mockUserRecord = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  emailVerified: true,
  image: null,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z')
}

export const mockExistingUser = {
  id: 'existing-user-456',
  email: 'existing@example.com',
  name: 'Existing User',
  emailVerified: true,
  image: null,
  createdAt: new Date('2023-12-01T00:00:00Z'),
  updatedAt: new Date('2023-12-01T00:00:00Z')
}

export const mockUserNotFound = null

// Database query response mocks
export const mockDbUserQuery = {
  findFirst: vi.fn(),
  findMany: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn()
}
```

### Router Mocks
Next.js Router機能のモック

#### useRouter Mock
```typescript
// mocks/router-mocks.ts
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn()
}

export const mockUseRouter = () => mockRouter
```

### Toast Notification Mocks
トースト通知システムのモック

#### Toast Mock
```typescript
// mocks/toast-mocks.ts
export const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  loading: vi.fn(),
  dismiss: vi.fn()
}
```

### Form State Mocks
Conformフォーム状態のモック

#### Form Field Mocks
```typescript
// mocks/form-mocks.ts
export const mockFormField = {
  id: 'mock-field',
  name: 'mockField',
  value: '',
  initialValue: '',
  errors: [],
  valid: true,
  dirty: false
}

export const mockEmailField = {
  ...mockFormField,
  id: 'email',
  name: 'email',
  value: 'test@example.com'
}

export const mockPasswordField = {
  ...mockFormField,
  id: 'password',
  name: 'password',
  value: 'password123'
}

export const mockNameField = {
  ...mockFormField,
  id: 'name',
  name: 'name',
  value: 'Test User'
}

export const mockForm = {
  id: 'mock-form',
  fields: {
    email: mockEmailField,
    password: mockPasswordField,
    name: mockNameField
  },
  valid: true,
  errors: [],
  validate: vi.fn(),
  reset: vi.fn()
}
```

### Server Action Mocks
Server Actionsの結果モック

#### Action Result Mocks
```typescript
// mocks/action-mocks.ts
export const mockActionSuccess = {
  status: 'success' as const,
  value: {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  },
  reply: vi.fn()
}

export const mockActionError = {
  status: 'error' as const,
  error: {
    fieldErrors: {
      message: ['メールアドレスまたはパスワードが正しくありません']
    }
  },
  reply: vi.fn()
}

export const mockActionValidationError = {
  status: 'error' as const,
  error: {
    fieldErrors: {
      email: ['メールアドレスが不正です'],
      password: ['パスワードは8文字以上で入力してください'],
      name: ['ユーザー名を入力してください']
    }
  },
  reply: vi.fn()
}
```

## Mock Setup Functions

### Global Mock Setup
```typescript
// test-setup/global-mocks.ts
import { beforeEach, vi } from 'vitest'
import * as authMocks from '../mocks/auth-api-mocks'
import * as dbMocks from '../mocks/database-mocks'
import * as routerMocks from '../mocks/router-mocks'
import * as toastMocks from '../mocks/toast-mocks'

export function setupGlobalMocks() {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks()
    
    // Reset Better Auth mocks
    vi.mocked(auth.api.signUpEmail).mockReset()
    vi.mocked(auth.api.signInEmail).mockReset()
    vi.mocked(auth.api.getSession).mockReset()
    vi.mocked(auth.api.signOut).mockReset()
    
    // Reset Database mocks
    vi.mocked(db.query.users.findFirst).mockReset()
    
    // Reset Router mocks
    vi.mocked(useRouter).mockReturnValue(routerMocks.mockRouter)
    
    // Reset Toast mocks
    vi.mocked(toast).mockReturnValue(toastMocks.mockToast)
  })
}
```

### Component Test Mock Setup
```typescript
// test-setup/component-mocks.ts
export function setupComponentMocks() {
  // React Testing Library setup
  vi.mock('next/navigation', () => ({
    useRouter: () => routerMocks.mockRouter
  }))
  
  // Better Auth mock
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
  
  // Toast mock
  vi.mock('sonner', () => ({
    toast: toastMocks.mockToast
  }))
  
  // Form Actions mock
  vi.mock('~/features/auth/actions', () => ({
    registerAction: vi.fn(),
    signInAction: vi.fn()
  }))
}
```

### Hook Test Mock Setup
```typescript
// test-setup/hook-mocks.ts
export function setupHookMocks() {
  // useActionState mock
  vi.mock('react', () => ({
    ...vi.importActual('react'),
    useActionState: vi.fn(() => [null, vi.fn(), false])
  }))
  
  // Conform hooks mock
  vi.mock('@conform-to/react', () => ({
    useForm: vi.fn(() => [mockForm, mockForm.fields]),
    parseWithZod: vi.fn(),
    getZodConstraint: vi.fn()
  }))
}
```

### E2E Test Mock Setup
```typescript
// test-setup/e2e-mocks.ts
export function setupE2EMocks() {
  // Database seeding for E2E tests
  const seedTestUser = async () => {
    // Create test user in database
    return await db.insert(users).values({
      email: 'e2e-test@example.com',
      name: 'E2E Test User',
      // パスワードハッシュは Better Auth で生成
    })
  }
  
  const cleanupTestData = async () => {
    // Clean up test data
    await db.delete(users).where(like(users.email, 'e2e-test%'))
  }
  
  return { seedTestUser, cleanupTestData }
}
```

## Mock Validation Helpers

### Response Validation
```typescript
// test-utils/mock-validators.ts
export function validateMockUserResponse(response: any) {
  expect(response).toHaveProperty('user')
  expect(response.user).toHaveProperty('id')
  expect(response.user).toHaveProperty('email')
  expect(response.user).toHaveProperty('name')
  expect(response.user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
}

export function validateMockSessionResponse(response: any) {
  expect(response).toHaveProperty('session')
  expect(response.session).toHaveProperty('id')
  expect(response.session).toHaveProperty('token')
  expect(response.session).toHaveProperty('userId')
  expect(response.session).toHaveProperty('expiresAt')
  expect(new Date(response.session.expiresAt)).toBeInstanceOf(Date)
}

export function validateMockErrorResponse(error: any) {
  expect(error).toBeInstanceOf(APIError)
  expect(error).toHaveProperty('status')
  expect(error).toHaveProperty('body')
  expect(error.body).toHaveProperty('message')
}
```

## Mock Usage Examples

### Unit Test Example
```typescript
describe('AuthService signUp', () => {
  test('successful signup', async () => {
    // Arrange
    vi.mocked(auth.api.signUpEmail).mockResolvedValue(mockSignUpEmailSuccess)
    
    // Act
    const result = await authService.signUp({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    })
    
    // Assert
    validateMockUserResponse(result)
    expect(result.user.email).toBe('test@example.com')
  })
})
```

### Component Test Example
```typescript
describe('RegisterForm', () => {
  test('displays error message', () => {
    // Arrange
    const errorResult = mockActionValidationError
    
    // Act
    render(<RegisterForm lastResult={errorResult} />)
    
    // Assert
    expect(screen.getByText('メールアドレスが不正です')).toBeInTheDocument()
  })
})
```

## Coverage Target
- Mock Coverage: 100%（全API呼び出し）
- Error Scenario Coverage: 100%（全エラーパターン）
- State Variation Coverage: 100%（全状態パターン）