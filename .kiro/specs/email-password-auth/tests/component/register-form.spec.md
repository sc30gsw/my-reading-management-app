# RegisterForm Component Test Specification

## Test Target
ユーザー登録フォームコンポーネントのUIテスト仕様

## Test Scope
- フォーム表示とレンダリング
- ユーザー操作（入力、送信）
- バリデーションエラー表示
- ローディング状態
- Server Actions統合

## Test Cases

### TC-C-001: フォーム基本表示
**Requirements Coverage**: REQ-1.1, REQ-1.5

#### Test Case: 初期表示
```typescript
describe('RegisterForm rendering', () => {
  test('必要な入力フィールドとボタンが表示される', () => {
    // Arrange & Act
    render(<RegisterForm />)

    // Assert
    expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/パスワード/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/ユーザー名|名前/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /登録|アカウント作成/i })).toBeInTheDocument()
  })

  test('フォームの初期状態が空である', () => {
    // Arrange & Act
    render(<RegisterForm />)

    // Assert
    expect(screen.getByLabelText(/メールアドレス/i)).toHaveValue('')
    expect(screen.getByLabelText(/パスワード/i)).toHaveValue('')
    expect(screen.getByLabelText(/ユーザー名|名前/i)).toHaveValue('')
  })
})
```

### TC-C-002: ユーザー入力操作
**Requirements Coverage**: REQ-1.1

#### Test Case: フィールド入力
```typescript
describe('RegisterForm user interactions', () => {
  test('各フィールドに入力できる', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<RegisterForm />)

    const emailInput = screen.getByLabelText(/メールアドレス/i)
    const passwordInput = screen.getByLabelText(/パスワード/i)
    const nameInput = screen.getByLabelText(/ユーザー名|名前/i)

    // Act
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(nameInput, 'Test User')

    // Assert
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
    expect(nameInput).toHaveValue('Test User')
  })
})
```

#### Test Case: フォーム送信
```typescript
test('正しいデータでフォーム送信が実行される', async () => {
  // Arrange
  const mockAction = vi.fn()
  const user = userEvent.setup()
  
  render(<RegisterForm action={mockAction} />)

  // Act
  await user.type(screen.getByLabelText(/メールアドレス/i), 'test@example.com')
  await user.type(screen.getByLabelText(/パスワード/i), 'password123')
  await user.type(screen.getByLabelText(/ユーザー名|名前/i), 'Test User')
  await user.click(screen.getByRole('button', { name: /登録|アカウント作成/i }))

  // Assert
  expect(mockAction).toHaveBeenCalledWith(expect.any(FormData))
})
```

### TC-C-003: バリデーションエラー表示
**Requirements Coverage**: REQ-1.2, REQ-1.3, REQ-1.4

#### Test Case: メールエラー表示
```typescript
describe('RegisterForm validation errors', () => {
  test('無効なメールアドレスのエラーが表示される', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<RegisterForm />)

    // Act
    await user.type(screen.getByLabelText(/メールアドレス/i), 'invalid-email')
    await user.tab() // フィールドからフォーカスを外す

    // Assert
    await waitFor(() => {
      expect(screen.getByText('メールアドレスが不正です')).toBeInTheDocument()
    })
  })

  test('重複メールエラーが表示される', async () => {
    // Arrange
    const errorResult = {
      fieldErrors: { 
        message: ['このメールアドレスは既に使用されています'] 
      }
    }
    
    render(<RegisterForm lastResult={errorResult} />)

    // Assert
    expect(screen.getByText('このメールアドレスは既に使用されています')).toBeInTheDocument()
  })
})
```

#### Test Case: パスワードエラー表示
```typescript
test('短いパスワードのエラーが表示される', async () => {
  // Arrange
  const user = userEvent.setup()
  render(<RegisterForm />)

  // Act
  await user.type(screen.getByLabelText(/パスワード/i), '1234567') // 7文字
  await user.tab()

  // Assert
  await waitFor(() => {
    expect(screen.getByText('パスワードは8文字以上で入力してください')).toBeInTheDocument()
  })
})
```

