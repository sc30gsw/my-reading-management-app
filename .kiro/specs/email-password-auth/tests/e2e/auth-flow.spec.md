# Authentication Flow E2E Test Specification

## Test Target
認証フロー全体のエンドツーエンドテスト仕様

## Test Scope
- ユーザー登録フロー
- ログインフロー
- ログアウトフロー
- セッション管理
- 保護されたページアクセス

## Test Cases

### TC-E-001: 完全ユーザー登録フロー
**Requirements Coverage**: REQ-1.1, REQ-1.2, REQ-1.3

#### Test Case: 新規ユーザー登録からダッシュボードまで
```typescript
import { test, expect } from '@playwright/test'

test('新規ユーザー登録が完全に動作する', async ({ page }) => {
  // Arrange
  const userEmail = `test-${Date.now()}@example.com`
  const userName = 'E2E Test User'
  const password = 'password123'

  // Act - 登録ページへ移動
  await page.goto('/register')

  // Assert - 登録ページが表示される
  await expect(page.getByRole('heading', { name: /登録|アカウント作成/i })).toBeVisible()

  // Act - フォーム入力
  await page.getByLabel(/メールアドレス/i).fill(userEmail)
  await page.getByLabel(/パスワード/i).fill(password)
  await page.getByLabel(/ユーザー名|名前/i).fill(userName)

  // Act - 登録実行
  await page.getByRole('button', { name: /登録|アカウント作成/i }).click()

  // Assert - ダッシュボードにリダイレクト
  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByText(/ダッシュボード|ホーム/i)).toBeVisible()

  // Assert - ユーザー情報が表示される
  await expect(page.getByText(userName)).toBeVisible()
})
```

#### Test Case: 重複メール登録エラー
```typescript
test('既存メールで登録エラーが表示される', async ({ page }) => {
  // Arrange - 既存ユーザーでテストデータを準備
  const existingEmail = 'existing@example.com'

  // Pre-condition: 既存ユーザーを作成（別のテストまたはセットアップで作成済み想定）

  // Act
  await page.goto('/register')
  await page.getByLabel(/メールアドレス/i).fill(existingEmail)
  await page.getByLabel(/パスワード/i).fill('password123')
  await page.getByLabel(/ユーザー名|名前/i).fill('Test User')
  await page.getByRole('button', { name: /登録|アカウント作成/i }).click()

  // Assert
  await expect(page.getByText('このメールアドレスは既に使用されています')).toBeVisible()
  await expect(page).toHaveURL('/register') // ページに留まる
})
```

### TC-E-002: ログインフロー
**Requirements Coverage**: REQ-2.1, REQ-2.2

#### Test Case: 正常ログイン
```typescript
test('正しい認証情報でログインできる', async ({ page }) => {
  // Arrange - テストユーザーのセットアップ
  const userEmail = 'testuser@example.com'
  const password = 'password123'

  // Pre-condition: テストユーザーが存在する

  // Act
  await page.goto('/login')
  await page.getByLabel(/メールアドレス/i).fill(userEmail)
  await page.getByLabel(/パスワード/i).fill(password)
  await page.getByRole('button', { name: /ログイン|サインイン/i }).click()

  // Assert
  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByText(/ダッシュボード/i)).toBeVisible()
})
```

#### Test Case: 認証失敗
```typescript
test('間違った認証情報でエラーが表示される', async ({ page }) => {
  // Act
  await page.goto('/login')
  await page.getByLabel(/メールアドレス/i).fill('wrong@example.com')
  await page.getByLabel(/パスワード/i).fill('wrongpassword')
  await page.getByRole('button', { name: /ログイン|サインイン/i }).click()

  // Assert
  await expect(page.getByText(/メールアドレスまたはパスワードが正しくありません|認証に失敗/i)).toBeVisible()
  await expect(page).toHaveURL('/login')
})
```

### TC-E-003: ログアウトフロー
**Requirements Coverage**: REQ-2.3

#### Test Case: ログアウト機能
```typescript
test('ログアウトが正常に動作する', async ({ page }) => {
  // Arrange - ログイン状態を作成
  await page.goto('/login')
  await page.getByLabel(/メールアドレス/i).fill('testuser@example.com')
  await page.getByLabel(/パスワード/i).fill('password123')
  await page.getByRole('button', { name: /ログイン|サインイン/i }).click()
  
  await expect(page).toHaveURL('/dashboard')

  // Act - ログアウト
  await page.getByRole('button', { name: /ログアウト/i }).click()

  // Assert
  await expect(page).toHaveURL('/login')
  await expect(page.getByText(/ログイン/i)).toBeVisible()

  // Assert - 保護されたページにアクセスできない
  await page.goto('/dashboard')
  await expect(page).toHaveURL('/login') // リダイレクトされる
})
```

### TC-E-004: セッション管理
**Requirements Coverage**: REQ-4.1, REQ-4.2, REQ-4.3

#### Test Case: セッション持続
```typescript
test('ログイン状態がページリロード後も維持される', async ({ page }) => {
  // Arrange - ログイン
  await page.goto('/login')
  await page.getByLabel(/メールアドレス/i).fill('testuser@example.com')
  await page.getByLabel(/パスワード/i).fill('password123')
  await page.getByRole('button', { name: /ログイン|サインイン/i }).click()
  
  await expect(page).toHaveURL('/dashboard')

  // Act - ページリロード
  await page.reload()

  // Assert - ログイン状態が維持される
  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByText(/ダッシュボード/i)).toBeVisible()
})
```

