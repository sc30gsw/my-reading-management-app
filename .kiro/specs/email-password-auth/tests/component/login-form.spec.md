# LoginForm Component Test Specification

## Test Target
ログインフォームコンポーネントのUIテスト仕様

## Test Scope
- フォーム表示とレンダリング
- ユーザー操作（入力、送信）
- 認証エラー表示
- ローディング状態
- Server Actions統合

## Test Cases

### TC-C-007: フォーム基本表示
**Requirements Coverage**: REQ-2.1, REQ-2.5

#### Test Case: 初期表示
```typescript
describe('LoginForm rendering', () => {
  test('必要な入力フィールドとボタンが表示される', () => {
    // Arrange & Act
    render(<LoginForm />)

    // Assert
    expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/パスワード/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ログイン|サインイン/i })).toBeInTheDocument()
  })

  test('フォームの初期状態が空である', () => {
    // Arrange & Act
    render(<LoginForm />)

    // Assert
    expect(screen.getByLabelText(/メールアドレス/i)).toHaveValue('')
    expect(screen.getByLabelText(/パスワード/i)).toHaveValue('')
  })
})
```

### TC-C-008: ユーザー入力操作
**Requirements Coverage**: REQ-2.1

#### Test Case: 認証情報入力
```typescript
describe('LoginForm user interactions', () => {
  test('メールアドレスとパスワードを入力できる', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/メールアドレス/i)
    const passwordInput = screen.getByLabelText(/パスワード/i)

    // Act
    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'password123')

    // Assert
    expect(emailInput).toHaveValue('user@example.com')
    expect(passwordInput).toHaveValue('password123')
  })
})
```

#### Test Case: フォーム送信
```typescript
test('正しい認証情報でフォーム送信が実行される', async () => {
  // Arrange
  const mockAction = vi.fn()
  const user = userEvent.setup()
  
  render(<LoginForm action={mockAction} />)

  // Act
  await user.type(screen.getByLabelText(/メールアドレス/i), 'user@example.com')
  await user.type(screen.getByLabelText(/パスワード/i), 'password123')
  await user.click(screen.getByRole('button', { name: /ログイン|サインイン/i }))

  // Assert
  expect(mockAction).toHaveBeenCalledWith(expect.any(FormData))
})
```

#### Test Case: Enterキーでの送信
```typescript
test('Enterキーでフォーム送信される', async () => {
  // Arrange
  const mockAction = vi.fn()
  const user = userEvent.setup()
  
  render(<LoginForm action={mockAction} />)

  // Act
  await user.type(screen.getByLabelText(/メールアドレス/i), 'user@example.com')
  await user.type(screen.getByLabelText(/パスワード/i), 'password123')
  await user.keyboard('{Enter}')

  // Assert
  expect(mockAction).toHaveBeenCalledWith(expect.any(FormData))
})
```

### TC-C-009: 認証エラー表示
**Requirements Coverage**: REQ-2.2

#### Test Case: 認証失敗エラー
```typescript
describe('LoginForm authentication errors', () => {
  test('間違った認証情報のエラーが表示される', async () => {
    // Arrange
    const errorResult = {
      fieldErrors: { 
        message: ['メールアドレスまたはパスワードが正しくありません'] 
      }
    }
    
    render(<LoginForm lastResult={errorResult} />)

    // Assert
    expect(screen.getByText('メールアドレスまたはパスワードが正しくありません')).toBeInTheDocument()
  })

  test('未登録ユーザーエラーが表示される', async () => {
    // Arrange
    const errorResult = {
      fieldErrors: { 
        message: ['未認証または未登録のユーザーです'] 
      }
    }
    
    render(<LoginForm lastResult={errorResult} />)

    // Assert
    expect(screen.getByText('未認証または未登録のユーザーです')).toBeInTheDocument()
  })
})
```

#### Test Case: バリデーションエラー
```typescript
test('空のフィールドでバリデーションエラーが表示される', async () => {
  // Arrange
  const user = userEvent.setup()
  render(<LoginForm />)

  // Act
  await user.click(screen.getByRole('button', { name: /ログイン|サインイン/i }))

  // Assert
  await waitFor(() => {
    expect(screen.getByText('メールアドレスを入力してください')).toBeInTheDocument()
    expect(screen.getByText('パスワードを入力してください')).toBeInTheDocument()
  })
})
```

### TC-C-010: ローディング状態とフィードバック
**Requirements Coverage**: REQ-2.1

