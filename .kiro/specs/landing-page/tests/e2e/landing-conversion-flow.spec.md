# ランディングページ変換フロー E2Eテスト仕様

## 概要

ランディングページの主要なユーザージャーニーとコンバージョンフローに対するPlaywright E2Eテスト仕様。実際のユーザー行動をシミュレートし、要件すべてを統合的に検証する。

## 要件マッピング

| 要件ID | テストケースID | シナリオ | 検証内容 |
|--------|---------------|----------|----------|
| REQ-1.4, REQ-7.1-7.2 | TC-E-001 | メインCTA変換フロー | ヒーロー→認証→ダッシュボード |
| REQ-9.1-9.4 | TC-E-002 | パフォーマンス検証 | 読み込み時間・Core Web Vitals |
| REQ-8.1-8.4 | TC-E-003 | レスポンシブ検証 | マルチデバイス対応 |
| REQ-2.4, REQ-4.3 | TC-E-004 | インタラクション検証 | アニメーション・スクロール |
| REQ-6.2 | TC-E-005 | FAQ機能検証 | アコーディオン・検索 |

## 環境設定

### テスト環境
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

### テストデータセットアップ
```typescript
// tests/fixtures/landing-page-data.ts
export const testData = {
  user: {
    email: 'test@example.com',
    password: 'SecurePassword123!',
  },
  expectedStats: {
    userCount: expect.any(Number),
    bookCount: expect.any(Number),
    mentalMapCount: expect.any(Number),
  },
} as const;
```

## 主要E2Eテストケース

### TC-E-001: メインCTA変換フロー
**目的**: 要件1.4・7.1-7.2の検証 - 完全なコンバージョンファネル

```typescript
import { test, expect } from '@playwright/test';

test.describe('Landing Page Conversion Flow', () => {
  test('complete conversion from landing to dashboard', async ({ page }) => {
    // Arrange: ランディングページに移動
    await page.goto('/');
    
    // Act & Assert: ヒーローセクション確認
    await expect(page.getByTestId('hero-section')).toBeVisible();
    await expect(page.getByText('意図的読書で学習効果を最大化')).toBeVisible();
    
    // Act: メインCTAクリック
    const heroCtaButton = page.getByTestId('cta-primary');
    await expect(heroCtaButton).toBeVisible();
    await expect(heroCtaButton).toHaveText('無料で始める');
    await heroCtaButton.click();
    
    // Assert: 認証ページ遷移確認
    await expect(page).toHaveURL('/auth/register');
    await expect(page.getByText('アカウント作成')).toBeVisible();
    
    // Act: ユーザー登録
    await page.getByTestId('email-input').fill(testData.user.email);
    await page.getByTestId('password-input').fill(testData.user.password);
    await page.getByTestId('confirm-password-input').fill(testData.user.password);
    await page.getByTestId('register-button').click();
    
    // Assert: ダッシュボード遷移確認
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('ダッシュボード')).toBeVisible();
    await expect(page.getByText('読書管理を始めましょう')).toBeVisible();
  });
  
  test('navigation CTA conversion flow', async ({ page }) => {
    // Arrange
    await page.goto('/');
    
    // Act: ナビゲーションのCTAクリック
    const navCta = page.getByTestId('nav-cta-register');
    await expect(navCta).toBeVisible();
    await navCta.click();
    
    // Assert: 認証ページ遷移確認
    await expect(page).toHaveURL('/auth/register');
  });
  
  test('sticky navigation behavior', async ({ page }) => {
    // Arrange
    await page.goto('/');
    
    // Act: ページをスクロール
    await page.evaluate(() => window.scrollTo(0, 1000));
    
    // Assert: スティッキーナビゲーション確認
    const navigation = page.getByTestId('navigation');
    await expect(navigation).toBeVisible();
    await expect(navigation).toHaveClass(/sticky|fixed/);
  });
});
```

### TC-E-002: パフォーマンス検証
**目的**: 要件9.1-9.4の検証 - Core Web Vitals・読み込み時間

