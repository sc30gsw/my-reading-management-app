import '@testing-library/jest-dom/vitest'
import React from 'react'
import { vi } from 'vitest'

// React をグローバルで利用可能にする
global.React = React

// 環境変数のモック
vi.mock('~/env', () => ({
  env: {
    DATABASE_URL: 'libsql://test.db',
    DATABASE_AUTH_TOKEN: 'test-token',
    NODE_ENV: 'test',
    BETTER_AUTH_SECRET: 'test-secret',
  },
}))

// Next.jsのモック
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
  useSearchParams: vi.fn(),
  usePathname: vi.fn(),
}))

// Server-only のモック
vi.mock('server-only', () => ({}))

// Better Auth のモック
vi.mock('~/lib/auth', () => ({
  auth: {
    api: {
      signInEmail: vi.fn(),
      signUpEmail: vi.fn(),
      signOut: vi.fn(),
    },
  },
  betterAuth: vi.fn(),
}))

// DB のモック
vi.mock('~/db', () => ({
  db: {
    query: {
      users: {
        findFirst: vi.fn(),
      },
    },
  },
}))

// React hooks mock
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useTransition: vi.fn(() => [false, vi.fn()]),
    useActionState: vi.fn((action, initialState) => [initialState, action, false]),
  }
})

// Form handling mock
vi.mock('@conform-to/zod', () => ({
  parseWithZod: vi.fn(),
}))

vi.mock('@conform-to/zod/v4', () => ({
  parseWithZod: vi.fn(),
}))

// Toast mock
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Auth service mock
vi.mock('~/features/auth/services/auth-service', () => {
  const AuthServiceError = class AuthServiceError extends Error {
    constructor(message: string, public code: string, public cause?: unknown) {
      super(message)
      this.name = 'AuthServiceError'
    }
  }
  
  const AuthService = class AuthService {
    signUp = vi.fn()
    signIn = vi.fn()
  }

  return {
    AuthServiceError,
    AuthService,
    authService: new AuthService(),
  }
})

// Utils mock
vi.mock('~/utils/with-callback', () => ({
  withCallbacks: vi.fn((action) => action),
}))

// Validation constants mock
vi.mock('~/features/auth/constants/validation', () => ({
  ERROR_MESSAGE: {
    SERVER_ERROR: 'サーバーエラーが発生しました',
    ALREADY_EXISTS_USER: 'ユーザーが既に存在します。',
    FAILED_SIGN_UP: 'サインアップに失敗しました。',
    UNAUTHORIZED: '認証に失敗しました。',
    FAILED_SIGN_IN: 'ログインに失敗しました。',
  },
}))
