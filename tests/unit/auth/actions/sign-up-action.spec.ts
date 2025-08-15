import { beforeEach, describe, expect, test, vi } from 'vitest'

// Mock dependencies
vi.mock('@conform-to/zod/v4')
vi.mock('~/features/auth/constants/validation', () => ({
  ERROR_MESSAGE: {
    SERVER_ERROR: 'サーバーエラーが発生しました',
  },
}))
vi.mock('~/features/auth/types/schemas/sign-up-schema', () => ({
  signUpSchema: {},
}))

// Mock the auth service module
vi.mock('~/features/auth/services/auth-service', () => {
  const mockSignIn = vi.fn()
  const mockSignUp = vi.fn()

  const MockAuthService = vi.fn().mockImplementation(() => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
  }))

  const MockAuthServiceError = class extends Error {
    code: string
    cause?: unknown

    constructor(message: string, code: string, cause?: unknown) {
      super(message)
      this.name = 'AuthServiceError'
      this.code = code
      this.cause = cause
    }
  }

  return {
    AuthService: MockAuthService,
    AuthServiceError: MockAuthServiceError,
    // Export mock functions for access in tests
    __mockSignIn: mockSignIn,
    __mockSignUp: mockSignUp,
  }
})

// Import after mocking
import { parseWithZod } from '@conform-to/zod/v4'
import { signUpAction } from '~/features/auth/actions/sign-up-action'
import * as authServiceModule from '~/features/auth/services/auth-service'

const { AuthServiceError } = authServiceModule

const mockSignUp = (authServiceModule as any).__mockSignUp

describe('signUpAction', () => {
  let mockParseWithZod: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup parseWithZod mock
    mockParseWithZod = vi.mocked(parseWithZod)
  })

  test('有効なデータでサインアップが成功する', async () => {
    const mockSubmission = {
      status: 'success' as const,
      value: {
        email: 'test@example.com',
        name: 'テストユーザー',
        password: 'password123',
      },
      reply: vi.fn(),
    }

    mockParseWithZod.mockReturnValue(mockSubmission)
    mockSignUp.mockResolvedValue(undefined)

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('name', 'テストユーザー')
    formData.append('password', 'password123')

    await signUpAction(null, formData)

    expect(mockParseWithZod).toHaveBeenCalledWith(formData, expect.anything())
    expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'テストユーザー', 'password123')
    expect(mockSubmission.reply).toHaveBeenCalled()
  })

  test('無効なデータでバリデーションエラーが返される', async () => {
    const mockSubmission = {
      status: 'error' as const,
      reply: vi.fn(),
    }

    mockParseWithZod.mockReturnValue(mockSubmission)

    const formData = new FormData()
    formData.append('email', 'invalid-email')

    await signUpAction(null, formData)

    expect(mockParseWithZod).toHaveBeenCalledWith(formData, expect.anything())
    expect(mockSubmission.reply).toHaveBeenCalled()
  })

  test('AuthServiceErrorが発生した場合の適切なエラーメッセージ返却', async () => {
    const mockSubmission = {
      status: 'success' as const,
      value: {
        email: 'test@example.com',
        name: 'テストユーザー',
        password: 'password123',
      },
      reply: vi.fn(),
    }

    const authError = new AuthServiceError('ユーザーが既に存在します', 'ALREADY_EXISTS_USER')

    mockParseWithZod.mockReturnValue(mockSubmission)
    mockSignUp.mockRejectedValue(authError)

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('name', 'テストユーザー')
    formData.append('password', 'password123')

    await signUpAction(null, formData)

    expect(mockSubmission.reply).toHaveBeenCalledWith({
      fieldErrors: {
        message: ['ユーザーが既に存在します'],
      },
    })
  })

  test('予期しないエラーが発生した場合のサーバーエラーメッセージ返却', async () => {
    const mockSubmission = {
      status: 'success' as const,
      value: {
        email: 'test@example.com',
        name: 'テストユーザー',
        password: 'password123',
      },
      reply: vi.fn(),
    }

    mockParseWithZod.mockReturnValue(mockSubmission)
    mockSignUp.mockRejectedValue(new Error('Unexpected error'))

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('name', 'テストユーザー')
    formData.append('password', 'password123')

    await signUpAction(null, formData)

    expect(mockSubmission.reply).toHaveBeenCalledWith({
      fieldErrors: {
        message: ['サーバーエラーが発生しました'],
      },
    })
  })

  test('バリデーション失敗時の処理', async () => {
    const mockSubmission = {
      status: 'error' as const,
      reply: vi.fn(),
    }

    mockParseWithZod.mockReturnValue(mockSubmission)

    const formData = new FormData()

    await signUpAction(null, formData)

    expect(mockParseWithZod).toHaveBeenCalledWith(formData, expect.anything())
    expect(mockSubmission.reply).toHaveBeenCalled()
  })

  test('authService.signUpが正しい引数で呼び出される', async () => {
    const testEmail = 'user@test.com'
    const testName = 'テスト'
    const testPassword = 'securePassword123'

    const mockSubmission = {
      status: 'success' as const,
      value: {
        email: testEmail,
        name: testName,
        password: testPassword,
      },
      reply: vi.fn(),
    }

    mockParseWithZod.mockReturnValue(mockSubmission)
    mockSignUp.mockResolvedValue(undefined)

    const formData = new FormData()
    formData.append('email', testEmail)
    formData.append('name', testName)
    formData.append('password', testPassword)

    await signUpAction(null, formData)

    expect(mockSignUp).toHaveBeenCalledTimes(1)
    expect(mockSignUp).toHaveBeenCalledWith(testEmail, testName, testPassword)
  })

  test('submission.statusがsuccessでない場合のearly return', async () => {
    const mockSubmission = {
      status: 'error' as const,
      reply: vi.fn().mockReturnValue('validation-error'),
    }

    mockParseWithZod.mockReturnValue(mockSubmission)

    const formData = new FormData()
    formData.append('email', 'invalid')

    const result = await signUpAction(null, formData)

    expect(result).toBe('validation-error')
    expect(mockSignUp).not.toHaveBeenCalled()
  })
})
