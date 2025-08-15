import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { SignInForm } from '~/features/auth/components/sign-in-form'
import type { useSignIn } from '~/features/auth/hooks/use-sign-in'

// useSignInフックのモック
vi.mock('~/features/auth/hooks/use-sign-in')

// useSignInの戻り値の型を取得
type UseSignInReturn = ReturnType<typeof useSignIn>

describe('SignInForm', () => {
  const mockAction = vi.fn()
  const mockOnSubmit = vi.fn()
  const mockToggle = vi.fn()

  const defaultMockReturn = {
    action: mockAction,
    form: {
      id: 'sign-in-form',
      onSubmit: mockOnSubmit,
    },
    fields: {
      email: {
        id: 'email',
        errors: undefined,
      },
      password: {
        id: 'password',
        errors: undefined,
      },
    },
    isPending: false,
    showPassword: false,
    toggle: mockToggle,
    lastResult: null,
  } as unknown as UseSignInReturn

  beforeEach(async () => {
    vi.clearAllMocks()
    const { useSignIn } = await import('~/features/auth/hooks/use-sign-in')
    vi.mocked(useSignIn).mockReturnValue(defaultMockReturn)
  })

  describe('レンダリング', () => {
    test('フォーム要素が正しく表示される', () => {
      render(<SignInForm />)

      // フォームの存在確認
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      expect(form).toHaveAttribute('aria-labelledby', 'sign-in-title')

      // メールアドレス入力フィールド
      const emailInput = screen.getByLabelText('メールアドレス')
      expect(emailInput).toBeInTheDocument()
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('placeholder', 'example@example.com')
      expect(emailInput).toHaveAttribute('autoComplete', 'email')

      // パスワード入力フィールド
      const passwordInput = screen.getByLabelText('パスワード')
      expect(passwordInput).toBeInTheDocument()
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('placeholder', '8文字以上のパスワード')
      expect(passwordInput).toHaveAttribute('autoComplete', 'current-password')

      // パスワード表示切り替えボタン
      const toggleButton = screen.getByLabelText('パスワードを表示')
      expect(toggleButton).toBeInTheDocument()

      // ログインボタン
      const submitButton = screen.getByRole('button', { name: 'ログイン' })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toHaveAttribute('type', 'submit')
    })

    test('エラーメッセージが表示される', async () => {
      const mockReturnWithError = {
        ...defaultMockReturn,
        lastResult: {
          error: {
            message: 'ログインに失敗しました',
          },
        },
      } as unknown as UseSignInReturn
      const { useSignIn } = await import('~/features/auth/hooks/use-sign-in')
      vi.mocked(useSignIn).mockReturnValue(mockReturnWithError)

      render(<SignInForm />)

      const errorAlert = screen.getByRole('alert')
      expect(errorAlert).toBeInTheDocument()
      expect(errorAlert).toHaveTextContent('ログインに失敗しました')
    })

    test('配列形式のエラーメッセージが正しく表示される', async () => {
      const mockReturnWithArrayError = {
        ...defaultMockReturn,
        lastResult: {
          error: {
            message: ['メールアドレスが無効です', 'パスワードが短すぎます'],
          },
        },
      } as unknown as UseSignInReturn
      const { useSignIn } = await import('~/features/auth/hooks/use-sign-in')
      vi.mocked(useSignIn).mockReturnValue(mockReturnWithArrayError)

      render(<SignInForm />)

      const errorAlert = screen.getByRole('alert')
      expect(errorAlert).toBeInTheDocument()
      expect(errorAlert).toHaveTextContent('メールアドレスが無効です, パスワードが短すぎます')
    })

    test('フィールドエラーが表示される', async () => {
      const mockReturnWithFieldErrors = {
        ...defaultMockReturn,
        fields: {
          email: {
            id: 'email',
            errors: ['メールアドレスの形式が正しくありません'],
          },
          password: {
            id: 'password',
            errors: ['パスワードは8文字以上で入力してください'],
          },
        },
      } as unknown as UseSignInReturn
      const { useSignIn } = await import('~/features/auth/hooks/use-sign-in')
      vi.mocked(useSignIn).mockReturnValue(mockReturnWithFieldErrors)

      render(<SignInForm />)

      // メールアドレスのエラー
      const emailError = screen.getByText('メールアドレスの形式が正しくありません')
      expect(emailError).toBeInTheDocument()
      expect(emailError).toHaveAttribute('role', 'alert')

      // パスワードのエラー
      const passwordError = screen.getByText('パスワードは8文字以上で入力してください')
      expect(passwordError).toBeInTheDocument()
      expect(passwordError).toHaveAttribute('role', 'alert')

      // エラー状態でのスタイル適用確認
      const emailInput = screen.getByLabelText('メールアドレス')
      const passwordInput = screen.getByLabelText('パスワード')
      expect(emailInput).toHaveClass('border-destructive')
      expect(passwordInput).toHaveClass('border-destructive')
    })
  })

  describe('ユーザーインタラクション', () => {
    test('パスワード表示切り替えが動作する', async () => {
      const user = userEvent.setup()
      render(<SignInForm />)

      const toggleButton = screen.getByLabelText('パスワードを表示')
      const passwordInput = screen.getByLabelText('パスワード')

      // 初期状態はpasswordタイプ
      expect(passwordInput).toHaveAttribute('type', 'password')

      // クリックでパスワード表示
      await user.click(toggleButton)
      expect(mockToggle).toHaveBeenCalledWith(true)
    })

    test('showPasswordがtrueの時、パスワードがテキスト表示される', async () => {
      const mockReturnWithShowPassword = {
        ...defaultMockReturn,
        showPassword: true,
      } as unknown as UseSignInReturn
      const { useSignIn } = await import('~/features/auth/hooks/use-sign-in')
      vi.mocked(useSignIn).mockReturnValue(mockReturnWithShowPassword)

      render(<SignInForm />)

      const passwordInput = screen.getByLabelText('パスワード')
      const toggleButton = screen.getByLabelText('パスワードを隠す')

      expect(passwordInput).toHaveAttribute('type', 'text')
      expect(toggleButton).toBeInTheDocument()
    })

    test('フォーム送信が正しく実行される', async () => {
      const user = userEvent.setup()
      render(<SignInForm />)

      const emailInput = screen.getByLabelText('メールアドレス')
      const passwordInput = screen.getByLabelText('パスワード')
      const submitButton = screen.getByRole('button', { name: 'ログイン' })

      // フォームに入力
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      // フォーム送信
      await user.click(submitButton)

      expect(mockOnSubmit).toHaveBeenCalled()
    })
  })

  describe('ローディング状態', () => {
    test('isPendingがtrueの時、ローディング表示とボタン無効化', async () => {
      const mockReturnWithPending = {
        ...defaultMockReturn,
        isPending: true,
      } as unknown as UseSignInReturn
      const { useSignIn } = await import('~/features/auth/hooks/use-sign-in')
      vi.mocked(useSignIn).mockReturnValue(mockReturnWithPending)

      render(<SignInForm />)

      const submitButton = screen.getByRole('button', { name: /ログイン中/ })
      expect(submitButton).toBeDisabled()
      expect(submitButton).toHaveTextContent('ログイン中...')

      // ローディングスピナーの存在確認
      const spinner = screen.getByText('ログイン中...')
      expect(spinner).toBeInTheDocument()
    })

    test('isPendingがfalseの時、通常の表示', () => {
      render(<SignInForm />)

      const submitButton = screen.getByRole('button', { name: 'ログイン' })
      expect(submitButton).not.toBeDisabled()
      expect(submitButton).toHaveTextContent('ログイン')
    })
  })

  describe('アクセシビリティ', () => {
    test('適切なaria属性が設定されている', () => {
      render(<SignInForm />)

      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('aria-labelledby', 'sign-in-title')

      const emailInput = screen.getByLabelText('メールアドレス')
      expect(emailInput).toHaveAttribute('aria-describedby', 'email-error email-hint')
      expect(emailInput).toHaveAttribute('aria-invalid', 'false')

      const passwordInput = screen.getByLabelText('パスワード')
      expect(passwordInput).toHaveAttribute('aria-describedby', 'password-error password-hint')
      expect(passwordInput).toHaveAttribute('aria-invalid', 'false')
    })

    test('エラー状態でaria-invalidが正しく設定される', async () => {
      const mockReturnWithFieldErrors = {
        ...defaultMockReturn,
        fields: {
          email: {
            id: 'email',
            errors: ['メールアドレスが無効です'],
          },
          password: {
            id: 'password',
            errors: ['パスワードが無効です'],
          },
        },
      } as unknown as UseSignInReturn
      const { useSignIn } = await import('~/features/auth/hooks/use-sign-in')
      vi.mocked(useSignIn).mockReturnValue(mockReturnWithFieldErrors)

      render(<SignInForm />)

      const emailInput = screen.getByLabelText('メールアドレス')
      const passwordInput = screen.getByLabelText('パスワード')

      expect(emailInput).toHaveAttribute('aria-invalid', 'true')
      expect(passwordInput).toHaveAttribute('aria-invalid', 'true')
    })

    test('パスワード表示切り替えボタンのaria-labelが適切', async () => {
      render(<SignInForm />)

      // 初期状態
      const toggleButton = screen.getByLabelText('パスワードを表示')
      expect(toggleButton).toBeInTheDocument()

      // showPasswordがtrueの状態をモック
      const mockReturnWithShowPassword = {
        ...defaultMockReturn,
        showPassword: true,
      } as unknown as UseSignInReturn
      const { useSignIn } = await import('~/features/auth/hooks/use-sign-in')
      vi.mocked(useSignIn).mockReturnValue(mockReturnWithShowPassword)

      // 再レンダリング
      render(<SignInForm />)

      const hideToggleButton = screen.getByLabelText('パスワードを隠す')
      expect(hideToggleButton).toBeInTheDocument()
    })
  })

  describe('フォームバリデーション', () => {
    test('Conformのpropが正しく適用されている', () => {
      render(<SignInForm />)

      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('id', 'sign-in-form')

      const emailInput = screen.getByLabelText('メールアドレス')
      const passwordInput = screen.getByLabelText('パスワード')

      expect(emailInput).toHaveAttribute('id', 'email')
      expect(passwordInput).toHaveAttribute('id', 'password')
    })
  })

  describe('スクリーンリーダー対応', () => {
    test('sr-onlyヒントテキストが存在する', () => {
      render(<SignInForm />)

      const emailHint = screen.getByText('有効なメールアドレスを入力してください')
      const passwordHint = screen.getByText('8文字以上のパスワードを入力してください')

      expect(emailHint).toHaveClass('sr-only')
      expect(passwordHint).toHaveClass('sr-only')
    })

    test('エラーアラートがaria-live="polite"に設定されている', async () => {
      const mockReturnWithFieldErrors = {
        ...defaultMockReturn,
        fields: {
          email: {
            id: 'email',
            errors: ['エラーメッセージ'],
          },
          password: {
            id: 'password',
            errors: null,
          },
        },
      } as unknown as UseSignInReturn
      const { useSignIn } = await import('~/features/auth/hooks/use-sign-in')
      vi.mocked(useSignIn).mockReturnValue(mockReturnWithFieldErrors)

      render(<SignInForm />)

      const errorAlert = screen.getByText('エラーメッセージ')
      expect(errorAlert).toHaveAttribute('aria-live', 'polite')
    })
  })
})
