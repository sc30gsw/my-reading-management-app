# ValuePropositionSectionコンポーネントテスト仕様

## 概要

価値提案セクションコンポーネントに対するTDD用包括的テスト仕様。要件 REQ-3（EARS 3.1-3.4）を検証し、Before/After形式とデータ可視化による価値提案を実装するテスト指針を提供する。

## 要件マッピング

| 要件ID | EARS基準 | テストケースID | 検証内容 |
|--------|----------|---------------|----------|
| REQ-3.1 | WHERE 価値提案セクションにおいて | TC-C-008 | Before/After形式表示 |
| REQ-3.2 | WHEN ユーザーが価値提案を閲覧した時 | TC-C-009 | 3つの価値提示 |
| REQ-3.3 | IF 統計やデータがある場合 | TC-C-010 | 数値・グラフ表示 |
| REQ-3.4 | WHILE ユーザーが価値提案セクションを見ている時 | TC-C-011 | 視覚的アイコン・図表 |

## Component仕様

### Propsインターフェース
```typescript
interface ValuePropositionSectionProps {
  className?: string;
  showStatistics?: boolean;
  animateOnScroll?: boolean;
}

interface ValueProposition {
  id: string;
  title: string;
  before: string;
  after: string;
  icon: string;
  statistic?: {
    value: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
  };
}
```

### 期待される構造
```typescript
export function ValuePropositionSection({ 
  className, 
  showStatistics = true,
  animateOnScroll = true 
}: ValuePropositionSectionProps) {
  return (
    <section data-testid="value-proposition-section" className={cn("...", className)}>
      <div data-testid="value-prop-header">
        <h2 data-testid="value-prop-title">読書体験の変化</h2>
        <p data-testid="value-prop-description">...</p>
      </div>
      
      <div data-testid="before-after-container">
        <div data-testid="before-section">
          <h3>従来の読書</h3>
          {/* Before content */}
        </div>
        <div data-testid="after-section">
          <h3>意図的読書</h3>
          {/* After content */}
        </div>
      </div>
      
      <div data-testid="value-propositions-grid">
        {VALUE_PROPOSITIONS.map(prop => (
          <ValuePropCard key={prop.id} proposition={prop} />
        ))}
      </div>
      
      {showStatistics && (
        <div data-testid="statistics-section">
          <StatisticsChart />
        </div>
      )}
    </section>
  );
}
```

## ユニットテスト仕様

### TC-C-008: Before/After形式表示
**目的**: 要件3.1の検証 - Before/After形式で読書体験の変化を表示

```typescript
describe('ValuePropositionSection - Before/After形式', () => {
  it('should render before and after sections', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    expect(screen.getByTestId('before-after-container')).toBeInTheDocument();
    expect(screen.getByTestId('before-section')).toBeInTheDocument();
    expect(screen.getByTestId('after-section')).toBeInTheDocument();
  });
  
  it('should display "before" reading experience content', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    const beforeSection = screen.getByTestId('before-section');
    expect(within(beforeSection).getByText(/従来の読書/)).toBeInTheDocument();
    expect(within(beforeSection).getByText(/漠然とした/)).toBeInTheDocument();
    expect(within(beforeSection).getByText(/記録が残らない/)).toBeInTheDocument();
  });
  
  it('should display "after" reading experience content', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    const afterSection = screen.getByTestId('after-section');
    expect(within(afterSection).getByText(/意図的読書/)).toBeInTheDocument();
    expect(within(afterSection).getByText(/明確な目的/)).toBeInTheDocument();
    expect(within(afterSection).getByText(/体系的な記録/)).toBeInTheDocument();
  });
  
  it('should provide visual contrast between before and after', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    const beforeSection = screen.getByTestId('before-section');
    const afterSection = screen.getByTestId('after-section');
    
    expect(beforeSection).toHaveClass('text-muted-foreground');
    expect(afterSection).toHaveClass('text-primary');
  });
});
```

### TC-C-009: 3つの価値提示
**目的**: 要件3.2の検証 - 読書の質向上、学習効果最大化、成長の記録の3つの価値

```typescript
describe('ValuePropositionSection - 3つの価値提示', () => {
  it('should display three value propositions', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    const valuePropsGrid = screen.getByTestId('value-propositions-grid');
    const valueCards = within(valuePropsGrid).getAllByTestId(/^value-prop-card-/);
    expect(valueCards).toHaveLength(3);
  });
  
  it('should display reading quality improvement value', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    expect(screen.getByTestId('value-prop-card-reading-quality')).toBeInTheDocument();
    expect(screen.getByText(/読書の質向上/)).toBeInTheDocument();
    expect(screen.getByText(/メンタルマップによる構造化/)).toBeInTheDocument();
  });
  
  it('should display learning effectiveness maximization value', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    expect(screen.getByTestId('value-prop-card-learning-effectiveness')).toBeInTheDocument();
    expect(screen.getByText(/学習効果最大化/)).toBeInTheDocument();
    expect(screen.getByText(/意図的な読書プロセス/)).toBeInTheDocument();
  });
  
  it('should display growth tracking value', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    expect(screen.getByTestId('value-prop-card-growth-tracking')).toBeInTheDocument();
    expect(screen.getByText(/成長の記録/)).toBeInTheDocument();
    expect(screen.getByText(/読書履歴の可視化/)).toBeInTheDocument();
  });
});
```

