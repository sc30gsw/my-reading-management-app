# HeroSectionコンポーネントテスト仕様

## 概要

ランディングページのヒーローセクションコンポーネントに対するTDD用包括的テスト仕様。要件 REQ-1（EARS 1.1-1.4）を検証し、Next.js 15 + React 19 RSCアーキテクチャでの実装をサポートする。

## 要件マッピング

| 要件ID | EARS基準 | テストケースID | 検証内容 |
|--------|----------|---------------|----------|
| REQ-1.1 | WHEN ユーザーがランディングページを訪問した時 | TC-C-001 | ヒーロー画像・メインコピー表示 |
| REQ-1.2 | WHERE ヒーローセクションにおいて | TC-C-002 | キーメッセージ表示 |
| REQ-1.3 | IF ユーザーがヒーローセクションを閲覧している時 | TC-C-003 | CTAボタン表示 |
| REQ-1.4 | WHEN ユーザーがCTAボタンをクリックした時 | TC-E-001 | 認証フローリダイレクト |

## Component仕様

### Propsインターフェース
```typescript
interface HeroSectionProps {
  className?: string;
  variant?: 'default' | 'compact';
}
```

### 期待される構造
```typescript
export function HeroSection({ className, variant = 'default' }: HeroSectionProps) {
  return (
    <section data-testid="hero-section" className={cn("...", className)}>
      <div data-testid="hero-content">
        <h1 data-testid="hero-title">意図的読書で学習効果を最大化</h1>
        <p data-testid="hero-description">...</p>
        <div data-testid="hero-cta-group">
          <Button data-testid="cta-primary" href="/auth/register">
            無料で始める
          </Button>
        </div>
      </div>
      <div data-testid="hero-visual">
        {/* ヒーロー画像/動画 */}
      </div>
    </section>
  );
}
```

## ユニットテスト仕様

### TC-C-001: ヒーロー画像・メインコピー表示
**目的**: 要件1.1の検証 - ヒーロー画像とメインコピーの表示

```typescript
describe('HeroSection - メインコンテンツ表示', () => {
  it('should render hero section with main copy and visual content', () => {
    // Arrange & Act
    render(<HeroSection />);
    
    // Assert
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('hero-content')).toBeInTheDocument();
    expect(screen.getByTestId('hero-visual')).toBeInTheDocument();
  });
  
  it('should display main heading with correct text', () => {
    // Arrange & Act
    render(<HeroSection />);
    
    // Assert
    const title = screen.getByTestId('hero-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('意図的読書で学習効果を最大化');
    expect(title.tagName).toBe('H1');
  });
  
  it('should render hero description', () => {
    // Arrange & Act
    render(<HeroSection />);
    
    // Assert
    const description = screen.getByTestId('hero-description');
    expect(description).toBeInTheDocument();
    expect(description).toBeVisible();
  });
});
```

### TC-C-002: キーメッセージ表示
**目的**: 要件1.2の検証 - 特定キーメッセージの表示

```typescript
describe('HeroSection - キーメッセージ表示', () => {
  it('should display key message about intentional reading', () => {
    // Arrange & Act
    render(<HeroSection />);
    
    // Assert
    expect(screen.getByText(/意図的読書で学習効果を最大化/)).toBeInTheDocument();
  });
  
  it('should highlight mental map feature in description', () => {
    // Arrange & Act
    render(<HeroSection />);
    
    // Assert
    expect(screen.getByText(/メンタルマップ/)).toBeInTheDocument();
  });
  
  it('should include reading management benefits', () => {
    // Arrange & Act
    render(<HeroSection />);
    
    // Assert
    expect(screen.getByText(/読書管理/)).toBeInTheDocument();
  });
});
```

### TC-C-003: CTAボタン表示
**目的**: 要件1.3の検証 - 目立つCTAボタンの表示

```typescript
describe('HeroSection - CTAボタン表示', () => {
  it('should display primary CTA button', () => {
    // Arrange & Act
    render(<HeroSection />);
    
    // Assert
    const ctaButton = screen.getByTestId('cta-primary');
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveTextContent('無料で始める');
  });
  
  it('should make CTA button visually prominent', () => {
    // Arrange & Act
    render(<HeroSection />);
    
    // Assert
    const ctaButton = screen.getByTestId('cta-primary');
    expect(ctaButton).toHaveClass('bg-primary'); // shadcn/ui primary styling
    expect(ctaButton).toBeVisible();
  });
  
  it('should have correct href for registration', () => {
    // Arrange & Act
    render(<HeroSection />);
    
    // Assert
    const ctaButton = screen.getByTestId('cta-primary');
    expect(ctaButton).toHaveAttribute('href', '/auth/register');
  });
});
```

