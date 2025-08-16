# ランディングページテスト用モック仕様

## 概要

ランディングページのTDD実装で使用するモックデータ、サービスモック、テスト用フィクスチャの包括的な定義。一貫性のあるテストデータとモック戦略を提供する。

## データモック

### 1. ランディング統計データ

```typescript
// tests/mocks/data/landing-stats.ts
import type { LandingStats } from '~/types/landing';

export const mockLandingStats: LandingStats = {
  userCount: 1247,
  bookCount: 8932,
  mentalMapCount: 3456,
  updatedAt: new Date('2024-01-15T10:00:00Z'),
};

export const mockLandingStatsEmpty: LandingStats = {
  userCount: 0,
  bookCount: 0,
  mentalMapCount: 0,
  updatedAt: new Date('2024-01-01T00:00:00Z'),
};

export const mockLandingStatsLarge: LandingStats = {
  userCount: 25847,
  bookCount: 189432,
  mentalMapCount: 67234,
  updatedAt: new Date('2024-01-15T10:00:00Z'),
};
```

### 2. 機能データモック

```typescript
// tests/mocks/data/features.ts
import type { Feature } from '~/types/landing';

export const mockFeatures: Feature[] = [
  {
    id: 'mental-map',
    title: 'メンタルマップ',
    description: '3×3構造で読書前の意図を整理し、効果的な読書をサポート',
    icon: 'mind-map',
    highlighted: true,
  },
  {
    id: 'reading-management',
    title: '読書管理',
    description: '読書記録の作成、進捗管理、レビュー機能を統合',
    icon: 'book-management',
    highlighted: false,
  },
  {
    id: 'statistics',
    title: '統計分析',
    description: '読書データの可視化と学習パターンの分析',
    icon: 'analytics',
    highlighted: false,
  },
];

export const mockSingleFeature: Feature = {
  id: 'test-feature',
  title: 'テスト機能',
  description: 'テスト用の機能説明テキスト',
  icon: 'test-icon',
  highlighted: false,
};

export const mockHighlightedFeature: Feature = {
  id: 'highlighted-feature',
  title: '強調機能',
  description: '強調表示される特別な機能',
  icon: 'star',
  highlighted: true,
};
```

### 3. レビュー・証言データモック

```typescript
// tests/mocks/data/testimonials.ts
import type { Testimonial } from '~/types/landing';

export const mockTestimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    userName: '田中 太郎',
    content: 'メンタルマップ機能のおかげで、読書の効果が3倍になりました。意図的な読書が習慣になり、知識の定着が格段に向上しています。',
    rating: 5,
    avatarUrl: '/avatars/tanaka.jpg',
  },
  {
    id: 'testimonial-2',
    userName: '佐藤 花子',
    content: '読書管理機能が素晴らしく、今まで曖昧だった読書の成果が明確に見えるようになりました。',
    rating: 5,
    avatarUrl: '/avatars/sato.jpg',
  },
  {
    id: 'testimonial-3',
    userName: '山田 次郎',
    content: '統計分析機能で自分の読書パターンが分析でき、より効率的な学習スケジュールを組めるようになりました。',
    rating: 4,
    avatarUrl: '/avatars/yamada.jpg',
  },
];

export const mockSingleTestimonial: Testimonial = {
  id: 'single-testimonial',
  userName: 'テストユーザー',
  content: 'テスト用のレビューコンテンツです。',
  rating: 5,
  avatarUrl: '/avatars/test-user.jpg',
};

export const mockTestimonialNoAvatar: Testimonial = {
  id: 'no-avatar-testimonial',
  userName: '匿名ユーザー',
  content: 'アバター画像なしのレビューです。',
  rating: 4,
};
```

### 4. FAQ データモック

```typescript
// tests/mocks/data/faq.ts
import type { FAQItem } from '~/types/landing';

export const mockFAQItems: FAQItem[] = [
  {
    id: 'faq-1',
    question: '無料プランではどこまで利用できますか？',
    answer: '無料プランでは月に5冊まで読書記録を作成でき、基本的なメンタルマップ機能をご利用いただけます。',
    category: '料金・プラン',
    priority: 1,
  },
  {
    id: 'faq-2',
    question: 'メンタルマップとは何ですか？',
    answer: '読書前に3×3の構造で「なぜ読むか」「何を学びたいか」「どう活用するか」を整理する機能です。',
    category: '機能について',
    priority: 2,
  },
  {
    id: 'faq-3',
    question: 'データのバックアップは取られていますか？',
    answer: 'すべてのデータは定期的にバックアップされ、安全に保管されています。',
    category: 'セキュリティ',
    priority: 3,
  },
  {
    id: 'faq-4',
    question: 'モバイルアプリはありますか？',
    answer: '現在はWebアプリのみですが、レスポンシブデザインによりモバイルでも快適にご利用いただけます。',
    category: '利用環境',
    priority: 4,
  },
];

export const mockFAQCategory = (category: string): FAQItem[] => {
  return mockFAQItems.filter(item => item.category === category);
};

export const mockHighPriorityFAQ: FAQItem[] = mockFAQItems
  .filter(item => item.priority <= 2)
  .sort((a, b) => a.priority - b.priority);
```

