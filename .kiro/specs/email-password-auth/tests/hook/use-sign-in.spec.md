# useSignIn Hook Test Specification

## Test Target
カスタムフック useSignIn のユニットテスト仕様

## Test Scope
- フォーム状態管理
- Server Actions統合
- エラーハンドリング
- ローディング状態
- 成功・失敗コールバック

## Test Cases

### TC-H-001: Hook初期化と基本状態
**Requirements Coverage**: REQ-2.1

#### Test Case: 初期状態の確認
```typescript
describe('useSignIn initialization', () => {
  test('初期状態が正しく設定される', () => {
    // Arrange & Act
    const { result } = renderHook(() => useSignIn())

    // Assert
    expect(result.current.isPending).toBe(false)
    expect(result.current.form).toBeDefined()
    expect(result.current.fields).toBeDefined()
    expect(result.current.getError()).toBeUndefined()
  })

  test('フォームフィールドが適切に初期化される', () => {
    // Arrange & Act
    const { result } = renderHook(() => useSignIn())

    // Assert
    expect(result.current.fields.email.initialValue).toBe('')
    expect(result.current.fields.password.initialValue).toBe('')
  })
})
```

### TC-H-002: フォーム送信とServer Actions
**Requirements Coverage**: REQ-2.1, REQ-2.2

#### Test Case: 正常なログイン処理
```typescript
describe('useSignIn form submission', () => {
  test('正常なログインで成功コールバックが呼ばれる', async () => {
    // Arrange
    const mockToastSuccess = vi.fn()
    const mockRouterPush = vi.fn()
    
    vi.mocked(toast.success).mockImplementation(mockToastSuccess)
    vi.mocked(useRouter).mockReturnValue({
      push: mockRouterPush,
      replace: vi.fn(),
    })

    // Mock successful action result
    vi.mocked(signInAction).mockResolvedValue({
      status: 'success',
      value: { email: 'user@example.com', password: 'password123' }
    })

    const { result } = renderHook(() => useSignIn())

    // Act
    const formData = new FormData()
    formData.append('email', 'user@example.com')
    formData.append('password', 'password123')

    await act(async () => {
      await result.current.action(formData)
    })

    // Assert
    expect(mockToastSuccess).toHaveBeenCalled()
    expect(mockRouterPush).toHaveBeenCalledWith('/')
  })
})
```

#### Test Case: ログイン失敗処理
```typescript
test('ログイン失敗でエラーコールバックが呼ばれる', async () => {
  // Arrange
  const mockToastError = vi.fn()
  
  vi.mocked(toast.error).mockImplementation(mockToastError)

  // Mock failed action result
  vi.mocked(signInAction).mockResolvedValue({
    status: 'error',
    error: {
      fieldErrors: { 
        message: ['メールアドレスまたはパスワードが正しくありません'] 
      }
    }
  })

  const { result } = renderHook(() => useSignIn())

  // Act
  const formData = new FormData()
  formData.append('email', 'wrong@example.com')
  formData.append('password', 'wrongpassword')

  await act(async () => {
    await result.current.action(formData)
  })

  // Assert
  expect(mockToastError).toHaveBeenCalledWith('メールアドレスまたはパスワードが正しくありません')
})
```

### TC-H-003: バリデーション統合
**Requirements Coverage**: REQ-2.1, REQ-2.2

#### Test Case: クライアントサイドバリデーション
```typescript
describe('useSignIn validation', () => {
  test('無効な入力でバリデーションエラーが発生する', async () => {
    // Arrange
    const { result } = renderHook(() => useSignIn())

    // Act
    const formData = new FormData()
    formData.append('email', 'invalid-email')
    formData.append('password', '')

    await act(async () => {
      // Trigger validation
      const validation = result.current.form.validate()
      expect(validation).toBeDefined()
    })

    // Assert
    // Validation errors should be captured by the form state
    expect(result.current.fields.email.errors).toBeDefined()
    expect(result.current.fields.password.errors).toBeDefined()
  })
})
```

### TC-H-004: ローディング状態管理
**Requirements Coverage**: REQ-2.1

