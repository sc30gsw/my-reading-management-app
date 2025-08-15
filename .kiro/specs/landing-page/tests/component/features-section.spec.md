# FeaturesSectionコンポーネントテスト仕様

## 概要

機能紹介セクションコンポーネントに対するTDD用包括的テスト仕様。要件 REQ-2（EARS 2.1-2.4）を検証し、アニメーション機能とインタラクティブ要素を含む実装をサポートする。

## 要件マッピング

| 要件ID | EARS基準 | テストケースID | 検証内容 |
|--------|----------|---------------|----------|
| REQ-2.1 | WHERE 機能紹介セクションにおいて | TC-C-004 | 3つの主要機能表示 |
| REQ-2.2 | WHEN ユーザーが各機能カードを閲覧した時 | TC-C-005 | 機能カード要素構成 |
| REQ-2.3 | IF メンタルマップ機能が表示されている時 | TC-C-006 | メンタルマップ機能強調 |
| REQ-2.4 | WHILE ユーザーが機能セクションをスクロールしている時 | TC-C-007 | アニメーション効果 |

## Component仕様

### Propsインターフェース
```typescript
interface FeaturesSectionProps {
  className?: string;
  features?: Feature[];
  animated?: boolean;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlighted?: boolean;
}
```

### 期待される構造
```typescript
export function FeaturesSection({ 
  className, 
  features = DEFAULT_FEATURES, 
  animated = true 
}: FeaturesSectionProps) {
  return (
    <section data-testid="features-section" className={cn("...", className)}>
      <div data-testid="features-header">
        <h2 data-testid="features-title">主要機能</h2>
        <p data-testid="features-description">...</p>
      </div>
      <div data-testid="features-grid">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            index={index}
            animated={animated}
            data-testid={`feature-card-${feature.id}`}
          />
        ))}
      </div>
    </section>
  );
}
```

## ユニットテスト仕様

### TC-C-004: 3つの主要機能表示
**目的**: 要件2.1の検証 - メンタルマップ、読書管理、統計分析の表示

```typescript
describe('FeaturesSection - 主要機能表示', () => {
  it('should render three main features', () => {
    // Arrange & Act
    render(<FeaturesSection />);
    
    // Assert
    expect(screen.getByTestId('features-section')).toBeInTheDocument();
    
    const featureCards = screen.getAllByTestId(/^feature-card-/);
    expect(featureCards).toHaveLength(3);
  });
  
  it('should display mental map feature', () => {
    // Arrange & Act
    render(<FeaturesSection />);
    
    // Assert
    expect(screen.getByTestId('feature-card-mental-map')).toBeInTheDocument();
    expect(screen.getByText(/メンタルマップ/)).toBeInTheDocument();
  });
  
  it('should display reading management feature', () => {
    // Arrange & Act
    render(<FeaturesSection />);
    
    // Assert
    expect(screen.getByTestId('feature-card-reading-management')).toBeInTheDocument();
    expect(screen.getByText(/読書管理/)).toBeInTheDocument();
  });
  
  it('should display statistics analysis feature', () => {
    // Arrange & Act
    render(<FeaturesSection />);
    
    // Assert
    expect(screen.getByTestId('feature-card-statistics')).toBeInTheDocument();
    expect(screen.getByText(/統計分析/)).toBeInTheDocument();
  });
});
```

### TC-C-005: 機能カード要素構成
**目的**: 要件2.2の検証 - 機能名、説明文、アイコン/イラストの組み合わせ

```typescript
describe('FeaturesSection - 機能カード構成', () => {
  it('should display feature name for each card', () => {
    // Arrange & Act
    render(<FeaturesSection />);
    
    // Assert
    const mentalMapCard = screen.getByTestId('feature-card-mental-map');
    expect(within(mentalMapCard).getByRole('heading')).toHaveTextContent(/メンタルマップ/);
  });
  
  it('should display description for each feature', () => {
    // Arrange & Act
    render(<FeaturesSection />);
    
    // Assert
    const featureCards = screen.getAllByTestId(/^feature-card-/);
    
    featureCards.forEach(card => {
      const description = within(card).getByTestId('feature-description');
      expect(description).toBeInTheDocument();
      expect(description.textContent).toBeTruthy();
    });
  });
  
  it('should display icon for each feature', () => {
    // Arrange & Act
    render(<FeaturesSection />);
    
    // Assert
    const featureCards = screen.getAllByTestId(/^feature-card-/);
    
    featureCards.forEach(card => {
      const icon = within(card).getByTestId('feature-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toBeVisible();
    });
  });
  
  it('should combine all elements in proper hierarchy', () => {
    // Arrange & Act
    render(<FeaturesSection />);
    
    // Assert
    const mentalMapCard = screen.getByTestId('feature-card-mental-map');
    const elements = within(mentalMapCard);
    
    expect(elements.getByTestId('feature-icon')).toBeInTheDocument();
    expect(elements.getByRole('heading')).toBeInTheDocument();
    expect(elements.getByTestId('feature-description')).toBeInTheDocument();
  });
});
```