```typescript
test.describe('Landing Page Performance', () => {
  test('loading performance meets requirements', async ({ page }) => {
    // Arrange: パフォーマンス測定開始
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Act: パフォーマンスメトリクス取得
    const performanceEntries = await page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByType('navigation'));
    });
    
    const metrics = JSON.parse(performanceEntries)[0];
    
    // Assert: 3秒以内読み込み要件
    const loadTime = metrics.loadEventEnd - metrics.fetchStart;
    expect(loadTime).toBeLessThan(3000);
    
    // Assert: FCP < 1.5秒
    const fcpEntries = await page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByName('first-contentful-paint'));
    });
    
    if (fcpEntries && fcpEntries.length > 0) {
      const fcp = JSON.parse(fcpEntries)[0];
      expect(fcp.startTime).toBeLessThan(1500);
    }
  });
  
  test('Core Web Vitals compliance', async ({ page }) => {
    // Arrange
    await page.goto('/');
    
    // Act & Assert: LCP測定
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        
        setTimeout(() => resolve(null), 5000);
      });
    });
    
    if (lcp) {
      expect(lcp).toBeLessThan(2500); // LCP < 2.5秒
    }
    
    // Act & Assert: CLS測定
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });
        
        setTimeout(() => resolve(clsValue), 3000);
      });
    });
    
    expect(cls).toBeLessThan(0.1); // CLS < 0.1
  });
  
  test('60fps animation performance', async ({ page }) => {
    // Arrange
    await page.goto('/');
    
    // Act: アニメーション実行
    await page.evaluate(() => window.scrollTo(0, 500));
    
    // Assert: フレームレート測定
    const fps = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frames = 0;
        const startTime = performance.now();
        
        function frame() {
          frames++;
          if (performance.now() - startTime < 1000) {
            requestAnimationFrame(frame);
          } else {
            resolve(frames);
          }
        }
        requestAnimationFrame(frame);
      });
    });
    
    expect(fps).toBeGreaterThan(55); // 約60FPS
  });
});
```

### TC-E-003: レスポンシブ検証
**目的**: 要件8.1-8.4の検証 - マルチデバイス対応

```typescript
test.describe('Responsive Design Verification', () => {
  test('mobile layout adaptation', async ({ page }) => {
    // Arrange: モバイルビューポート設定
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Assert: モバイルレイアウト確認
    const heroSection = page.getByTestId('hero-section');
    await expect(heroSection).toHaveClass(/flex-col/);
    
    const featuresGrid = page.getByTestId('features-grid');
    await expect(featuresGrid).toHaveClass(/grid-cols-1/);
    
    // Assert: タッチフレンドリーなUI
    const ctaButton = page.getByTestId('cta-primary');
    const buttonBox = await ctaButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThan(44); // 最小タッチターゲットサイズ
  });
  
  test('tablet layout adaptation', async ({ page }) => {
    // Arrange: タブレットビューポート設定
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Assert: タブレットレイアウト確認
    const featuresGrid = page.getByTestId('features-grid');
    await expect(featuresGrid).toHaveClass(/md:grid-cols-2/);
    
    const beforeAfterContainer = page.getByTestId('before-after-container');
    await expect(beforeAfterContainer).toBeVisible();
  });
  
  test('desktop layout optimization', async ({ page }) => {
    // Arrange: デスクトップビューポート設定
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // Assert: デスクトップレイアウト確認
    const heroSection = page.getByTestId('hero-section');
    await expect(heroSection).toHaveClass(/lg:flex-row/);
    
    const featuresGrid = page.getByTestId('features-grid');
    await expect(featuresGrid).toHaveClass(/lg:grid-cols-3/);
  });
  
  test('viewport size transitions', async ({ page }) => {
    // Arrange: 初期デスクトップサイズ
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    
    // Act: モバイルサイズに変更
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // レイアウト変更待機
    
    // Assert: レスポンシブ変更確認
    const navigation = page.getByTestId('navigation');
    await expect(navigation).toBeVisible();
    
    const mobileMenu = page.getByTestId('mobile-menu-button');
    await expect(mobileMenu).toBeVisible();
  });
});
```

