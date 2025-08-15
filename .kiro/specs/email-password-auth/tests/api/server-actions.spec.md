# Server Actions API Test Specification

## Test Target
認証関連のServer Actionsの統合テスト仕様

## Test Scope
- registerAction統合テスト
- signInAction統合テスト
- Better Auth API統合
- Drizzle ORM操作
- エラーハンドリング

## Test Cases

### TC-A-001: ユーザー登録API（registerAction）
**Requirements Coverage**: REQ-1.1, REQ-1.2, REQ-6.1

#### Test Case: 正常なユーザー登録
```typescript
describe('registerAction', () => {
  test('有効なデータで新規ユーザーが作成される', async () => {
    // Arrange
    const formData = new FormData()
    formData.append('email', 'newuser@example.com')
    formData.append('password', 'password123')
    formData.append('name', 'New User')

    // Mock Better Auth API
    vi.mocked(auth.api.signUpEmail).mockResolvedValue({
      user: {
        id: 'user-123',
        email: 'newuser@example.com',
        name: 'New User'
      },
      session: { token: 'session-token' }
    })

    // Mock database query
    vi.mocked(db.query.users.findFirst).mockResolvedValue(null) // ユーザーが存在しない

    // Act
    const result = await registerAction(null, formData)

    // Assert
    expect(result.status).toBe('success')
    expect(auth.api.signUpEmail).toHaveBeenCalledWith({
      body: {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User'
      }
    })
    expect(db.query.users.findFirst).toHaveBeenCalledWith({
      where: expect.any(Function)
    })
  })
})
```

#### Test Case: 重複メールエラー
```typescript
test('既存メールで登録しようとするとエラーが返される', async () => {
  // Arrange
  const formData = new FormData()
  formData.append('email', 'existing@example.com')
  formData.append('password', 'password123')
  formData.append('name', 'Test User')

  // Mock existing user
  vi.mocked(db.query.users.findFirst).mockResolvedValue({
    id: 'existing-user-id',
    email: 'existing@example.com',
    name: 'Existing User',
    emailVerified: true,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  // Act
  const result = await registerAction(null, formData)

  // Assert
  expect(result.status).toBe('error')
  expect(result.reply.fieldErrors?.message).toContain('このメールアドレスは既に使用されています')
  expect(auth.api.signUpEmail).not.toHaveBeenCalled()
})
```

#### Test Case: バリデーションエラー
```typescript
test('無効なデータでバリデーションエラーが返される', async () => {
  // Arrange
  const formData = new FormData()
  formData.append('email', 'invalid-email') // 無効なメール形式
  formData.append('password', '123') // 短すぎるパスワード
  formData.append('name', '') // 空の名前

  // Act
  const result = await registerAction(null, formData)

  // Assert
  expect(result.status).toBe('error')
  expect(result.reply).toBeDefined()
  // Zodバリデーションエラーが含まれる
})
```

#### Test Case: Better Auth APIエラー
```typescript
test('Better Auth APIエラーが適切に処理される', async () => {
  // Arrange
  const formData = new FormData()
  formData.append('email', 'test@example.com')
  formData.append('password', 'password123')
  formData.append('name', 'Test User')

  vi.mocked(db.query.users.findFirst).mockResolvedValue(null)
  vi.mocked(auth.api.signUpEmail).mockRejectedValue(
    new APIError(500, { message: 'Internal server error' })
  )

  // Act
  const result = await registerAction(null, formData)

  // Assert
  expect(result.status).toBe('error')
  expect(result.reply.fieldErrors?.message).toContain('Internal server error')
})
```

### TC-A-002: ログインAPI（signInAction）
**Requirements Coverage**: REQ-2.1, REQ-2.2, REQ-6.2

#### Test Case: 正常なログイン
```typescript
describe('signInAction', () => {
  test('正しい認証情報でログインが成功する', async () => {
    // Arrange
    const formData = new FormData()
    formData.append('email', 'user@example.com')
    formData.append('password', 'password123')

    // Mock existing user
    vi.mocked(db.query.users.findFirst).mockResolvedValue({
      id: 'user-123',
      email: 'user@example.com',
      name: 'Test User',
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Mock Better Auth API
    vi.mocked(auth.api.signInEmail).mockResolvedValue({
      user: {
        id: 'user-123',
        email: 'user@example.com',
        name: 'Test User'
      },
      session: { token: 'session-token' }
    })

    // Act
    const result = await signInAction(null, formData)

    // Assert
    expect(result.status).toBe('success')
    expect(auth.api.signInEmail).toHaveBeenCalledWith({
      body: {
        email: 'user@example.com',
        password: 'password123',
        asResponse: true
      }
    })
  })
})
```

