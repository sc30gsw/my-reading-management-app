# Validation Schemas Unit Test Specification

## Test Target
Zodバリデーションスキーマのユニットテスト仕様

## Test Scope
- signUpSchema バリデーション
- signInSchema バリデーション
- エラーメッセージ検証
- AuthErrorHandler機能

## Test Cases

### TC-U-005: ユーザー登録スキーマ（signUpSchema）
**Requirements Coverage**: REQ-1.3, REQ-1.4, REQ-1.5

#### Test Case: 有効な入力の受け入れ
```typescript
describe('signUpSchema validation', () => {
  test('正しい形式の全フィールドを受け入れる', () => {
    // Arrange
    const validData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    }

    // Act
    const result = signUpSchema.safeParse(validData)

    // Assert
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe(validData.email)
      expect(result.data.password).toBe(validData.password)
      expect(result.data.name).toBe(validData.name)
    }
  })
})
```

#### Test Case: 無効なメール形式
```typescript
test('無効なメール形式でエラーが発生する', () => {
  // Arrange
  const invalidEmailData = {
    email: 'invalid-email',
    password: 'password123',
    name: 'Test User'
  }

  // Act
  const result = signUpSchema.safeParse(invalidEmailData)

  // Assert
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues[0].path).toContain('email')
    expect(result.error.issues[0].message).toBe('メールアドレスが不正です')
  }
})
```

#### Test Case: 短すぎるパスワード
```typescript
test('8文字未満のパスワードでエラーが発生する', () => {
  // Arrange
  const shortPasswordData = {
    email: 'test@example.com',
    password: '1234567', // 7文字
    name: 'Test User'
  }

  // Act
  const result = signUpSchema.safeParse(shortPasswordData)

  // Assert
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues[0].path).toContain('password')
    expect(result.error.issues[0].message).toBe('パスワードは8文字以上で入力してください')
  }
})
```

#### Test Case: 長すぎるメール
```typescript
test('128文字を超えるメールでエラーが発生する', () => {
  // Arrange
  const longEmail = 'a'.repeat(120) + '@example.com' // 133文字
  const longEmailData = {
    email: longEmail,
    password: 'password123',
    name: 'Test User'
  }

  // Act
  const result = signUpSchema.safeParse(longEmailData)

  // Assert
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues[0].path).toContain('email')
    expect(result.error.issues[0].message).toBe('メールアドレスは128文字以下で入力してください')
  }
})
```

#### Test Case: 必須フィールドの欠如
```typescript
test('必須フィールドが欠けているとエラーが発生する', () => {
  // Arrange
  const incompleteData = {
    email: 'test@example.com'
    // password と name が欠如
  }

  // Act
  const result = signUpSchema.safeParse(incompleteData)

  // Assert
  expect(result.success).toBe(false)
  if (!result.success) {
    const passwordError = result.error.issues.find(issue => 
      issue.path.includes('password')
    )
    const nameError = result.error.issues.find(issue => 
      issue.path.includes('name')
    )

    expect(passwordError?.message).toBe('パスワードを入力してください')
    expect(nameError?.message).toBe('ユーザー名を入力してください')
  }
})
```

### TC-U-006: ログインスキーマ（signInSchema）
**Requirements Coverage**: REQ-2.1, REQ-2.2

#### Test Case: 有効なログイン入力
```typescript
describe('signInSchema validation', () => {
  test('正しい形式の認証情報を受け入れる', () => {
    // Arrange
    const validCredentials = {
      email: 'user@example.com',
      password: 'password123'
    }

    // Act
    const result = signInSchema.safeParse(validCredentials)

    // Assert
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe(validCredentials.email)
      expect(result.data.password).toBe(validCredentials.password)
    }
  })
})
```

### TC-U-007: エラーハンドラー（AuthErrorHandler）
**Requirements Coverage**: REQ-1.2, REQ-2.2, REQ-5.1

#### Test Case: エラーメッセージ生成
```typescript
describe('AuthErrorHandler', () => {
  test('適切な日本語エラーメッセージを生成する', () => {
    // Act & Assert
    expect(AuthErrorHandler.handleError('INVALID_CREDENTIALS', 'signIn'))
      .toBe('メールアドレスまたはパスワードが正しくありません')

    expect(AuthErrorHandler.handleError('EMAIL_ALREADY_EXISTS', 'signUp'))
      .toBe('このメールアドレスは既に使用されています')

    expect(AuthErrorHandler.handleError('WEAK_PASSWORD', 'signUp'))
      .toBe('パスワードは8文字以上で入力してください')

    expect(AuthErrorHandler.handleError('SESSION_EXPIRED', 'session'))
      .toBe('セッションが期限切れです。再度ログインしてください')
  })

  test('未知のエラーに対してデフォルトメッセージを返す', () => {
    // Act
    const message = AuthErrorHandler.handleError('UNKNOWN_ERROR' as any, 'test')

    // Assert
    expect(message).toBe('エラーが発生しました')
  })
})
```

### TC-U-008: フィールドレベルバリデーション
**Requirements Coverage**: REQ-1.4, REQ-1.5

#### Test Case: メールバリデーション境界値
```typescript
describe('Email validation boundary tests', () => {
  test.each([
    ['a@b.co', true],              // 最短有効形式
    ['user@domain.com', true],     // 標準形式
    ['user+tag@example.co.jp', true], // 複雑な有効形式
    ['user@', false],              // 不完全
    ['@domain.com', false],        // ローカル部なし
    ['userdomaincom', false],      // @なし
  ])('メール "%s" の有効性は %s', (email, isValid) => {
    const data = { email, password: 'password123', name: 'Test' }
    const result = signUpSchema.safeParse(data)
    expect(result.success).toBe(isValid)
  })
})
```

#### Test Case: パスワード境界値テスト
```typescript
describe('Password validation boundary tests', () => {
  test.each([
    ['1234567', false],           // 7文字（短すぎる）
    ['12345678', true],           // 8文字（最小有効）
    ['a'.repeat(128), true],      // 128文字（最大有効）
    ['a'.repeat(129), false],     // 129文字（長すぎる）
  ])('パスワード長 %d文字の有効性は %s', (password, isValid) => {
    const data = { email: 'test@example.com', password, name: 'Test' }
    const result = signUpSchema.safeParse(data)
    expect(result.success).toBe(isValid)
  })
})
```

## Mock Strategy
- エラーハンドラーの内部ロジックをテスト
- バリデーション結果の詳細検証
- エラーメッセージの正確性確認

## Coverage Target
- Line Coverage: 100%（シンプルなバリデーション関数）
- Branch Coverage: 100%
- Function Coverage: 100%