### TC-E-004: インタラクション検証
**目的**: 要件2.4・4.3の検証 - アニメーション・スクロール効果

```typescript
test.describe('Interactive Elements Verification', () => {
  test('scroll-triggered animations', async ({ page }) => {
    // Arrange
    await page.goto('/');
    
    // Act: 機能セクションまでスクロール
    await page.getByTestId('features-section').scrollIntoViewIfNeeded();
    
    // Assert: アニメーション発火確認
    const featureCards = page.getByTestId(/^feature-card-/);
    const firstCard = featureCards.first();
    
    await expect(firstCard).toHaveClass(/animate-fade-in|animate-slide-up/);
    await expect(firstCard).toBeVisible();
  });
  
  test('testimonial carousel interaction', async ({ page }) => {
    // Arrange
    await page.goto('/');
    await page.getByTestId('social-proof-section').scrollIntoViewIfNeeded();
    
    // Act: カルーセルナビゲーション
    const nextButton = page.getByTestId('testimonial-next');
    await expect(nextButton).toBeVisible();
    await nextButton.click();
    
    // Assert: カルーセル動作確認
    await page.waitForTimeout(300); // アニメーション待機
    const activeTestimonial = page.getByTestId('testimonial-active');
    await expect(activeTestimonial).toBeVisible();
  });
  
  test('statistics counter animation', async ({ page }) => {
    // Arrange
    await page.goto('/');
    
    // Act: 統計セクションまでスクロール
    await page.getByTestId('statistics-section').scrollIntoViewIfNeeded();
    
    // Assert: カウントアップアニメーション確認
    const userCountElement = page.getByTestId('stat-user-count');
    
    // 初期値確認
    const initialValue = await userCountElement.textContent();
    expect(initialValue).toBe('0');
    
    // アニメーション完了後の値確認
    await page.waitForTimeout(2000);
    const finalValue = await userCountElement.textContent();
    expect(Number(finalValue?.replace(/[^\d]/g, ''))).toBeGreaterThan(0);
  });
  
  test('smooth scrolling behavior', async ({ page }) => {
    // Arrange
    await page.goto('/');
    
    // Act: ナビゲーションリンククリック
    await page.getByTestId('nav-link-features').click();
    
    // Assert: スムーズスクロール確認
    await page.waitForTimeout(1000);
    const featuresSection = page.getByTestId('features-section');
    await expect(featuresSection).toBeInViewport();
  });
});
```

### TC-E-005: FAQ機能検証
**目的**: 要件6.2の検証 - FAQ アコーディオン・検索機能

```typescript
test.describe('FAQ Section Functionality', () => {
  test('accordion expand and collapse', async ({ page }) => {
    // Arrange
    await page.goto('/');
    await page.getByTestId('faq-section').scrollIntoViewIfNeeded();
    
    // Act: FAQ項目クリック
    const firstFaqItem = page.getByTestId('faq-item-0');
    await expect(firstFaqItem).toBeVisible();
    await firstFaqItem.click();
    
    // Assert: アコーディオン展開確認
    const firstFaqAnswer = page.getByTestId('faq-answer-0');
    await expect(firstFaqAnswer).toBeVisible();
    await expect(firstFaqAnswer).not.toHaveAttribute('hidden');
    
    // Act: 再度クリックで折りたたみ
    await firstFaqItem.click();
    
    // Assert: アコーディオン折りたたみ確認
    await expect(firstFaqAnswer).toBeHidden();
  });
  
  test('FAQ search functionality', async ({ page }) => {
    // Arrange
    await page.goto('/');
    await page.getByTestId('faq-section').scrollIntoViewIfNeeded();
    
    // Act: 検索実行
    const searchInput = page.getByTestId('faq-search');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('メンタルマップ');
    
    // Assert: 検索結果フィルタリング確認
    const visibleFaqItems = page.getByTestId(/^faq-item-/).filter({ hasText: 'メンタルマップ' });
    await expect(visibleFaqItems).toHaveCount(1);
    
    const hiddenFaqItems = page.getByTestId(/^faq-item-/).filter({ hasNotText: 'メンタルマップ' });
    for (const item of await hiddenFaqItems.all()) {
      await expect(item).toBeHidden();
    }
  });
  
  test('FAQ priority ordering', async ({ page }) => {
    // Arrange
    await page.goto('/');
    await page.getByTestId('faq-section').scrollIntoViewIfNeeded();
    
    // Assert: 重要な質問が上部に配置されている
    const faqItems = page.getByTestId(/^faq-item-/);
    const firstItem = faqItems.first();
    
    const firstItemText = await firstItem.textContent();
    expect(firstItemText).toMatch(/無料|料金|始め方/); // 重要な質問のキーワード
  });
});
```

