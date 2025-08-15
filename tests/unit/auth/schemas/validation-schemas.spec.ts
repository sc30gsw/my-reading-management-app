import { describe, expect, test } from 'vitest'
import { signInSchema } from '~/features/auth/types/schemas/sign-in-schema'
import { signUpSchema } from '~/features/auth/types/schemas/sign-up-schema'

describe('認証スキーマバリデーション', () => {
  describe('signUpSchema', () => {
    test('有効なデータでバリデーションに成功する', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'テストユーザー',
      }

      const result = signUpSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    describe('emailバリデーション', () => {
      test('有効なメールアドレスでバリデーションに成功する', () => {
        const data = {
          email: 'user@example.com',
          password: 'password123',
          name: 'テストユーザー',
        }

        const result = signUpSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      test('無効なメールアドレスでバリデーションに失敗する', () => {
        const data = {
          email: 'invalid-email',
          password: 'password123',
          name: 'テストユーザー',
        }

        const result = signUpSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      test('メールアドレスが未定義でバリデーションに失敗する', () => {
        const data = {
          password: 'password123',
          name: 'テストユーザー',
        }

        const result = signUpSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      test('メールアドレスが長すぎる場合はバリデーションに失敗する', () => {
        const longEmail = `${'a'.repeat(120)}@example.com`
        const data = {
          email: longEmail,
          password: 'password123',
          name: 'テストユーザー',
        }

        const result = signUpSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      test('空文字列のメールアドレスでバリデーションに失敗する', () => {
        const data = {
          email: '',
          password: 'password123',
          name: 'テストユーザー',
        }

        const result = signUpSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    describe('passwordバリデーション', () => {
      test('有効なパスワードでバリデーションに成功する', () => {
        const data = {
          email: 'test@example.com',
          password: 'password123',
          name: 'テストユーザー',
        }

        const result = signUpSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      test('短すぎるパスワードでバリデーションに失敗する', () => {
        const data = {
          email: 'test@example.com',
          password: '1234567',
          name: 'テストユーザー',
        }

        const result = signUpSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      test('パスワードが未定義でバリデーションに失敗する', () => {
        const data = {
          email: 'test@example.com',
          name: 'テストユーザー',
        }

        const result = signUpSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      test('パスワードが長すぎる場合はバリデーションに失敗する', () => {
        const data = {
          email: 'test@example.com',
          password: 'a'.repeat(129),
          name: 'テストユーザー',
        }

        const result = signUpSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      test('空文字列のパスワードでバリデーションに失敗する', () => {
        const data = {
          email: 'test@example.com',
          password: '',
          name: 'テストユーザー',
        }

        const result = signUpSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      test('最小文字数のパスワードでバリデーションに成功する', () => {
        const data = {
          email: 'test@example.com',
          password: '12345678',
          name: 'テストユーザー',
        }

        const result = signUpSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    describe('nameバリデーション', () => {
      test('有効な名前でバリデーションに成功する', () => {
        const data = {
          email: 'test@example.com',
          password: 'password123',
          name: 'テストユーザー',
        }

        const result = signUpSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      test('名前が未定義でバリデーションに失敗する', () => {
        const data = {
          email: 'test@example.com',
          password: 'password123',
        }

        const result = signUpSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      test('名前が長すぎる場合はバリデーションに失敗する', () => {
        const data = {
          email: 'test@example.com',
          password: 'password123',
          name: 'a'.repeat(129),
        }

        const result = signUpSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      test('空文字列の名前でバリデーションに失敗する', () => {
        const data = {
          email: 'test@example.com',
          password: 'password123',
          name: '',
        }

        const result = signUpSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      test('最大文字数の名前でバリデーションに成功する', () => {
        const data = {
          email: 'test@example.com',
          password: 'password123',
          name: 'a'.repeat(128),
        }

        const result = signUpSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('signInSchema', () => {
    test('有効なデータでバリデーションに成功する', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = signInSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    describe('emailバリデーション', () => {
      test('有効なメールアドレスでバリデーションに成功する', () => {
        const data = {
          email: 'user@example.com',
          password: 'password123',
        }

        const result = signInSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      test('無効なメールアドレスでバリデーションに失敗する', () => {
        const data = {
          email: 'invalid-email',
          password: 'password123',
        }

        const result = signInSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      test('メールアドレスが未定義でバリデーションに失敗する', () => {
        const data = {
          password: 'password123',
        }

        const result = signInSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      test('空文字列のメールアドレスでバリデーションに失敗する', () => {
        const data = {
          email: '',
          password: 'password123',
        }

        const result = signInSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    describe('passwordバリデーション', () => {
      test('有効なパスワードでバリデーションに成功する', () => {
        const data = {
          email: 'test@example.com',
          password: 'password123',
        }

        const result = signInSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      test('短すぎるパスワードでバリデーションに失敗する', () => {
        const data = {
          email: 'test@example.com',
          password: '1234567',
        }

        const result = signInSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      test('パスワードが未定義でバリデーションに失敗する', () => {
        const data = {
          email: 'test@example.com',
        }

        const result = signInSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      test('空文字列のパスワードでバリデーションに失敗する', () => {
        const data = {
          email: 'test@example.com',
          password: '',
        }

        const result = signInSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      test('最小文字数のパスワードでバリデーションに成功する', () => {
        const data = {
          email: 'test@example.com',
          password: '12345678',
        }

        const result = signInSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    test('すべてのフィールドが空でバリデーションに失敗する', () => {
      const data = {}

      const result = signInSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    test('部分的なデータでバリデーションに失敗する', () => {
      const data = {
        email: 'test@example.com',
      }

      const result = signInSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })
})