### TC-C-006: メンタルマップ機能強調
**目的**: 要件2.3の検証 - 「3×3構造で読書前の意図を整理」特徴の強調

```typescript
describe('FeaturesSection - メンタルマップ機能強調', () => {
  it('should highlight mental map with 3x3 structure description', () => {
    // Arrange & Act
    render(<FeaturesSection />);
    
    // Assert
    const mentalMapCard = screen.getByTestId('feature-card-mental-map');
    expect(within(mentalMapCard).getByText(/3×3構造/)).toBeInTheDocument();
    expect(within(mentalMapCard).getByText(/読書前の意図を整理/)).toBeInTheDocument();
  });
  
  it('should mark mental map feature as highlighted', () => {
    // Arrange & Act
    render(<FeaturesSection />);
    
    // Assert
    const mentalMapCard = screen.getByTestId('feature-card-mental-map');
    expect(mentalMapCard).toHaveClass('highlighted');
  });
  
  it('should give mental map feature visual prominence', () => {
    // Arrange & Act
    render(<FeaturesSection />);
    
    // Assert
    const mentalMapCard = screen.getByTestId('feature-card-mental-map');
    const styles = window.getComputedStyle(mentalMapCard);
    
    // 強調表示の視覚的確認（例：枠線、背景色等）
    expect(mentalMapCard).toHaveClass('border-primary');
  });
});
```

### TC-C-007: アニメーション効果
**目的**: 要件2.4の検証 - スクロール時のアニメーション効果

```typescript
describe('FeaturesSection - アニメーション効果', () => {
  it('should animate features on scroll', () => {
    // Arrange
    const mockIntersectionObserver = jest.fn();
    window.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: mockIntersectionObserver,
      disconnect: jest.fn(),
    }));
    
    // Act
    render(<FeaturesSection animated={true} />);
    
    // Assert
    expect(mockIntersectionObserver).toHaveBeenCalled();
  });
  
  it('should display features sequentially when in view', async () => {
    // Arrange
    const mockInView = { current: true };
    jest.mock('framer-motion', () => ({
      motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      },
    }));
    
    // Act
    render(<FeaturesSection />);
    
    // Assert
    const featureCards = screen.getAllByTestId(/^feature-card-/);
    featureCards.forEach((card, index) => {
      expect(card).toHaveAttribute('data-animation-delay', `${index * 0.2}`);
    });
  });
  
  it('should disable animations when animated prop is false', () => {
    // Arrange & Act
    render(<FeaturesSection animated={false} />);
    
    // Assert
    const featureCards = screen.getAllByTestId(/^feature-card-/);
    featureCards.forEach(card => {
      expect(card).not.toHaveClass('animate-fade-in');
    });
  });
});
```

## FeatureCardコンポーネントテスト

### FC-001: 個別カードテスト
```typescript
describe('FeatureCard - 個別コンポーネント', () => {
  const mockFeature: Feature = {
    id: 'test-feature',
    title: 'テスト機能',
    description: 'テスト用の機能説明',
    icon: 'test-icon',
    highlighted: true,
  };
  
  it('should render feature card with provided data', () => {
    // Arrange & Act
    render(<FeatureCard feature={mockFeature} index={0} />);
    
    // Assert
    expect(screen.getByText('テスト機能')).toBeInTheDocument();
    expect(screen.getByText('テスト用の機能説明')).toBeInTheDocument();
    expect(screen.getByTestId('feature-icon')).toBeInTheDocument();
  });
  
  it('should apply highlighted styling when highlighted prop is true', () => {
    // Arrange & Act
    render(<FeatureCard feature={mockFeature} index={0} />);
    
    // Assert
    const card = screen.getByTestId('feature-card-test-feature');
    expect(card).toHaveClass('highlighted');
  });
  
  it('should handle icon rendering', () => {
    // Arrange & Act
    render(<FeatureCard feature={mockFeature} index={0} />);
    
    // Assert
    const icon = screen.getByTestId('feature-icon');
    expect(icon).toHaveAttribute('data-icon', 'test-icon');
  });
});
```