### 5. 価値提案データモック

```typescript
// tests/mocks/data/value-propositions.ts
import type { ValueProposition } from '~/types/landing';

export const mockValuePropositions: ValueProposition[] = [
  {
    id: 'reading-quality',
    title: '読書の質向上',
    before: '漠然とした読書で内容が頭に残らない',
    after: 'メンタルマップによる構造化で深い理解',
    icon: 'book-open',
    statistic: {
      value: 85,
      unit: '%',
      trend: 'up',
    },
  },
  {
    id: 'learning-effectiveness',
    title: '学習効果最大化',
    before: 'ただ読むだけで活用できない知識',
    after: '意図的な読書プロセスで実践的な知識習得',
    icon: 'brain',
    statistic: {
      value: 3,
      unit: '倍',
      trend: 'up',
    },
  },
  {
    id: 'growth-tracking',
    title: '成長の記録',
    before: '読書の成果が見えずモチベーション低下',
    after: '読書履歴の可視化で継続的な成長実感',
    icon: 'trending-up',
    statistic: {
      value: 60,
      unit: '%',
      trend: 'up',
    },
  },
];

export const mockValuePropositionNoStats: ValueProposition = {
  id: 'no-stats-value',
  title: '統計なし価値',
  before: 'Before状態の説明',
  after: 'After状態の説明',
  icon: 'help-circle',
};
```

## サービスモック

### 1. API モック

```typescript
// tests/mocks/services/api-mocks.ts
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { 
  mockLandingStats, 
  mockTestimonials, 
  mockFAQItems 
} from '../data';

export const apiHandlers = [
  // ランディング統計API
  rest.get('/api/landing/stats', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockLandingStats)
    );
  }),

  // レビューAPI
  rest.get('/api/landing/testimonials', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockTestimonials)
    );
  }),

  // FAQ API
  rest.get('/api/landing/faq', (req, res, ctx) => {
    const category = req.url.searchParams.get('category');
    const filteredFAQ = category 
      ? mockFAQItems.filter(item => item.category === category)
      : mockFAQItems;
    
    return res(
      ctx.status(200),
      ctx.json(filteredFAQ)
    );
  }),

  // 認証API（テスト用）
  rest.post('/api/sign-up', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ 
        success: true, 
        redirectUrl: '/dashboard' 
      })
    );
  }),
];

export const mockServer = setupServer(...apiHandlers);

// エラーレスポンス用ハンドラー
export const errorHandlers = [
  rest.get('/api/landing/stats', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: 'Internal Server Error' })
    );
  }),
];
```

### 2. アニメーションライブラリモック

```typescript
// tests/mocks/services/animation-mocks.ts

// Framer Motion モック
export const mockFramerMotion = {
  motion: {
    div: jest.fn(({ children, ...props }) => (
      <div {...props} data-testid="motion-div">
        {children}
      </div>
    )),
    section: jest.fn(({ children, ...props }) => (
      <section {...props} data-testid="motion-section">
        {children}
      </section>
    )),
    h1: jest.fn(({ children, ...props }) => (
      <h1 {...props} data-testid="motion-h1">
        {children}
      </h1>
    )),
  },
  AnimatePresence: jest.fn(({ children }) => children),
  useInView: jest.fn(() => true),
  useAnimation: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  })),
};

// Intersection Observer モック
export const mockIntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Performance API モック
export const mockPerformanceAPI = {
  now: jest.fn(() => Date.now()),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
  mark: jest.fn(),
  measure: jest.fn(),
};
```

### 3. ブラウザAPI モック

```typescript
// tests/mocks/services/browser-mocks.ts

// ResizeObserver モック
export const mockResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// matchMedia モック
export const mockMatchMedia = jest.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// 時間関連モック
export const mockTime = {
  Date: {
    now: jest.fn(() => 1642284000000), // 固定日時
  },
  setTimeout: jest.fn((callback, delay) => {
    callback();
    return 1;
  }),
  clearTimeout: jest.fn(),
  setInterval: jest.fn(),
  clearInterval: jest.fn(),
};

// Local Storage モック
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
```

## テスト用ヘルパー

### 1. レンダリングヘルパー

```typescript
// tests/mocks/helpers/render-helpers.ts
import { render, type RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// カスタムレンダー（プロバイダー付き）
export const renderWithProviders = (
  ui: ReactElement,
  options?: RenderOptions
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <div data-testid="test-wrapper">
        {children}
      </div>
    ),
    ...options,
  });
};

// アニメーション無効化レンダー
export const renderWithoutAnimation = (
  ui: ReactElement,
  options?: RenderOptions
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <div data-testid="no-animation-wrapper" className="motion-reduce">
        {children}
      </div>
    ),
    ...options,
  });
};

// モバイルビューポートレンダー
export const renderMobile = (
  ui: ReactElement,
  options?: RenderOptions
) => {
  // ビューポートサイズモック
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 375,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 667,
  });

  return render(ui, options);
};
```

