# AuthService Unit Test Specification

## Test Target
認証サービス（Better Auth統合）のユニットテスト仕様

## Test Scope
- Better Auth API呼び出し
- エラーハンドリング
- セッション管理
- ユーザー検証ロジック

## Test Cases

### TC-U-001: ユーザー登録（signUpEmail）
**Requirements Coverage**: REQ-1.1, REQ-1.2

#### Test Case: 正常なユーザー登録
```typescript
describe('AuthService.signUpEmail', () => {
  test('有効なデータでユーザー登録が成功する', async () => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    }

    // Mock Better Auth response
    vi.mocked(auth.api.signUpEmail).mockResolvedValue({
      user: { id: 'user-id', email: userData.email, name: userData.name },
      session: { token: 'session-token' }
    })

    // Act
    const result = await auth.api.signUpEmail({ body: userData })

    // Assert
    expect(result.user.email).toBe(userData.email)
    expect(result.user.name).toBe(userData.name)
    expect(result.session.token).toBeDefined()
  })
})
```

#### Test Case: 重複メール登録エラー
```typescript
test('既存メールでエラーが発生する', async () => {
  // Arrange
  const existingEmail = 'existing@example.com'
  vi.mocked(auth.api.signUpEmail).mockRejectedValue(
    new APIError(400, { message: 'EMAIL_ALREADY_EXISTS' })
  )

  // Act & Assert
  await expect(auth.api.signUpEmail({
    body: { email: existingEmail, password: 'password123', name: 'Test' }
  })).rejects.toThrow('EMAIL_ALREADY_EXISTS')
})
```

### TC-U-002: ユーザーログイン（signInEmail）
**Requirements Coverage**: REQ-2.1, REQ-2.2

#### Test Case: 正常なログイン
```typescript
describe('AuthService.signInEmail', () => {
  test('正しい認証情報でログインが成功する', async () => {
    // Arrange
    const credentials = {
      email: 'user@example.com',
      password: 'password123'
    }

    vi.mocked(auth.api.signInEmail).mockResolvedValue({
      user: { id: 'user-id', email: credentials.email },
      session: { token: 'session-token', expiresAt: new Date() }
    })

    // Act
    const result = await auth.api.signInEmail({ body: credentials })

    // Assert
    expect(result.user.email).toBe(credentials.email)
    expect(result.session.token).toBeDefined()
  })
})
```

#### Test Case: 認証失敗
```typescript
test('間違った認証情報でエラーが発生する', async () => {
  // Arrange
  vi.mocked(auth.api.signInEmail).mockRejectedValue(
    new APIError(401, { message: 'INVALID_CREDENTIALS' })
  )

  // Act & Assert
  await expect(auth.api.signInEmail({
    body: { email: 'wrong@example.com', password: 'wrongpassword' }
  })).rejects.toThrow('INVALID_CREDENTIALS')
})
```

### TC-U-003: セッション管理（getSession）
**Requirements Coverage**: REQ-4.1, REQ-4.2

#### Test Case: 有効セッション取得
```typescript
describe('AuthService.getSession', () => {
  test('有効なセッションが取得できる', async () => {
    // Arrange
    const mockSession = {
      id: 'session-id',
      userId: 'user-id',
      token: 'valid-token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24時間後
    }

    vi.mocked(auth.api.getSession).mockResolvedValue({ session: mockSession })

    // Act
    const result = await auth.api.getSession()

    // Assert
    expect(result.session).toBeDefined()
    expect(result.session.userId).toBe('user-id')
    expect(result.session.expiresAt).toBeInstanceOf(Date)
  })
})
```

#### Test Case: 期限切れセッション
```typescript
test('期限切れセッションでnullが返される', async () => {
  // Arrange
  vi.mocked(auth.api.getSession).mockResolvedValue({ session: null })

  // Act
  const result = await auth.api.getSession()

  // Assert
  expect(result.session).toBeNull()
})
```

### TC-U-004: ログアウト（signOut）
**Requirements Coverage**: REQ-2.3

#### Test Case: 正常なログアウト
```typescript
describe('AuthService.signOut', () => {
  test('ログアウトが正常に実行される', async () => {
    // Arrange
    vi.mocked(auth.api.signOut).mockResolvedValue({ success: true })

    // Act
    const result = await auth.api.signOut()

    // Assert
    expect(result.success).toBe(true)
  })
})
```

## Mock Strategy
- Better Auth API全てのメソッドをviでモック
- データベース接続をモック
- ネットワーク呼び出しを分離
- 実際のパスワードハッシュ化は無効化

## Coverage Target
- Line Coverage: ≥90%
- Branch Coverage: ≥85%
- Function Coverage: 100%