### TC-C-010: 数値・グラフ表示
**目的**: 要件3.3の検証 - 統計データ・数値・グラフによる信頼性向上

```typescript
describe('ValuePropositionSection - 数値・グラフ表示', () => {
  it('should display statistics section when enabled', () => {
    // Arrange & Act
    render(<ValuePropositionSection showStatistics={true} />);
    
    // Assert
    expect(screen.getByTestId('statistics-section')).toBeInTheDocument();
    expect(screen.getByTestId('statistics-chart')).toBeInTheDocument();
  });
  
  it('should hide statistics section when disabled', () => {
    // Arrange & Act
    render(<ValuePropositionSection showStatistics={false} />);
    
    // Assert
    expect(screen.queryByTestId('statistics-section')).not.toBeInTheDocument();
  });
  
  it('should display improvement percentages', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    expect(screen.getByText(/85%/)).toBeInTheDocument(); // 理解度向上
    expect(screen.getByText(/3倍/)).toBeInTheDocument(); // 記憶定着率
    expect(screen.getByText(/60%/)).toBeInTheDocument(); // 読書時間短縮
  });
  
  it('should display trend indicators', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    const trendIndicators = screen.getAllByTestId(/^trend-indicator-/);
    expect(trendIndicators).toHaveLength(3);
    
    trendIndicators.forEach(indicator => {
      expect(indicator).toHaveAttribute('data-trend', expect.stringMatching(/^(up|down|stable)$/));
    });
  });
  
  it('should render data visualization chart', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    const chart = screen.getByTestId('statistics-chart');
    expect(chart).toBeInTheDocument();
    expect(chart.querySelector('svg')).toBeInTheDocument();
  });
});
```

### TC-C-011: 視覚的アイコン・図表
**目的**: 要件3.4の検証 - アイコンや図表による理解促進

```typescript
describe('ValuePropositionSection - 視覚的要素', () => {
  it('should display icons for each value proposition', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    const valueCards = screen.getAllByTestId(/^value-prop-card-/);
    
    valueCards.forEach(card => {
      const icon = within(card).getByTestId('value-prop-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toBeVisible();
    });
  });
  
  it('should display appropriate icons for each value type', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    expect(screen.getByTestId('icon-reading-quality')).toHaveAttribute('data-icon', 'book-open');
    expect(screen.getByTestId('icon-learning-effectiveness')).toHaveAttribute('data-icon', 'brain');
    expect(screen.getByTestId('icon-growth-tracking')).toHaveAttribute('data-icon', 'trending-up');
  });
  
  it('should include infographic elements', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    expect(screen.getByTestId('before-after-arrow')).toBeInTheDocument();
    expect(screen.getByTestId('value-flow-diagram')).toBeInTheDocument();
  });
  
  it('should animate visual elements on scroll', () => {
    // Arrange
    const mockIntersectionObserver = jest.fn();
    window.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: mockIntersectionObserver,
      disconnect: jest.fn(),
    }));
    
    // Act
    render(<ValuePropositionSection animateOnScroll={true} />);
    
    // Assert
    expect(mockIntersectionObserver).toHaveBeenCalled();
    
    const animatedElements = screen.getAllByTestId(/^value-prop-card-/);
    animatedElements.forEach(element => {
      expect(element).toHaveAttribute('data-animate-on-scroll', 'true');
    });
  });
});
```

## ValuePropCardサブコンポーネントテスト

### VPC-001: 個別価値提案カード
```typescript
describe('ValuePropCard - 個別コンポーネント', () => {
  const mockProposition: ValueProposition = {
    id: 'test-value',
    title: 'テスト価値',
    before: 'テスト前の状態',
    after: 'テスト後の状態',
    icon: 'test-icon',
    statistic: {
      value: 75,
      unit: '%',
      trend: 'up',
    },
  };
  
  it('should render value proposition card with all elements', () => {
    // Arrange & Act
    render(<ValuePropCard proposition={mockProposition} />);
    
    // Assert
    expect(screen.getByText('テスト価値')).toBeInTheDocument();
    expect(screen.getByText('テスト前の状態')).toBeInTheDocument();
    expect(screen.getByText('テスト後の状態')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });
  
  it('should display statistic when provided', () => {
    // Arrange & Act
    render(<ValuePropCard proposition={mockProposition} />);
    
    // Assert
    const statistic = screen.getByTestId('value-statistic');
    expect(statistic).toBeInTheDocument();
    expect(statistic).toHaveTextContent('75%');
    expect(statistic).toHaveAttribute('data-trend', 'up');
  });
  
  it('should handle missing statistic gracefully', () => {
    // Arrange
    const propWithoutStats = { ...mockProposition, statistic: undefined };
    
    // Act
    render(<ValuePropCard proposition={propWithoutStats} />);
    
    // Assert
    expect(screen.queryByTestId('value-statistic')).not.toBeInTheDocument();
    expect(screen.getByText('テスト価値')).toBeInTheDocument();
  });
});
```