## クロスブラウザ・デバイステスト

### CB-001: ブラウザ互換性
```typescript
test.describe('Cross-Browser Compatibility', () => {
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`landing page functionality on ${browserName}`, async ({ page, browserName: currentBrowser }) => {
      test.skip(currentBrowser !== browserName);
      
      // Arrange
      await page.goto('/');
      
      // Assert: 基本機能動作確認
      await expect(page.getByTestId('hero-section')).toBeVisible();
      await expect(page.getByTestId('features-section')).toBeVisible();
      await expect(page.getByTestId('cta-primary')).toBeVisible();
      
      // Act & Assert: CTA機能確認
      await page.getByTestId('cta-primary').click();
      await expect(page).toHaveURL('/auth/register');
    });
  });
});
```

## エラーハンドリングテスト

### ERR-002: エラー状態E2E検証
```typescript
test.describe('Error Handling E2E', () => {
  test('graceful degradation when JavaScript disabled', async ({ page }) => {
    // Arrange: JavaScript無効化
    await page.setJavaScriptEnabled(false);
    await page.goto('/');
    
    // Assert: 基本コンテンツ表示確認
    await expect(page.getByText('意図的読書で学習効果を最大化')).toBeVisible();
    await expect(page.getByText('無料で始める')).toBeVisible();
    
    // Act & Assert: フォーム送信確認（Progressive Enhancement）
    const ctaLink = page.getByTestId('cta-primary');
    await expect(ctaLink).toHaveAttribute('href', '/auth/register');
  });
  
  test('network failure resilience', async ({ page }) => {
    // Arrange: ネットワーク遮断
    await page.route('**/*', route => route.abort());
    
    // Act
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Assert: エラー処理確認
    expect(response?.status()).toBeGreaterThanOrEqual(400);
  });
});
```

## セットアップ・ティアダウン

### テスト環境準備
```typescript
// tests/setup/e2e-setup.ts
import { test as setup, expect } from '@playwright/test';

setup('prepare test database', async () => {
  // テストデータベース初期化
  // 必要に応じてモックデータ投入
});

setup('start development server', async () => {
  // 開発サーバー起動確認
  // または既存サーバーへの接続確認
});
```

### パフォーマンス測定ユーティリティ
```typescript
// tests/utils/performance.ts
export async function measureCoreWebVitals(page: Page) {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const vitals = {
        fcp: null,
        lcp: null,
        cls: 0,
        fid: null,
      };
      
      // FCP・LCP測定
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            vitals.fcp = entry.startTime;
          }
          if (entry.entryType === 'largest-contentful-paint') {
            vitals.lcp = entry.startTime;
          }
        }
      });
      
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
      
      setTimeout(() => resolve(vitals), 5000);
    });
  });
}
```

## 実行戦略

### CI/CD統合
```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      
      - name: Install dependencies
        run: bun install
      
      - name: Build application
        run: bun build
      
      - name: Install Playwright
        run: bunx playwright install --with-deps
      
      - name: Run E2E tests
        run: bunx playwright test
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### カバレッジ要件

- **ユーザーフロー**: 主要変換ファネル100%
- **レスポンシブ**: 5デバイス検証
- **ブラウザ**: Chrome・Firefox・Safari
- **パフォーマンス**: Core Web Vitals準拠
- **アクセシビリティ**: WCAG AA基準

---

*このE2E仕様は実際のユーザー体験を包括的に検証し、ランディングページの品質保証を実現します。*