### 2. イベントヘルパー

```typescript
// tests/mocks/helpers/event-helpers.ts
import { fireEvent } from '@testing-library/react';

// スクロールイベントヘルパー
export const triggerScroll = (element: Element, scrollTop: number) => {
  Object.defineProperty(element, 'scrollTop', {
    writable: true,
    configurable: true,
    value: scrollTop,
  });
  
  fireEvent.scroll(element);
};

// リサイズイベントヘルパー
export const triggerResize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  fireEvent(window, new Event('resize'));
};

// Intersection Observer トリガー
export const triggerIntersection = (
  element: Element, 
  isIntersecting: boolean
) => {
  const mockEntry = {
    target: element,
    isIntersecting,
    intersectionRatio: isIntersecting ? 1 : 0,
    boundingClientRect: element.getBoundingClientRect(),
    intersectionRect: isIntersecting ? element.getBoundingClientRect() : null,
    rootBounds: null,
    time: Date.now(),
  };

  // Intersection Observer コールバックを手動で呼び出し
  const observer = (window as any).mockIntersectionObserver;
  if (observer && observer.callback) {
    observer.callback([mockEntry]);
  }
};
```

### 3. データ生成ヘルパー

```typescript
// tests/mocks/helpers/data-generators.ts

// ランダムな統計データ生成
export const generateRandomStats = (): LandingStats => ({
  userCount: Math.floor(Math.random() * 50000) + 1000,
  bookCount: Math.floor(Math.random() * 200000) + 5000,
  mentalMapCount: Math.floor(Math.random() * 100000) + 2000,
  updatedAt: new Date(),
});

// 複数レビュー生成
export const generateTestimonials = (count: number): Testimonial[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `testimonial-${index + 1}`,
    userName: `テストユーザー${index + 1}`,
    content: `テスト用のレビューコンテンツ ${index + 1} です。`,
    rating: Math.floor(Math.random() * 2) + 4, // 4-5星
    avatarUrl: `/avatars/test-${index + 1}.jpg`,
  }));
};

// FAQ アイテム生成
export const generateFAQItems = (count: number): FAQItem[] => {
  const categories = ['料金・プラン', '機能について', 'セキュリティ', '利用環境'];
  
  return Array.from({ length: count }, (_, index) => ({
    id: `faq-${index + 1}`,
    question: `よくある質問 ${index + 1} のタイトル`,
    answer: `よくある質問 ${index + 1} の回答内容です。`,
    category: categories[index % categories.length],
    priority: index + 1,
  }));
};
```

## モック設定ファイル

### 1. Jest 設定

```typescript
// tests/mocks/setup/jest-setup.ts
import '@testing-library/jest-dom';
import { mockServer } from '../services/api-mocks';
import { 
  mockIntersectionObserver,
  mockResizeObserver,
  mockMatchMedia,
  mockLocalStorage 
} from '../services/browser-mocks';

// モックサーバー設定
beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

// グローバルモック設定
beforeEach(() => {
  // Browser APIs
  window.IntersectionObserver = mockIntersectionObserver;
  window.ResizeObserver = mockResizeObserver;
  window.matchMedia = mockMatchMedia;
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
  });

  // Animation APIs
  window.requestAnimationFrame = jest.fn((callback) => {
    callback(Date.now());
    return 1;
  });
  window.cancelAnimationFrame = jest.fn();

  // Performance API
  Object.defineProperty(window, 'performance', {
    value: {
      now: jest.fn(() => Date.now()),
      getEntriesByType: jest.fn(() => []),
      mark: jest.fn(),
      measure: jest.fn(),
    },
  });
});

// クリーンアップ
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});
```

### 2. 環境変数モック

```typescript
// tests/mocks/setup/env-mocks.ts

// テスト用環境変数
export const mockEnvVars = {
  NODE_ENV: 'test',
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  NEXT_PUBLIC_API_URL: 'http://localhost:3000/api',
};

// 環境変数設定
export const setupTestEnv = () => {
  Object.keys(mockEnvVars).forEach(key => {
    process.env[key] = mockEnvVars[key as keyof typeof mockEnvVars];
  });
};
```

## モック戦略

### 1. データ分離原則
- 実際のAPIレスポンス形式に準拠
- テストケース間でのデータ独立性確保
- 境界値・エッジケースのデータ包含

### 2. サービス分離原則
- 外部依存関係の完全モック化
- ブラウザAPI・アニメーションライブラリの安定化
- 時間依存処理の決定論的実行

### 3. 保守性原則
- モックデータの中央管理
- 型安全性の確保
- 実装変更への追従性

---

*このモック仕様により、一貫性があり保守性の高いテスト環境を提供し、TDD実装を効果的にサポートします。*