#### Test Case: セッション期限切れ
```typescript
test('セッション期限切れ後にリダイレクトされる', async ({ page, context }) => {
  // Arrange - ログイン
  await page.goto('/login')
  await page.getByLabel(/メールアドレス/i).fill('testuser@example.com')
  await page.getByLabel(/パスワード/i).fill('password123')
  await page.getByRole('button', { name: /ログイン|サインイン/i }).click()
  
  await expect(page).toHaveURL('/dashboard')

  // Act - セッションCookieを削除（期限切れをシミュレート）
  await context.clearCookies()

  // Act - 保護されたページにアクセス
  await page.goto('/dashboard')

  // Assert - ログインページにリダイレクト
  await expect(page).toHaveURL('/login')
})
```

### TC-E-005: 保護されたページアクセス
**Requirements Coverage**: REQ-4.4

#### Test Case: 未認証アクセス制御
```typescript
test('未認証ユーザーが保護されたページにアクセスできない', async ({ page }) => {
  // Arrange - 未認証状態

  // Act - 保護されたページに直接アクセス
  await page.goto('/dashboard')

  // Assert - ログインページにリダイレクト
  await expect(page).toHaveURL('/login')

  // Act - プロフィールページにアクセス
  await page.goto('/profile')

  // Assert - ログインページにリダイレクト
  await expect(page).toHaveURL('/login')
})
```

#### Test Case: 認証後のアクセス許可
```typescript
test('認証済みユーザーが保護されたページにアクセスできる', async ({ page }) => {
  // Arrange - ログイン
  await page.goto('/login')
  await page.getByLabel(/メールアドレス/i).fill('testuser@example.com')
  await page.getByLabel(/パスワード/i).fill('password123')
  await page.getByRole('button', { name: /ログイン|サインイン/i }).click()

  // Act & Assert - 各保護されたページにアクセス
  await page.goto('/dashboard')
  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByText(/ダッシュボード/i)).toBeVisible()

  await page.goto('/profile')
  await expect(page).toHaveURL('/profile')
  await expect(page.getByText(/プロフィール/i)).toBeVisible()
})
```

### TC-E-006: ナビゲーションフロー
**Requirements Coverage**: REQ-1.5, REQ-2.5

#### Test Case: ページ間ナビゲーション
```typescript
test('認証関連ページ間のナビゲーションが正常に動作する', async ({ page }) => {
  // Act - 登録ページからログインページへ
  await page.goto('/register')
  await page.getByText(/ログイン|既にアカウントをお持ちの方/i).click()
  await expect(page).toHaveURL('/login')

  // Act - ログインページから登録ページへ
  await page.getByText(/アカウント作成|新規登録/i).click()
  await expect(page).toHaveURL('/register')
})
```

### TC-E-007: エラーハンドリング
**Requirements Coverage**: REQ-1.2, REQ-2.2

#### Test Case: ネットワークエラー
```typescript
test('ネットワークエラー時に適切なエラーメッセージが表示される', async ({ page }) => {
  // Arrange - ネットワークエラーをシミュレート
  await page.route('**/api/auth/**', route => route.abort())

  // Act
  await page.goto('/login')
  await page.getByLabel(/メールアドレス/i).fill('test@example.com')
  await page.getByLabel(/パスワード/i).fill('password123')
  await page.getByRole('button', { name: /ログイン|サインイン/i }).click()

  // Assert
  await expect(page.getByText(/サーバーエラー|ネットワークエラー/i)).toBeVisible()
})
```

### TC-E-008: レスポンシブデザイン
**Requirements Coverage**: デバイス対応

#### Test Case: モバイル表示
```typescript
test('モバイルデバイスで認証フローが正常に動作する', async ({ page }) => {
  // Arrange - モバイルビューポート
  await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE

  // Act & Assert - 登録フロー
  await page.goto('/register')
  await expect(page.getByRole('heading', { name: /登録|アカウント作成/i })).toBeVisible()

  // フォームが適切に表示される
  await expect(page.getByLabel(/メールアドレス/i)).toBeVisible()
  await expect(page.getByLabel(/パスワード/i)).toBeVisible()
  await expect(page.getByLabel(/ユーザー名|名前/i)).toBeVisible()

  // ボタンがタップしやすいサイズで表示される
  const submitButton = page.getByRole('button', { name: /登録|アカウント作成/i })
  await expect(submitButton).toBeVisible()
  const buttonBox = await submitButton.boundingBox()
  expect(buttonBox!.height).toBeGreaterThan(44) // タッチターゲットの最小サイズ
})
```

## Test Data Management
```typescript
// Test data setup
import { test as base } from '@playwright/test'

type TestFixtures = {
  testUser: {
    email: string
    password: string
    name: string
  }
}

export const test = base.extend<TestFixtures>({
  testUser: async ({}, use) => {
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      name: 'E2E Test User'
    }
    
    // Clean up after test
    await use(testUser)
    // TODO: Delete test user from database
  }
})
```

## Test Environment Setup
```typescript
// Global setup for E2E tests
import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  // データベースのリセット（テスト用データベース）
  // テストユーザーの事前作成
  // Better Auth設定の確認
}

export default globalSetup
```

## Coverage Target
- User Journey Coverage: 100%（全認証フロー）
- Error Scenario Coverage: ≥90%
- Device Coverage: Desktop + Mobile
- Browser Coverage: Chrome, Firefox, Safari