#### Test Case: 送信中の表示
```typescript
describe('LoginForm loading states', () => {
  test('送信中はボタンが無効化され、ローディング表示される', async () => {
    // Arrange
    render(<LoginForm isPending={true} />)

    const submitButton = screen.getByRole('button', { name: /ログイン|サインイン/i })

    // Assert
    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/ログイン中|認証中/i)).toBeInTheDocument()
  })

  test('送信完了後はボタンが有効化される', () => {
    // Arrange & Act
    render(<LoginForm isPending={false} />)

    const submitButton = screen.getByRole('button', { name: /ログイン|サインイン/i })

    // Assert
    expect(submitButton).not.toBeDisabled()
  })
})
```

#### Test Case: 成功時のフィードバック
```typescript
test('ログイン成功後のリダイレクト確認', async () => {
  // Arrange
  const mockPush = vi.fn()
  vi.mocked(useRouter).mockReturnValue({
    push: mockPush,
    replace: vi.fn(),
  })

  // This test would be integrated with the success callback
  // Actual implementation depends on the form handling logic
})
```

### TC-C-011: パスワード表示切り替え
**Requirements Coverage**: ユーザビリティ向上

#### Test Case: パスワード表示機能
```typescript
describe('LoginForm password visibility', () => {
  test('パスワード表示切り替えボタンが機能する', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<LoginForm />)

    const passwordInput = screen.getByLabelText(/パスワード/i)
    const toggleButton = screen.getByRole('button', { name: /パスワードを表示|非表示/i })

    // Act - パスワードを表示
    await user.click(toggleButton)

    // Assert
    expect(passwordInput).toHaveAttribute('type', 'text')

    // Act - パスワードを非表示
    await user.click(toggleButton)

    // Assert
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})
```

### TC-C-012: ナビゲーション統合
**Requirements Coverage**: REQ-2.5

#### Test Case: ユーザー登録リンク
```typescript
describe('LoginForm navigation', () => {
  test('ユーザー登録ページへのリンクが表示される', () => {
    // Arrange & Act
    render(<LoginForm />)

    // Assert
    const registerLink = screen.getByText(/アカウント作成|新規登録/i)
    expect(registerLink).toBeInTheDocument()
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register')
  })

  test('パスワードリセットリンクが表示される', () => {
    // Arrange & Act
    render(<LoginForm />)

    // Assert
    const resetLink = screen.getByText(/パスワードを忘れた方|パスワードリセット/i)
    expect(resetLink).toBeInTheDocument()
    expect(resetLink.closest('a')).toHaveAttribute('href', '/reset-password')
  })
})
```

### TC-C-013: アクセシビリティ
**Requirements Coverage**: アクセシビリティ基準

#### Test Case: フォーカス管理
```typescript
describe('LoginForm accessibility', () => {
  test('適切なフォーカス順序が設定されている', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<LoginForm />)

    // Act
    await user.tab()
    expect(screen.getByLabelText(/メールアドレス/i)).toHaveFocus()

    await user.tab()
    expect(screen.getByLabelText(/パスワード/i)).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: /ログイン|サインイン/i })).toHaveFocus()
  })

  test('エラー時にフォーカスが適切に設定される', async () => {
    // Arrange
    const errorResult = {
      fieldErrors: { 
        email: ['メールアドレスが不正です'] 
      }
    }
    
    render(<LoginForm lastResult={errorResult} />)

    // Assert
    const emailInput = screen.getByLabelText(/メールアドレス/i)
    expect(emailInput).toHaveAttribute('aria-invalid', 'true')
    expect(emailInput).toHaveAttribute('aria-describedby')
  })
})
```

### TC-C-014: レスポンシブデザイン
**Requirements Coverage**: デバイス対応

#### Test Case: モバイル表示
```typescript
describe('LoginForm responsive design', () => {
  test('モバイルビューポートで適切に表示される', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // iPhone SE width
    })

    // Act
    render(<LoginForm />)

    // Assert
    const form = screen.getByRole('form')
    expect(form).toHaveClass(/mobile|responsive|full-width/i)
  })
})
```

## Mock Strategy
- Server Actions (signInAction) のモック
- useRouter のモック
- トースト通知のモック
- Success/Error コールバックのモック

## Testing Utilities
```typescript
// Test utilities
const renderLoginForm = (props = {}) => {
  const defaultProps = {
    action: vi.fn(),
    isPending: false,
    lastResult: null,
    ...props
  }
  
  return render(<LoginForm {...defaultProps} />)
}

const fillCredentials = async (user, email = 'user@example.com', password = 'password123') => {
  await user.type(screen.getByLabelText(/メールアドレス/i), email)
  await user.type(screen.getByLabelText(/パスワード/i), password)
}
```

## Coverage Target
- Line Coverage: ≥85%
- User Interaction Coverage: 100%
- Error State Coverage: 100%
- Loading State Coverage: 100%