#### Test Case: ペンディング状態の管理
```typescript
describe('useSignIn loading states', () => {
  test('フォーム送信中はペンディング状態になる', async () => {
    // Arrange
    let resolveAction: (value: any) => void
    const actionPromise = new Promise((resolve) => {
      resolveAction = resolve
    })

    vi.mocked(signInAction).mockReturnValue(actionPromise)

    const { result } = renderHook(() => useSignIn())

    // Act
    const formData = new FormData()
    formData.append('email', 'user@example.com')
    formData.append('password', 'password123')

    act(() => {
      result.current.action(formData)
    })

    // Assert - ペンディング状態
    expect(result.current.isPending).toBe(true)

    // Act - アクション完了
    await act(async () => {
      resolveAction!({ status: 'success' })
    })

    // Assert - ペンディング解除
    expect(result.current.isPending).toBe(false)
  })
})
```

### TC-H-005: エラーハンドリング
**Requirements Coverage**: REQ-2.2

#### Test Case: エラーメッセージ取得
```typescript
describe('useSignIn error handling', () => {
  test('getError()が適切なエラーメッセージを返す', () => {
    // Arrange
    const errorResult = {
      error: {
        message: ['メールアドレスまたはパスワードが正しくありません']
      }
    }

    const { result } = renderHook(() => useSignIn(), {
      initialProps: { lastResult: errorResult }
    })

    // Act
    const errorMessage = result.current.getError()

    // Assert
    expect(errorMessage).toBe('メールアドレスまたはパスワードが正しくありません')
  })

  test('複数エラーメッセージが結合される', () => {
    // Arrange
    const errorResult = {
      error: {
        message: ['エラー1', 'エラー2', 'エラー3']
      }
    }

    const { result } = renderHook(() => useSignIn(), {
      initialProps: { lastResult: errorResult }
    })

    // Act
    const errorMessage = result.current.getError()

    // Assert
    expect(errorMessage).toBe('エラー1, エラー2, エラー3')
  })

  test('エラーがない場合はundefinedを返す', () => {
    // Arrange & Act
    const { result } = renderHook(() => useSignIn())

    // Assert
    expect(result.current.getError()).toBeUndefined()
  })
})
```

### TC-H-006: フォーム状態管理
**Requirements Coverage**: REQ-2.1

#### Test Case: フィールド状態の管理
```typescript
describe('useSignIn form state management', () => {
  test('フィールドの値が適切に管理される', async () => {
    // Arrange
    const { result } = renderHook(() => useSignIn())

    // Act
    act(() => {
      // シミュレートフィールド更新
      result.current.fields.email.value = 'test@example.com'
      result.current.fields.password.value = 'password123'
    })

    // Assert
    expect(result.current.fields.email.value).toBe('test@example.com')
    expect(result.current.fields.password.value).toBe('password123')
  })
})
```

### TC-H-007: ルーター統合
**Requirements Coverage**: REQ-2.1

#### Test Case: ナビゲーション機能
```typescript
describe('useSignIn router integration', () => {
  test('ルーターオブジェクトが適切に公開される', () => {
    // Arrange
    const mockRouter = {
      push: vi.fn(),
      replace: vi.fn(),
    }

    vi.mocked(useRouter).mockReturnValue(mockRouter)

    const { result } = renderHook(() => useSignIn())

    // Assert
    expect(result.current.router).toBe(mockRouter)
  })
})
```

### TC-H-008: Hook再レンダリング最適化
**Requirements Coverage**: パフォーマンス

#### Test Case: 不要な再レンダリングの防止
```typescript
describe('useSignIn performance optimization', () => {
  test('状態変更時のみ再レンダリングされる', () => {
    // Arrange
    let renderCount = 0
    const TestComponent = () => {
      renderCount++
      useSignIn()
      return null
    }

    const { rerender } = render(<TestComponent />)

    const initialRenderCount = renderCount

    // Act - 同じpropsで再レンダリング
    rerender(<TestComponent />)

    // Assert - レンダリング回数が増加していない（メモ化されている）
    expect(renderCount).toBe(initialRenderCount)
  })
})
```

## Mock Strategy
- signInAction Server Action のモック
- useRouter hookのモック
- toast通知のモック
- useActionState hookのモック
- withCallback関数のモック

## Testing Setup
```typescript
// Test setup utilities
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
}

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
}

const mockActionState = (initialState = null) => {
  return [initialState, vi.fn(), false]
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(toast).mockReturnValue(mockToast)
  vi.mocked(useRouter).mockReturnValue(mockRouter)
  vi.mocked(useActionState).mockReturnValue(mockActionState())
})
```

## Coverage Target
- Line Coverage: ≥90%
- Hook State Coverage: 100%（全状態パターン）
- Error Path Coverage: 100%
- Async Operation Coverage: 100%