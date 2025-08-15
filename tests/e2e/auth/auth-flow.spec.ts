import { expect, test } from '@playwright/test'

test.describe('認証フロー', () => {
  test.beforeEach(async ({ page }) => {
    // テスト前にデータベースをクリアするヘルパー関数を呼び出す
    await page.goto('/test-helpers/reset-db')
  })

  test('ユーザー登録からログインまでの完全フロー', async ({ page }) => {
    const testEmail = 'e2e-test@example.com'
    const testPassword = 'password123'

    // 1. ユーザー登録ページに移動
    await page.goto('/sign-up')
    await expect(page).toHaveTitle(/アカウント作成/)

    // 2. 登録フォームに入力
    await page.fill('[name="email"]', testEmail)
    await page.fill('[name="password"]', testPassword)
    await page.fill('[name="confirmPassword"]', testPassword)
    await page.check('[name="agreeToTerms"]')

    // 3. フォーム送信
    await page.click('button[type="submit"]')

    // 4. 登録成功後、ダッシュボードにリダイレクトされることを確認
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('アカウントが作成されました')).toBeVisible()

    // 5. ログアウト
    await page.click('[data-testid="user-menu-trigger"]')
    await page.click('[data-testid="logout-button"]')
    await expect(page).toHaveURL('/sign-in')

    // 6. 再ログイン
    await page.fill('[name="email"]', testEmail)
    await page.fill('[name="password"]', testPassword)
    await page.click('button[type="submit"]')

    // 7. ダッシュボードに戻ることを確認
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('ログインしました')).toBeVisible()
  })

  test('無効な認証情報でのログイン試行', async ({ page }) => {
    await page.goto('/sign-in')

    // 存在しないユーザーでログイン試行
    await page.fill('[name="email"]', 'nonexistent@example.com')
    await page.fill('[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('メールアドレスまたはパスワードが正しくありません')).toBeVisible()
    // ログインページに留まることを確認
    await expect(page).toHaveURL('/sign-in')
  })

  test('フォームバリデーションエラー', async ({ page }) => {
    await page.goto('/sign-up')

    // 無効なメールアドレスで送信
    await page.fill('[name="email"]', 'invalid-email')
    await page.fill('[name="password"]', '123') // 短すぎるパスワード
    await page.fill('[name="confirmPassword"]', '456') // 一致しないパスワード
    await page.click('button[type="submit"]')

    // バリデーションエラーが表示されることを確認
    await expect(page.getByText('有効なメールアドレスを入力してください')).toBeVisible()
    await expect(page.getByText('パスワードは8文字以上で入力してください')).toBeVisible()
    await expect(page.getByText('パスワードが一致しません')).toBeVisible()
  })

  test('重複メールアドレスでの登録エラー', async ({ page }) => {
    const testEmail = 'duplicate@example.com'
    const testPassword = 'password123'

    // 1回目の登録
    await page.goto('/sign-up')
    await page.fill('[name="email"]', testEmail)
    await page.fill('[name="password"]', testPassword)
    await page.fill('[name="confirmPassword"]', testPassword)
    await page.check('[name="agreeToTerms"]')
    await page.click('button[type="submit"]')

    // 登録成功を確認
    await expect(page).toHaveURL('/dashboard')

    // ログアウト
    await page.click('[data-testid="user-menu-trigger"]')
    await page.click('[data-testid="logout-button"]')

    // 2回目の登録（同じメールアドレス）
    await page.goto('/sign-up')
    await page.fill('[name="email"]', testEmail)
    await page.fill('[name="password"]', testPassword)
    await page.fill('[name="confirmPassword"]', testPassword)
    await page.check('[name="agreeToTerms"]')
    await page.click('button[type="submit"]')

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('このメールアドレスは既に登録されています')).toBeVisible()
  })

  test('保護されたページへの未認証アクセス', async ({ page }) => {
    // 未認証でダッシュボードにアクセス
    await page.goto('/dashboard')

    // ログインページにリダイレクトされることを確認
    await expect(page).toHaveURL('/sign-in?callbackUrl=%2Fdashboard')
    await expect(page.getByText('ログインが必要です')).toBeVisible()
  })

  test('セッション期限切れの処理', async ({ page }) => {
    const testEmail = 'session-test@example.com'
    const testPassword = 'password123'

    // ユーザー登録とログイン
    await page.goto('/sign-up')
    await page.fill('[name="email"]', testEmail)
    await page.fill('[name="password"]', testPassword)
    await page.fill('[name="confirmPassword"]', testPassword)
    await page.check('[name="agreeToTerms"]')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')

    // セッションを手動で削除（期限切れをシミュレート）
    await page.evaluate(() => {
      document.cookie = 'better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    })

    // 保護されたページにアクセス
    await page.goto('/dashboard')

    // ログインページにリダイレクトされることを確認
    await expect(page).toHaveURL('/sign-in?callbackUrl=%2Fdashboard')
  })

  test('パスワード表示切り替え機能', async ({ page }) => {
    await page.goto('/sign-in')

    const passwordInput = page.locator('[name="password"]')
    const toggleButton = page.locator('button[aria-label*="パスワードを表示"]')

    // 初期状態はtype="password"
    await expect(passwordInput).toHaveAttribute('type', 'password')

    // パスワードを入力
    await passwordInput.fill('testpassword')

    // 表示切り替えボタンをクリック
    await toggleButton.click()

    // type="text"に変わることを確認
    await expect(passwordInput).toHaveAttribute('type', 'text')
    await expect(page.locator('button[aria-label*="パスワードを隠す"]')).toBeVisible()

    // もう一度クリックして隠す
    await page.locator('button[aria-label*="パスワードを隠す"]').click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('キーボードナビゲーション', async ({ page }) => {
    await page.goto('/sign-in')

    // Tabキーでフィールド間を移動
    await page.keyboard.press('Tab') // メールアドレスフィールドにフォーカス
    await expect(page.locator('[name="email"]')).toBeFocused()

    await page.keyboard.press('Tab') // パスワードフィールドにフォーカス
    await expect(page.locator('[name="password"]')).toBeFocused()

    await page.keyboard.press('Tab') // パスワード表示ボタンにフォーカス
    await expect(page.locator('button[aria-label*="パスワードを表示"]')).toBeFocused()

    await page.keyboard.press('Tab') // 送信ボタンにフォーカス
    await expect(page.locator('button[type="submit"]')).toBeFocused()

    // Enterキーでフォーム送信
    await page.locator('[name="email"]').fill('test@example.com')
    await page.locator('[name="password"]').fill('password123')
    await page.keyboard.press('Enter')

    // フォームが送信されることを確認（エラーメッセージが表示される）
    await expect(page.getByText('メールアドレスまたはパスワードが正しくありません')).toBeVisible()
  })

  test('ローディング状態の表示', async ({ page }) => {
    await page.goto('/sign-in')

    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')

    // ネットワークリクエストを遅延させる
    await page.route('/api/auth/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await route.continue()
    })

    await page.click('button[type="submit"]')

    // ローディング状態が表示されることを確認
    await expect(page.getByText('ログイン中...')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
  })

  test('レスポンシブデザイン - モバイル表示', async ({ page }) => {
    // モバイル表示に設定
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/sign-in')

    // フォームが適切に表示されることを確認
    const form = page.locator('form')
    await expect(form).toBeVisible()

    // ボタンが適切なサイズで表示されることを確認
    const submitButton = page.locator('button[type="submit"]')
    const buttonBox = await submitButton.boundingBox()
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44) // タッチフレンドリーなサイズ
  })

  test('アクセシビリティ - スクリーンリーダー対応', async ({ page }) => {
    await page.goto('/sign-in')

    // ARIA属性が正しく設定されていることを確認
    await expect(page.locator('form[aria-labelledby]')).toBeVisible()

    const emailInput = page.locator('[name="email"]')
    await expect(emailInput).toHaveAttribute('aria-describedby')

    const passwordInput = page.locator('[name="password"]')
    await expect(passwordInput).toHaveAttribute('aria-describedby')

    // エラーメッセージにrole="alert"が設定されることを確認
    await page.fill('[name="email"]', 'invalid-email')
    await page.click('button[type="submit"]')

    await expect(page.locator('[role="alert"]')).toBeVisible()
  })
})