#### Test Case: 未登録ユーザー
```typescript
test('未登録ユーザーでエラーが返される', async () => {
  // Arrange
  const formData = new FormData()
  formData.append('email', 'nonexistent@example.com')
  formData.append('password', 'password123')

  vi.mocked(db.query.users.findFirst).mockResolvedValue(null)

  // Act
  const result = await signInAction(null, formData)

  // Assert
  expect(result.status).toBe('error')
  expect(result.reply.fieldErrors?.message).toContain('未認証または未登録のユーザーです')
  expect(auth.api.signInEmail).not.toHaveBeenCalled()
})
```

#### Test Case: 認証失敗
```typescript
test('間違ったパスワードで認証エラーが返される', async () => {
  // Arrange
  const formData = new FormData()
  formData.append('email', 'user@example.com')
  formData.append('password', 'wrongpassword')

  vi.mocked(db.query.users.findFirst).mockResolvedValue({
    id: 'user-123',
    email: 'user@example.com',
    name: 'Test User',
    emailVerified: true,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  vi.mocked(auth.api.signInEmail).mockRejectedValue(
    new APIError(401, { message: 'Invalid credentials' })
  )

  // Act
  const result = await signInAction(null, formData)

  // Assert
  expect(result.status).toBe('error')
  expect(result.reply.fieldErrors?.message).toContain('Invalid credentials')
})
```

### TC-A-003: データベース統合
**Requirements Coverage**: REQ-6.1, REQ-6.2

#### Test Case: Drizzleクエリ統合
```typescript
describe('Database integration', () => {
  test('ユーザー検索クエリが正しく実行される', async () => {
    // Arrange
    const email = 'test@example.com'
    const mockWhere = vi.fn()
    const mockEq = vi.fn()

    vi.mocked(db.query.users.findFirst).mockImplementation(async ({ where }) => {
      // where関数を実行してクエリ条件を確認
      where!(users, { eq: mockEq })
      return null
    })

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'password123')
    formData.append('name', 'Test User')

    // Act
    await registerAction(null, formData)

    // Assert
    expect(db.query.users.findFirst).toHaveBeenCalled()
    expect(mockEq).toHaveBeenCalledWith(users.email, email)
  })
})
```

### TC-A-004: エラーハンドリング統合
**Requirements Coverage**: REQ-1.2, REQ-2.2

#### Test Case: 予期しないエラー
```typescript
describe('Error handling integration', () => {
  test('予期しないエラーが適切に処理される', async () => {
    // Arrange
    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('password', 'password123')
    formData.append('name', 'Test User')

    // Mock unexpected error
    vi.mocked(db.query.users.findFirst).mockRejectedValue(
      new Error('Database connection failed')
    )

    // Act
    const result = await registerAction(null, formData)

    // Assert
    expect(result.status).toBe('error')
    expect(result.reply.fieldErrors?.message).toContain('サーバーエラーが発生しました')
  })
})
```

### TC-A-005: セッション管理統合
**Requirements Coverage**: REQ-4.1, REQ-4.2

#### Test Case: セッション作成
```typescript
describe('Session management integration', () => {
  test('ログイン成功時にセッションが作成される', async () => {
    // Arrange
    const formData = new FormData()
    formData.append('email', 'user@example.com')
    formData.append('password', 'password123')

    vi.mocked(db.query.users.findFirst).mockResolvedValue({
      id: 'user-123',
      email: 'user@example.com',
      name: 'Test User',
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const mockSession = {
      id: 'session-123',
      token: 'session-token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }

    vi.mocked(auth.api.signInEmail).mockResolvedValue({
      user: { id: 'user-123', email: 'user@example.com', name: 'Test User' },
      session: mockSession
    })

    // Act
    const result = await signInAction(null, formData)

    // Assert
    expect(result.status).toBe('success')
    expect(auth.api.signInEmail).toHaveBeenCalledWith({
      body: expect.objectContaining({
        asResponse: true
      })
    })
  })
})
```

## Mock Strategy
- Better Auth API (auth.api.*) の完全モック
- Drizzle ORM (db.query.*) のモック
- APIError クラスのモック
- FormData の実際のオブジェクト使用

## Testing Environment
```typescript
// Test environment setup
beforeEach(() => {
  vi.clearAllMocks()
  
  // Reset Better Auth mocks
  vi.mocked(auth.api.signUpEmail).mockReset()
  vi.mocked(auth.api.signInEmail).mockReset()
  
  // Reset Database mocks
  vi.mocked(db.query.users.findFirst).mockReset()
})

afterEach(() => {
  vi.restoreAllMocks()
})
```

## Integration Points
- Server Actions ⟷ Better Auth API
- Server Actions ⟷ Drizzle ORM
- Zod validation ⟷ Server Actions
- Error handling ⟷ Client responses

## Coverage Target
- API Integration Coverage: 100%
- Error Path Coverage: 100%
- Database Operation Coverage: 100%
- Better Auth Integration Coverage: 100%