#### Test Case: 必須フィールドエラー
```typescript
test('空フィールドの必須エラーが表示される', async () => {
  // Arrange
  const user = userEvent.setup()
  render(<RegisterForm />)

  // Act
  await user.click(screen.getByRole('button', { name: /登録|アカウント作成/i }))

  // Assert
  await waitFor(() => {
    expect(screen.getByText('メールアドレスを入力してください')).toBeInTheDocument()
    expect(screen.getByText('パスワードを入力してください')).toBeInTheDocument()
    expect(screen.getByText('ユーザー名を入力してください')).toBeInTheDocument()
  })
})
```

### TC-C-004: ローディング状態
**Requirements Coverage**: REQ-1.1

#### Test Case: 送信中の表示
```typescript
describe('RegisterForm loading states', () => {
  test('送信中はボタンが無効化され、ローディング表示される', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<RegisterForm isPending={true} />)

    const submitButton = screen.getByRole('button', { name: /登録|アカウント作成/i })

    // Assert
    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/送信中|登録中/i)).toBeInTheDocument()
  })

  test('送信完了後はボタンが有効化される', () => {
    // Arrange & Act
    render(<RegisterForm isPending={false} />)

    const submitButton = screen.getByRole('button', { name: /登録|アカウント作成/i })

    // Assert
    expect(submitButton).not.toBeDisabled()
  })
})
```

### TC-C-005: アクセシビリティ
**Requirements Coverage**: 一般的なアクセシビリティ要件

#### Test Case: ARIA属性とラベル
```typescript
describe('RegisterForm accessibility', () => {
  test('適切なARIA属性とラベルが設定されている', () => {
    // Arrange & Act
    render(<RegisterForm />)

    // Assert
    const emailInput = screen.getByLabelText(/メールアドレス/i)
    const passwordInput = screen.getByLabelText(/パスワード/i)
    const nameInput = screen.getByLabelText(/ユーザー名|名前/i)

    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('required')
    expect(nameInput).toHaveAttribute('required')
  })

  test('エラー状態でaria-invalid属性が設定される', async () => {
    // Arrange
    const errorResult = {
      fieldErrors: { 
        email: ['メールアドレスが不正です'] 
      }
    }
    
    render(<RegisterForm lastResult={errorResult} />)

    // Assert
    const emailInput = screen.getByLabelText(/メールアドレス/i)
    expect(emailInput).toHaveAttribute('aria-invalid', 'true')
  })
})
```

### TC-C-006: ナビゲーション統合
**Requirements Coverage**: REQ-1.1

#### Test Case: ログインページリンク
```typescript
describe('RegisterForm navigation', () => {
  test('ログインページへのリンクが表示される', () => {
    // Arrange & Act
    render(<RegisterForm />)

    // Assert
    const loginLink = screen.getByText(/ログイン|既にアカウントをお持ちの方/i)
    expect(loginLink).toBeInTheDocument()
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login')
  })
})
```

## Mock Strategy
- Server Actions のモック
- useRouter のモック
- フォーム送信結果のモック
- Better Auth エラーレスポンスのモック

## Testing Utilities
```typescript
// Test utilities
const renderRegisterForm = (props = {}) => {
  const defaultProps = {
    action: vi.fn(),
    isPending: false,
    lastResult: null,
    ...props
  }
  
  return render(<RegisterForm {...defaultProps} />)
}

const fillValidForm = async (user) => {
  await user.type(screen.getByLabelText(/メールアドレス/i), 'test@example.com')
  await user.type(screen.getByLabelText(/パスワード/i), 'password123')
  await user.type(screen.getByLabelText(/ユーザー名|名前/i), 'Test User')
}
```

## Coverage Target
- Line Coverage: ≥85%
- User Interaction Coverage: 100%（全ての操作パターン）
- Error State Coverage: 100%（全エラーシナリオ）