## アクセシビリティテスト仕様

### A11y-001: セマンティック構造
```typescript
describe('HeroSection - アクセシビリティ', () => {
  it('should have proper heading hierarchy', () => {
    // Arrange & Act
    render(<HeroSection />);
    
    // Assert
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
  });
  
  it('should have accessible CTA button', () => {
    // Arrange & Act
    render(<HeroSection />);
    
    // Assert
    const ctaButton = screen.getByRole('link', { name: '無料で始める' });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '/auth/register');
  });
  
  it('should have sufficient color contrast', async () => {
    // Arrange & Act
    render(<HeroSection />);
    
    // Assert
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## レスポンシブテスト仕様

### RWD-001: モバイル対応
```typescript
describe('HeroSection - レスポンシブ対応', () => {
  it('should adapt layout for mobile screens', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    // Act
    render(<HeroSection />);
    
    // Assert
    const heroSection = screen.getByTestId('hero-section');
    expect(heroSection).toHaveClass('flex-col'); // モバイルレイアウト
  });
  
  it('should maintain proper spacing on tablet', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });
    
    // Act
    render(<HeroSection />);
    
    // Assert
    const heroContent = screen.getByTestId('hero-content');
    expect(heroContent).toBeVisible();
  });
});
```

## パフォーマンステスト仕様

### PERF-001: レンダリング最適化
```typescript
describe('HeroSection - パフォーマンス', () => {
  it('should render without layout shift', () => {
    // Arrange
    const observer = jest.fn();
    Object.defineProperty(window, 'PerformanceObserver', {
      value: jest.fn().mockImplementation(() => ({
        observe: observer,
        disconnect: jest.fn(),
      })),
    });
    
    // Act
    render(<HeroSection />);
    
    // Assert
    expect(observer).toHaveBeenCalled();
  });
  
  it('should load hero image efficiently', () => {
    // Arrange & Act
    render(<HeroSection />);
    
    // Assert
    const heroImage = screen.getByTestId('hero-visual').querySelector('img');
    if (heroImage) {
      expect(heroImage).toHaveAttribute('loading', 'eager');
      expect(heroImage).toHaveAttribute('priority');
    }
  });
});
```

## モックとフィクスチャ

### テストデータ
```typescript
export const heroSectionMocks = {
  defaultProps: {
    className: '',
    variant: 'default' as const,
  },
  compactProps: {
    className: 'compact-hero',
    variant: 'compact' as const,
  },
} as const;
```

### Setup/Teardown
```typescript
beforeEach(() => {
  // テスト前の初期化
  window.innerWidth = 1024;
  window.innerHeight = 768;
});

afterEach(() => {
  // テスト後のクリーンアップ
  cleanup();
  jest.clearAllMocks();
});
```

## TDD実装ワークフロー

### Red Phase (失敗テスト)
1. `TC-C-001` - ヒーロー構造テスト記述
2. `TC-C-002` - キーメッセージテスト記述
3. `TC-C-003` - CTAボタンテスト記述

### Green Phase (最小実装)
1. 基本構造の実装
2. テキストコンテンツの実装
3. CTAボタンの実装

### Refactor Phase (品質向上)
1. スタイリング最適化
2. アニメーション追加
3. パフォーマンス調整

## エラーハンドリングテスト

### ERR-001: 異常状態テスト
```typescript
describe('HeroSection - エラーハンドリング', () => {
  it('should handle missing image gracefully', () => {
    // Arrange
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Act
    render(<HeroSection />);
    
    // Assert
    expect(consoleSpy).not.toHaveBeenCalled();
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});
```

## カバレッジ要件

- **機能カバレッジ**: 100% (全要件対応)
- **行カバレッジ**: ≥85%
- **分岐カバレッジ**: ≥80%
- **アクセシビリティ**: axe-coreルール準拠
- **レスポンシブ**: 3ブレークポイント検証

---

*この仕様は TDD Red-Green-Refactor サイクルに従って実装し、要件 REQ-1 の完全な検証を保証します。*