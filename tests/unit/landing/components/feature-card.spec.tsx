import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FeatureCard } from '~/features/landing/components/feature-card'
import type { Feature } from '~/features/landing/types'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}))

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  BookOpen: () => <div data-testid="book-open-icon">BookOpen</div>,
  Target: () => <div data-testid="target-icon">Target</div>,
  TrendingUp: () => <div data-testid="trending-up-icon">TrendingUp</div>,
}))

const mockFeature: Feature = {
  id: '1',
  title: '読書記録管理',
  description: '読んだ本の記録を簡単に管理できます。進捗状況や読書時間も追跡可能です。',
  icon: 'BookOpen',
  highlighted: false,
  category: 'reading',
}

describe('FeatureCard', () => {
  it('機能カードが正しくレンダリングされる', () => {
    render(<FeatureCard feature={mockFeature} />)

    expect(screen.getByText('読書記録管理')).toBeInTheDocument()
    expect(screen.getByText(/読んだ本の記録を簡単に管理できます/)).toBeInTheDocument()
    expect(screen.getByTestId('book-open-icon')).toBeInTheDocument()
  })

  it('ハイライトされた機能カードが強調表示される', () => {
    const highlightedFeature = { ...mockFeature, highlighted: true }
    render(<FeatureCard feature={highlightedFeature} />)

    expect(screen.getByTestId('feature-card-1')).toBeInTheDocument()
    expect(screen.getByText('読書記録管理')).toBeInTheDocument()
  })

  it('異なるアイコンが正しく表示される', () => {
    const featureWithTargetIcon = { ...mockFeature, icon: 'Target' as const }
    render(<FeatureCard feature={featureWithTargetIcon} />)

    expect(screen.getByTestId('target-icon')).toBeInTheDocument()
  })

  it('TrendingUpアイコンが正しく表示される', () => {
    const featureWithTrendingUpIcon = { ...mockFeature, icon: 'TrendingUp' as const }
    render(<FeatureCard feature={featureWithTrendingUpIcon} />)

    expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument()
  })

  it('カスタムclassNameが適用される', () => {
    render(<FeatureCard feature={mockFeature} className="custom-feature" />)

    const card = screen.getByTestId('feature-card-1')
    expect(card).toHaveClass('custom-feature')
  })

  it('アニメーションなしでも正常に動作する', () => {
    render(<FeatureCard feature={mockFeature} animated={false} />)

    expect(screen.getByText('読書記録管理')).toBeInTheDocument()
    expect(screen.getByTestId('book-open-icon')).toBeInTheDocument()
  })

  it('長いタイトルが正しく表示される', () => {
    const longTitleFeature = {
      ...mockFeature,
      title: 'とても長い機能のタイトルがここに入ります',
    }
    render(<FeatureCard feature={longTitleFeature} />)

    expect(screen.getByText('とても長い機能のタイトルがここに入ります')).toBeInTheDocument()
  })

  it('長い説明文が正しく表示される', () => {
    const longDescriptionFeature = {
      ...mockFeature,
      description:
        'これは非常に長い説明文です。この機能について詳しく説明しており、ユーザーがその価値を理解できるように設計されています。',
    }
    render(<FeatureCard feature={longDescriptionFeature} />)

    expect(screen.getByText(/これは非常に長い説明文です/)).toBeInTheDocument()
  })

  it('複数の機能カードが独立して動作する', () => {
    const feature1 = { ...mockFeature, id: '1', title: '機能1' }
    const feature2 = { ...mockFeature, id: '2', title: '機能2', icon: 'Target' as const }

    render(
      <div>
        <FeatureCard feature={feature1} />
        <FeatureCard feature={feature2} />
      </div>,
    )

    expect(screen.getByText('機能1')).toBeInTheDocument()
    expect(screen.getByText('機能2')).toBeInTheDocument()
    expect(screen.getByTestId('book-open-icon')).toBeInTheDocument()
    expect(screen.getByTestId('target-icon')).toBeInTheDocument()
  })

  it('data-testidが正しく設定される', () => {
    render(<FeatureCard feature={mockFeature} />)

    expect(screen.getByTestId('feature-card-1')).toBeInTheDocument()
  })

  it('アクセシビリティのためのセマンティックHTMLが使用される', () => {
    render(<FeatureCard feature={mockFeature} />)

    // h3要素が使用されていることを確認
    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toHaveTextContent('読書記録管理')
  })

  it('レスポンシブデザインクラスが適用される', () => {
    render(<FeatureCard feature={mockFeature} />)

    const card = screen.getByTestId('feature-card-1')
    expect(card).toBeInTheDocument()
  })
})