## アクセシビリティテスト仕様

### A11y-002: セマンティック構造
```typescript
describe('FeaturesSection - アクセシビリティ', () => {
  it('should have proper heading hierarchy', () => {
    // Arrange & Act
    render(<FeaturesSection />);
    
    // Assert
    const sectionTitle = screen.getByRole('heading', { level: 2 });
    expect(sectionTitle).toBeInTheDocument();
    
    const featureHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(featureHeadings).toHaveLength(3);
  });
  
  it('should provide proper aria labels', () => {
    // Arrange & Act
    render(<FeaturesSection />);
    
    // Assert
    const section = screen.getByTestId('features-section');
    expect(section).toHaveAttribute('aria-label', '主要機能一覧');
    
    const grid = screen.getByTestId('features-grid');
    expect(grid).toHaveAttribute('role', 'list');
  });
  
  it('should support keyboard navigation', () => {
    // Arrange & Act
    render(<FeaturesSection />);
    
    // Assert
    const featureCards = screen.getAllByTestId(/^feature-card-/);
    featureCards.forEach(card => {
      expect(card).toHaveAttribute('tabIndex', '0');
    });
  });
});
```

## レスポンシブテスト仕様

### RWD-002: グリッドレイアウト
```typescript
describe('FeaturesSection - レスポンシブ対応', () => {
  it('should use single column on mobile', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    // Act
    render(<FeaturesSection />);
    
    // Assert
    const grid = screen.getByTestId('features-grid');
    expect(grid).toHaveClass('grid-cols-1');
  });
  
  it('should use three columns on desktop', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    
    // Act
    render(<FeaturesSection />);
    
    // Assert
    const grid = screen.getByTestId('features-grid');
    expect(grid).toHaveClass('lg:grid-cols-3');
  });
});
```

## パフォーマンステスト仕様

### PERF-002: アニメーション最適化
```typescript
describe('FeaturesSection - パフォーマンス', () => {
  it('should use efficient animation libraries', () => {
    // Arrange & Act
    render(<FeaturesSection />);
    
    // Assert
    const animatedElements = screen.getAllByTestId(/^feature-card-/);
    animatedElements.forEach(element => {
      expect(element).not.toHaveStyle('transform: matrix3d(...)'); // GPU加速確認
    });
  });
  
  it('should reduce motion for users with motion preference', () => {
    // Arrange
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    // Act
    render(<FeaturesSection />);
    
    // Assert
    const featureCards = screen.getAllByTestId(/^feature-card-/);
    featureCards.forEach(card => {
      expect(card).toHaveClass('motion-reduce:animate-none');
    });
  });
});
```

## モックとフィクスチャ

### テストデータ
```typescript
export const featuresSectionMocks = {
  defaultFeatures: [
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
  ],
  customFeatures: [
    {
      id: 'custom-feature',
      title: 'カスタム機能',
      description: 'テスト用のカスタム機能',
      icon: 'custom-icon',
      highlighted: false,
    },
  ],
} as const;
```

### Animation Mocks
```typescript
jest.mock('framer-motion', () => ({
  motion: {
    div: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
  },
  useInView: jest.fn(() => true),
  AnimatePresence: jest.fn(({ children }) => children),
}));
```

## TDD実装ワークフロー

### Red Phase (失敗テスト)
1. `TC-C-004` - 3機能表示テスト記述
2. `TC-C-005` - カード構成要素テスト記述
3. `TC-C-006` - メンタルマップ強調テスト記述
4. `TC-C-007` - アニメーション効果テスト記述

### Green Phase (最小実装)
1. セクション基本構造実装
2. 機能カードコンポーネント実装
3. メンタルマップ強調実装
4. スクロールアニメーション実装

### Refactor Phase (品質向上)
1. アニメーション性能最適化
2. レスポンシブ対応強化
3. アクセシビリティ改善

## カバレッジ要件

- **機能カバレッジ**: 100% (要件2.1-2.4対応)
- **行カバレッジ**: ≥85%
- **分岐カバレッジ**: ≥80%
- **アニメーション**: 60FPS維持
- **レスポンシブ**: 3ブレークポイント検証

---

*この仕様は要件 REQ-2 の完全な検証を保証し、アニメーションとインタラクションに特に注力します。*