## アクセシビリティテスト仕様

### A11y-003: セマンティック構造
```typescript
describe('ValuePropositionSection - アクセシビリティ', () => {
  it('should have proper heading hierarchy', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    const sectionTitle = screen.getByRole('heading', { level: 2 });
    expect(sectionTitle).toHaveTextContent(/読書体験の変化/);
    
    const beforeAfterHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(beforeAfterHeadings).toHaveLength(5); // Before, After, 3つの価値提案
  });
  
  it('should provide chart accessibility', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    const chart = screen.getByTestId('statistics-chart');
    expect(chart).toHaveAttribute('aria-label', '読書効果の統計データ');
    expect(chart).toHaveAttribute('role', 'img');
  });
  
  it('should include alt text for visual elements', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    const valueIcons = screen.getAllByTestId(/^icon-/);
    valueIcons.forEach(icon => {
      expect(icon).toHaveAttribute('aria-label');
    });
  });
});
```

## レスポンシブテスト仕様

### RWD-003: Before/Afterレイアウト
```typescript
describe('ValuePropositionSection - レスポンシブ対応', () => {
  it('should stack before/after sections on mobile', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    // Act
    render(<ValuePropositionSection />);
    
    // Assert
    const container = screen.getByTestId('before-after-container');
    expect(container).toHaveClass('flex-col');
  });
  
  it('should display side-by-side on desktop', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    
    // Act
    render(<ValuePropositionSection />);
    
    // Assert
    const container = screen.getByTestId('before-after-container');
    expect(container).toHaveClass('lg:flex-row');
  });
  
  it('should adapt chart size for different screens', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    const chart = screen.getByTestId('statistics-chart');
    expect(chart).toHaveClass('w-full', 'max-w-sm', 'lg:max-w-lg');
  });
});
```

## パフォーマンステスト仕様

### PERF-003: データ可視化最適化
```typescript
describe('ValuePropositionSection - パフォーマンス', () => {
  it('should lazy load chart component', async () => {
    // Arrange
    const LazyChart = lazy(() => import('../StatisticsChart'));
    
    // Act
    render(
      <Suspense fallback={<div data-testid="chart-loading">Loading...</div>}>
        <ValuePropositionSection />
      </Suspense>
    );
    
    // Assert
    expect(screen.getByTestId('chart-loading')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByTestId('statistics-chart')).toBeInTheDocument();
    });
  });
  
  it('should optimize animation performance', () => {
    // Arrange & Act
    render(<ValuePropositionSection />);
    
    // Assert
    const animatedElements = screen.getAllByTestId(/^value-prop-card-/);
    animatedElements.forEach(element => {
      expect(element).toHaveStyle('will-change: transform');
    });
  });
});
```

## モックとフィクスチャ

### テストデータ
```typescript
export const valuePropositionMocks = {
  defaultPropositions: [
    {
      id: 'reading-quality',
      title: '読書の質向上',
      before: '漠然とした読書で内容が頭に残らない',
      after: 'メンタルマップによる構造化で深い理解',
      icon: 'book-open',
      statistic: { value: 85, unit: '%', trend: 'up' as const },
    },
    {
      id: 'learning-effectiveness',
      title: '学習効果最大化',
      before: 'ただ読むだけで活用できない知識',
      after: '意図的な読書プロセスで実践的な知識習得',
      icon: 'brain',
      statistic: { value: 3, unit: '倍', trend: 'up' as const },
    },
    {
      id: 'growth-tracking',
      title: '成長の記録',
      before: '読書の成果が見えずモチベーション低下',
      after: '読書履歴の可視化で継続的な成長実感',
      icon: 'trending-up',
      statistic: { value: 60, unit: '%', trend: 'up' as const },
    },
  ],
} as const;
```

## TDD実装ワークフロー

### Red Phase (失敗テスト)
1. `TC-C-008` - Before/After表示テスト記述
2. `TC-C-009` - 3価値提示テスト記述
3. `TC-C-010` - 統計データテスト記述
4. `TC-C-011` - 視覚要素テスト記述

### Green Phase (最小実装)
1. Before/Afterセクション実装
2. 価値提案カード実装
3. 統計チャート実装
4. アイコン・図表実装

### Refactor Phase (品質向上)
1. チャートライブラリ最適化
2. アニメーション性能改善
3. データ表示精度向上

## カバレッジ要件

- **機能カバレッジ**: 100% (要件3.1-3.4対応)
- **行カバレッジ**: ≥85%
- **分岐カバレッジ**: ≥80%
- **視覚要素**: 全アイコン・チャート検証
- **データ表示**: 統計値精度検証

---

*この仕様は要件 REQ-3 の完全な検証を保証し、データドリブンな価値提案の効果的な表現を実現します。*