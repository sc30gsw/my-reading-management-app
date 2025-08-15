import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { SignUpForm } from '~/features/auth/components/sign-up-form'
import type { useSignUp } from '~/features/auth/hooks/use-sign-up'

// useSignUpフックのモック
vi.mock('~/features/auth/hooks/use-sign-up')

// useSignUpの戻り値の型を取得
type UseSignUpReturn = ReturnType<typeof useSignUp>

describe('SignUpForm', () => {
  const mockAction = vi.fn()
  const mockOnSubmit = vi.fn()
  const mockToggle = vi.fn()
  const mockPasswordChange = vi.fn()

  const defaultMockReturn = {
    action: mockAction,
    form: {
      id: 'sign-up-form',
      onSubmit: mockOnSubmit,
      key: 'sign-up-form',
      name: 'sign-up-form',
      method: 'post' as const,
      encType: 'application/x-www-form-urlencoded' as const,
      action: '',
      noValidate: false,
      value: {},
      defaultValue: {},
      error: null,
      constraint: {},
      valid: true,
      dirty: false,
      allErrors: {},
      errorId: 'form-error',
      descriptionId: 'form-description',
      defaultOptions: {},
      defaultChecked: false,
      initialValue: {},
      children: null,
    },
    fields: {
      name: {
        id: 'name',
        name: 'name',
        value: '',
        defaultValue: '',
        errors: null,
        form: 'sign-up-form',
        key: 'name',
        constraint: {},
        valid: true,
        dirty: false,
        allErrors: {},
        errorId: 'name-error',
        descriptionId: 'name-description',
        defaultOptions: {},
        defaultChecked: false,
        initialValue: '',
        children: null,
      },
      email: {
        id: 'email',
        name: 'email',
        value: '',
        defaultValue: '',
        errors: null,
        form: 'sign-up-form',
        key: 'email',
        constraint: {},
        valid: true,
        dirty: false,
        allErrors: {},
        errorId: 'email-error',
        descriptionId: 'email-description',
        defaultOptions: {},
        defaultChecked: false,
        initialValue: '',
        children: null,
      },
      password: {
        id: 'password',
        name: 'password',
        value: '',
        defaultValue: '',
        errors: null,
        form: 'sign-up-form',
        key: 'password',
        constraint: {},
        valid: true,
        dirty: false,
        allErrors: {},
        errorId: 'password-error',
        descriptionId: 'password-description',
        defaultOptions: {},
        defaultChecked: false,
        initialValue: '',
        children: null,
      },
    },
    isPending: false,
    showPassword: false,
    toggle: mockToggle,
    password: {
      value: '',
      change: mockPasswordChange,
    },
    lastResult: null,
  } as unknown as UseSignUpReturn

  beforeEach(async () => {
    vi.clearAllMocks()
    const { useSignUp } = await import('~/features/auth/hooks/use-sign-up')
    vi.mocked(useSignUp).mockReturnValue(defaultMockReturn)
  })

  describe('レンダリング', () => {
    test('フォーム要素が正しく表示される', () => {
      render(<SignUpForm />)

      // フォームの存在確認
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      expect(form).toHaveAttribute('aria-labelledby', 'sign-up-title')

      // ユーザー名入力フィールド
      const nameInput = screen.getByLabelText('ユーザー名')
      expect(nameInput).toBeInTheDocument()
      expect(nameInput).toHaveAttribute('type', 'text')
      expect(nameInput).toHaveAttribute('placeholder', 'ユーザー名を入力してください')
      expect(nameInput).toHaveAttribute('autoComplete', 'name')

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
      expect(passwordInput).toHaveAttribute('autoComplete', 'new-password')

      // パスワード表示切り替えボタン
      const toggleButton = screen.getByLabelText('パスワードを表示')
      expect(toggleButton).toBeInTheDocument()

      // アカウント作成ボタン
      const submitButton = screen.getByRole('button', { name: 'アカウント作成' })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toHaveAttribute('type', 'submit')
    })

    test('エラーメッセージが表示される', async () => {
      const mockReturnWithError = {
        ...defaultMockReturn,
        lastResult: {
          error: {
            message: 'アカウント作成に失敗しました',
          },
        },
      } as unknown as UseSignUpReturn
      const { useSignUp } = await import('~/features/auth/hooks/use-sign-up')
      vi.mocked(useSignUp).mockReturnValue(mockReturnWithError)

      render(<SignUpForm />)

      const errorAlert = screen.getByRole('alert')
      expect(errorAlert).toBeInTheDocument()
      expect(errorAlert).toHaveTextContent('アカウント作成に失敗しました')
    })
  })

  describe('パスワード強度インジケーター', () => {
    test('パスワードが空の時、インジケーターが表示されない', () => {
      render(<SignUpForm />)

      // パスワード強度インジケーターが表示されないことを確認
      expect(screen.queryByText('パスワード強度:')).toBeNull()
    })

    test('弱いパスワードの時、赤いインジケーターが表示される', async () => {
      const mockReturnWithWeakPassword = {
        ...defaultMockReturn,
        password: {
          value: '123',
          change: mockPasswordChange,
        },
      } as unknown as UseSignUpReturn
      const { useSignUp } = await import('~/features/auth/hooks/use-sign-up')
      vi.mocked(useSignUp).mockReturnValue(mockReturnWithWeakPassword)

      render(<SignUpForm />)

      const strengthText = screen.getByText('弱い')
      expect(strengthText).toBeInTheDocument()
      expect(strengthText).toHaveClass('text-red-600')

      // パスワード強度のラベルが表示される
      const strengthLabel = screen.getByText('パスワード強度:')
      expect(strengthLabel).toBeInTheDocument()
    })

    test('普通のパスワードの時、黄色いインジケーターが表示される', async () => {
      const mockReturnWithNormalPassword = {
        ...defaultMockReturn,
        password: {
          value: 'password123',
          change: mockPasswordChange,
        },
      } as unknown as UseSignUpReturn
      const { useSignUp } = await import('~/features/auth/hooks/use-sign-up')
      vi.mocked(useSignUp).mockReturnValue(mockReturnWithNormalPassword)

      render(<SignUpForm />)

      const strengthText = screen.getByText('普通')
      expect(strengthText).toBeInTheDocument()
      expect(strengthText).toHaveClass('text-yellow-600')
    })

    test('強いパスワードの時、緑のインジケーターが表示される', async () => {
      const mockReturnWithStrongPassword = {
        ...defaultMockReturn,
        password: {
          value: 'StrongPassword123',
          change: mockPasswordChange,
        },
      } as unknown as UseSignUpReturn
      const { useSignUp } = await import('~/features/auth/hooks/use-sign-up')
      vi.mocked(useSignUp).mockReturnValue(mockReturnWithStrongPassword)

      render(<SignUpForm />)

      const strengthText = screen.getByText('強い')
      expect(strengthText).toBeInTheDocument()
      expect(strengthText).toHaveClass('text-green-600')
    })
  })

  describe('ユーザーインタラクション', () => {
    test('パスワード表示切り替えが動作する', async () => {
      const user = userEvent.setup()
      render(<SignUpForm />)

      const toggleButton = screen.getByLabelText('パスワードを表示')
      const passwordInput = screen.getByLabelText('パスワード')

      // 初期状態はpasswordタイプ
      expect(passwordInput).toHaveAttribute('type', 'password')

      // クリックでパスワード表示
      await user.click(toggleButton)
      expect(mockToggle).toHaveBeenCalledWith(true)
    })

    test('フォーム送信が正しく実行される', async () => {
      const user = userEvent.setup()
      render(<SignUpForm />)

      const nameInput = screen.getByLabelText('ユーザー名')
      const emailInput = screen.getByLabelText('メールアドレス')
      const passwordInput = screen.getByLabelText('パスワード')
      const submitButton = screen.getByRole('button', { name: 'アカウント作成' })

      // フォームに入力
      await user.type(nameInput, 'テストユーザー')
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
      } as unknown as UseSignUpReturn
      const { useSignUp } = await import('~/features/auth/hooks/use-sign-up')
      vi.mocked(useSignUp).mockReturnValue(mockReturnWithPending)

      render(<SignUpForm />)

      const submitButton = screen.getByRole('button', { name: /登録中/ })
      expect(submitButton).toBeDisabled()
      expect(submitButton).toHaveTextContent('登録中...')
    })

    test('isPendingがfalseの時、通常の表示', () => {
      render(<SignUpForm />)

      const submitButton = screen.getByRole('button', { name: 'アカウント作成' })
      expect(submitButton).not.toBeDisabled()
      expect(submitButton).toHaveTextContent('アカウント作成')
    })
  })

  describe('アクセシビリティ', () => {
    test('適切なaria属性が設定されている', () => {
      render(<SignUpForm />)

      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('aria-labelledby', 'sign-up-title')

      const nameInput = screen.getByLabelText('ユーザー名')
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-error name-hint')
      expect(nameInput).toHaveAttribute('aria-invalid', 'false')

      const emailInput = screen.getByLabelText('メールアドレス')
      expect(emailInput).toHaveAttribute('aria-describedby', 'email-error email-hint')
      expect(emailInput).toHaveAttribute('aria-invalid', 'false')

      const passwordInput = screen.getByLabelText('パスワード')
      expect(passwordInput).toHaveAttribute(
        'aria-describedby',
        'password-error password-hint password-strength',
      )
      expect(passwordInput).toHaveAttribute('aria-invalid', 'false')
    })
  })

  describe('フォームバリデーション', () => {
    test('Conformのpropが正しく適用されている', () => {
      render(<SignUpForm />)

      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('id', 'sign-up-form')

      const nameInput = screen.getByLabelText('ユーザー名')
      const emailInput = screen.getByLabelText('メールアドレス')
      const passwordInput = screen.getByLabelText('パスワード')

      expect(nameInput).toHaveAttribute('id', 'name')
      expect(emailInput).toHaveAttribute('id', 'email')
      expect(passwordInput).toHaveAttribute('id', 'password')
    })

    test('パスワード値が適切に管理されている', async () => {
      const mockReturnWithPassword = {
        ...defaultMockReturn,
        password: {
          value: 'test-password-value',
          change: mockPasswordChange,
        },
      } as unknown as UseSignUpReturn
      const { useSignUp } = await import('~/features/auth/hooks/use-sign-up')
      vi.mocked(useSignUp).mockReturnValue(mockReturnWithPassword)

      render(<SignUpForm />)

      const passwordInput = screen.getByLabelText('パスワード')
      expect(passwordInput).toHaveValue('test-password-value')
    })
  })

  describe('スクリーンリーダー対応', () => {
    test('sr-onlyヒントテキストが存在する', () => {
      render(<SignUpForm />)

      const nameHint = screen.getByText('お名前を入力してください')
      const emailHint = screen.getByText('有効なメールアドレスを入力してください')
      const passwordHint = screen.getByText('8文字以上のパスワードを入力してください')

      expect(nameHint).toHaveClass('sr-only')
      expect(emailHint).toHaveClass('sr-only')
      expect(passwordHint).toHaveClass('sr-only')
    })
  })
})
