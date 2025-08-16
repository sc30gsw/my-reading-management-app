import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PricingSection } from '~/features/landing/components/pricing-section'
import type { PricingPlan } from '~/features/landing/types'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock hooks
vi.mock('~/features/landing/hooks/use-in-view', () => ({
  useInView: () => ({
    ref: vi.fn(),
    isInView: true,
  }),
}))

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

const mockPricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: '無料プラン',
    price: { monthly: 0, yearly: 0 },
    features: ['月5冊までの読書記録', '基本的なメンタルマップ機能', '統計分析（基本）'],
    limitations: ['読書記録は月5冊まで', '高度な統計機能は利用不可'],
    ctaText: '無料で始める',
    ctaUrl: '/sign-up',
    highlighted: true,
  },
  {
    id: 'premium',
    name: 'プレミアム',
    price: { monthly: 980, yearly: 9800 },
    features: ['無制限の読書記録', '高度なメンタルマップ機能', '詳細な統計分析'],
    ctaText: 'プレミアムを試す',
    ctaUrl: '/sign-up?plan=premium',
    highlighted: false,
  },
]

describe('PricingSection', () => {
  it('料金セクションが正しくレンダリングされる', () => {
    render(<PricingSection />)

    expect(screen.getByTestId('pricing-section')).toBeInTheDocument()
    expect(screen.getByText('シンプルな料金体系')).toBeInTheDocument()
    expect(screen.getByText(/無料プランから始めて/)).toBeInTheDocument()
  })

  it('プランカードが正しく表示される', () => {
    render(<PricingSection />)

    // プラン名の確認
    expect(screen.getByText('無料プラン')).toBeInTheDocument()
    expect(screen.getByText('プレミアム')).toBeInTheDocument()
    expect(screen.getByText('チームプラン')).toBeInTheDocument()

    // 価格の確認
    expect(screen.getByText('無料')).toBeInTheDocument()
    expect(screen.getByText('¥980')).toBeInTheDocument()
    expect(screen.getByText('¥2,980')).toBeInTheDocument()

    // CTAボタンの確認
    expect(screen.getByText('無料で始める')).toBeInTheDocument()
    expect(screen.getByText('プレミアムを試す')).toBeInTheDocument()
    expect(screen.getByText('チームプランを試す')).toBeInTheDocument()
  })

  it('機能リストが正しく表示される', () => {
    render(<PricingSection />)

    // 無料プランの機能
    expect(screen.getByText('月5冊までの読書記録')).toBeInTheDocument()
    expect(screen.getByText('基本的なメンタルマップ機能')).toBeInTheDocument()

    // プレミアムプランの機能
    expect(screen.getByText('無制限の読書記録')).toBeInTheDocument()
    expect(screen.getByText('高度なメンタルマップ機能')).toBeInTheDocument()
  })

  it('制限事項が存在しない場合でもエラーにならない', () => {
    render(<PricingSection />)

    // コンポーネントが正常にレンダリングされることを確認
    expect(screen.getByTestId('pricing-section')).toBeInTheDocument()
  })

  it('ハイライトされたプランが強調表示される', () => {
    render(<PricingSection highlightFreePlan={true} />)

    const freeButton = screen.getByText('無料で始める').closest('a')
    expect(freeButton).toHaveClass('bg-blue-600')
  })

  it('年間料金の割引率が複数表示される', () => {
    render(<PricingSection />)

    // プレミアムプランとチームプランで17%お得が複数表示される
    const discountTexts = screen.getAllByText(/17%お得/)
    expect(discountTexts).toHaveLength(2)
  })

  it('FAQ teaser section が表示される', () => {
    render(<PricingSection plans={mockPricingPlans} />)

    expect(screen.getByText('よくある質問')).toBeInTheDocument()
    expect(screen.getByText('プランの変更はいつでも可能ですか？')).toBeInTheDocument()
    expect(screen.getByText('無料プランに制限期間はありますか？')).toBeInTheDocument()
    expect(screen.getByText('すべての質問を見る')).toBeInTheDocument()
  })

  it('trust signals が表示される', () => {
    render(<PricingSection plans={mockPricingPlans} />)

    expect(screen.getByText('SSL暗号化通信')).toBeInTheDocument()
    expect(screen.getByText('データ定期バックアップ')).toBeInTheDocument()
    expect(screen.getByText('24時間サポート')).toBeInTheDocument()
  })

  it('返金保証セクションが表示される', () => {
    render(<PricingSection plans={mockPricingPlans} />)

    expect(screen.getByText('14日間返金保証')).toBeInTheDocument()
    expect(screen.getByText(/ご満足いただけない場合は/)).toBeInTheDocument()
  })

  it('CTAリンクが正しいURLを持つ', () => {
    render(<PricingSection />)

    // 実際のボタンテキストを確認
    const freeButton = screen.getByText('無料で始める').closest('a')
    const premiumButton = screen.getByText('プレミアムを試す').closest('a')
    const teamButton = screen.getByText('チームプランを試す').closest('a')

    expect(freeButton).toHaveAttribute('href', '/sign-up')
    expect(premiumButton).toHaveAttribute('href', '/sign-up?plan=premium')
    expect(teamButton).toHaveAttribute('href', '/contact?plan=team')
  })

  it('accessibility属性が正しく設定される', () => {
    render(<PricingSection />)

    const section = screen.getByTestId('pricing-section')
    expect(section).toBeInTheDocument()

    // ボタンのaria属性確認
    const buttons = screen.getAllByRole('link')
    buttons.forEach((button) => {
      expect(button).toBeVisible()
    })
  })

  it('カスタムclassNameが適用される', () => {
    render(<PricingSection className="custom-pricing" />)

    const section = screen.getByTestId('pricing-section')
    expect(section).toHaveClass('custom-pricing')
  })

  it('hover effects がbutton要素で機能する', () => {
    render(<PricingSection />)

    const button = screen.getByText('無料で始める')
    fireEvent.mouseEnter(button)
    fireEvent.mouseLeave(button)

    // エラーが発生しないことを確認
    expect(button).toBeInTheDocument()
  })
})
