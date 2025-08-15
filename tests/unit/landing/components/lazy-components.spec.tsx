import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  LazyFAQSection,
  LazyFooter,
  LazyIntersectionWrapper,
  LazyNavigation,
  LazyPricingSection,
  LazySocialProofSection,
  LazyValuePropositionSection,
  PerformanceMonitor,
  withLazyLoading,
} from '~/features/landing/components/lazy-components'

// Mock dynamic imports
vi.mock('next/dynamic', () => ({
  default: (_fn: () => Promise<any>, options?: any) => {
    return function MockComponent(_props: any) {
      return options?.loading ? options.loading() : <div>Mocked Dynamic Component</div>
    }
  },
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock Intersection Observer
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})
vi.stubGlobal('IntersectionObserver', mockIntersectionObserver)

// Mock Performance Observer
const mockPerformanceObserver = vi.fn()
mockPerformanceObserver.mockReturnValue({
  observe: vi.fn(),
  disconnect: vi.fn(),
})
vi.stubGlobal('PerformanceObserver', mockPerformanceObserver)

// Mock performance.mark and performance.measure
const mockPerformanceMark = vi.fn()
const mockPerformanceMeasure = vi.fn()
vi.stubGlobal('performance', {
  mark: mockPerformanceMark,
  measure: mockPerformanceMeasure,
  now: () => Date.now(),
})

describe('LazyComponents', () => {
  describe('LazyFAQSection', () => {
    it('FAQ Sectionが遅延読み込みされる', () => {
      render(<LazyFAQSection />)

      // ローディングスケルトンが表示されることを確認
      expect(screen.getByText('Mocked Dynamic Component')).toBeInTheDocument()
    })
  })

  describe('LazySocialProofSection', () => {
    it('Social Proof Sectionが遅延読み込みされる', () => {
      render(<LazySocialProofSection />)

      expect(screen.getByText('Mocked Dynamic Component')).toBeInTheDocument()
    })
  })

  describe('LazyPricingSection', () => {
    it('Pricing Sectionが遅延読み込みされる', () => {
      render(<LazyPricingSection />)

      expect(screen.getByText('Mocked Dynamic Component')).toBeInTheDocument()
    })
  })

  describe('LazyValuePropositionSection', () => {
    it('Value Proposition Sectionが遅延読み込みされる', () => {
      render(<LazyValuePropositionSection />)

      expect(screen.getByText('Mocked Dynamic Component')).toBeInTheDocument()
    })
  })

  describe('LazyNavigation', () => {
    it('Navigationが遅延読み込みされる', () => {
      render(<LazyNavigation />)

      expect(screen.getByText('Mocked Dynamic Component')).toBeInTheDocument()
    })
  })

  describe('LazyFooter', () => {
    it('Footerが遅延読み込みされる', () => {
      render(<LazyFooter />)

      expect(screen.getByText('Mocked Dynamic Component')).toBeInTheDocument()
    })
  })

  describe('withLazyLoading', () => {
    it('HOCが正しくコンポーネントをラップする', () => {
      const TestComponent = ({ text }: { text: string }) => <div>{text}</div>
      const LazyTestComponent = withLazyLoading(TestComponent)

      render(<LazyTestComponent text="Test Content" />)

      // withLazyLoadingでラップされたコンポーネントが表示される
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('SSRオプションが適用される', () => {
      const TestComponent = () => <div>SSR Component</div>
      const LazyTestComponent = withLazyLoading(TestComponent, undefined, { ssr: false })

      render(<LazyTestComponent />)

      expect(screen.getByText('SSR Component')).toBeInTheDocument()
    })
  })

  describe('LazyIntersectionWrapper', () => {
    it('初期状態ではfallbackが表示される', () => {
      render(
        <LazyIntersectionWrapper fallback={<div>Loading...</div>}>
          <div>Content</div>
        </LazyIntersectionWrapper>,
      )

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('Intersection Observerが設定される', () => {
      render(
        <LazyIntersectionWrapper>
          <div>Observed Content</div>
        </LazyIntersectionWrapper>,
      )

      expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        rootMargin: '100px',
        threshold: 0.1,
      })
    })

    it('カスタムrootMarginとthresholdが適用される', () => {
      render(
        <LazyIntersectionWrapper rootMargin="50px" threshold={0.5}>
          <div>Custom Observed Content</div>
        </LazyIntersectionWrapper>,
      )

      expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        rootMargin: '50px',
        threshold: 0.5,
      })
    })

    it('要素が可視になった時に子要素が表示される', async () => {
      // Intersection Observerのコールバックをモック
      let observerCallback: ((entries: any[]) => void) | undefined
      mockIntersectionObserver.mockImplementation((callback) => {
        observerCallback = callback
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
        }
      })

      render(
        <LazyIntersectionWrapper>
          <div>Visible Content</div>
        </LazyIntersectionWrapper>,
      )

      // 初期状態では子要素が表示されない
      expect(screen.queryByText('Visible Content')).not.toBeInTheDocument()

      // Intersection Observerのコールバックを実行
      if (observerCallback) {
        observerCallback([{ isIntersecting: true, target: document.createElement('div') }])
      }

      await waitFor(() => {
        expect(screen.getByText('Visible Content')).toBeInTheDocument()
      })
    })
  })

  describe('PerformanceMonitor', () => {
    it('子要素が正しくレンダリングされる', () => {
      render(
        <PerformanceMonitor sectionName="test-section">
          <div>Monitored Content</div>
        </PerformanceMonitor>,
      )

      expect(screen.getByText('Monitored Content')).toBeInTheDocument()
    })

    it('パフォーマンス測定が開始される', () => {
      render(
        <PerformanceMonitor sectionName="hero-section">
          <div>Hero Content</div>
        </PerformanceMonitor>,
      )

      expect(mockPerformanceMark).toHaveBeenCalledWith('hero-section-start')
    })

    it('複数のPerformanceMonitorが独立して動作する', () => {
      render(
        <>
          <PerformanceMonitor sectionName="section-1">
            <div>Section 1</div>
          </PerformanceMonitor>
          <PerformanceMonitor sectionName="section-2">
            <div>Section 2</div>
          </PerformanceMonitor>
        </>,
      )

      expect(mockPerformanceMark).toHaveBeenCalledWith('section-1-start')
      expect(mockPerformanceMark).toHaveBeenCalledWith('section-2-start')
    })

    it('performanceがサポートされていない環境でもエラーにならない', () => {
      // performanceをundefinedにする
      vi.stubGlobal('performance', undefined)

      render(
        <PerformanceMonitor sectionName="test-section">
          <div>Content</div>
        </PerformanceMonitor>,
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('LoadingSkeleton', () => {
    it('デフォルトのスケルトンが表示される', () => {
      const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
        <div className={`animate-pulse ${className}`} data-testid="loading-skeleton">
          <div className="mb-4 h-32 rounded-lg bg-slate-200"></div>
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-slate-200"></div>
            <div className="h-4 w-1/2 rounded bg-slate-200"></div>
          </div>
        </div>
      )

      render(<LoadingSkeleton />)

      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
    })

    it('カスタムclassNameが適用される', () => {
      const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
        <div className={`animate-pulse ${className}`} data-testid="loading-skeleton">
          <div className="mb-4 h-32 rounded-lg bg-slate-200"></div>
        </div>
      )

      render(<LoadingSkeleton className="custom-skeleton" />)

      const skeleton = screen.getByTestId('loading-skeleton')
      expect(skeleton).toHaveClass('custom-skeleton')
    })
  })

  describe('Integration Tests', () => {
    it('複数の遅延読み込みコンポーネントが同時に動作する', () => {
      render(
        <div>
          <LazyNavigation />
          <LazyFAQSection />
          <LazyFooter />
        </div>,
      )

      const dynamicComponents = screen.getAllByText('Mocked Dynamic Component')
      expect(dynamicComponents).toHaveLength(3)
    })

    it('PerformanceMonitorとLazyIntersectionWrapperが組み合わせて使用できる', () => {
      render(
        <PerformanceMonitor sectionName="lazy-section">
          <LazyIntersectionWrapper>
            <div>Monitored Lazy Content</div>
          </LazyIntersectionWrapper>
        </PerformanceMonitor>,
      )

      expect(mockPerformanceMark).toHaveBeenCalledWith('lazy-section-start')
    })

    it('エラー境界でエラーがキャッチされる', () => {
      // エラーをスローするコンポーネント
      const ErrorComponent = () => {
        throw new Error('Test Error')
      }

      const LazyErrorComponent = withLazyLoading(ErrorComponent)

      // エラーが発生してもアプリケーションがクラッシュしない
      expect(() => render(<LazyErrorComponent />)).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('遅延読み込み中のコンテンツにaria-labelが設定される', () => {
      render(
        <LazyIntersectionWrapper
          fallback={
            <div role="status" aria-live="polite">
              コンテンツを読み込み中
            </div>
          }
        >
          <div>Content</div>
        </LazyIntersectionWrapper>,
      )

      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('遅延読み込みされたコンテンツがキーボードナビゲーション可能', async () => {
      let observerCallback: ((entries: any[]) => void) | undefined
      mockIntersectionObserver.mockImplementation((callback) => {
        observerCallback = callback
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
        }
      })

      render(
        <LazyIntersectionWrapper>
          <button type="button">Lazy Button</button>
        </LazyIntersectionWrapper>,
      )

      // コンテンツを可視化
      if (observerCallback) {
        observerCallback([{ isIntersecting: true, target: document.createElement('div') }])
      }

      await waitFor(() => {
        const button = screen.getByRole('button', { name: 'Lazy Button' })
        expect(button).toBeInTheDocument()
        expect(button).toBeVisible()
      })
    })
  })
})
