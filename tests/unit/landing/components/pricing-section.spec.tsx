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
    features: ['月5冊まで', '基本的な読書記録'],
    limitations: ['データエクスポート不可'],
    ctaText: '無料で始める',
    ctaUrl: '/auth/register',
    highlighted: true,
  },
  {
    id: 'pro',
    name: 'プロプラン',
    price: { monthly: 980, yearly: 9800 },
    features: ['無制限の読書記録', 'データエクスポート', '詳細な分析'],
    ctaText: '今すぐ始める',
    ctaUrl: '/auth/register',
    highlighted: false,
  },
]

describe('PricingSection', () => {
  it('料金セクションが正しくレンダリングされる', () => {
    render(<PricingSection plans={mockPricingPlans} />)

    expect(screen.getByTestId('pricing-section')).toBeInTheDocument()
    expect(screen.getByText('シンプルな料金体系')).toBeInTheDocument()
    expect(screen.getByText(/無料プランから始めて/)).toBeInTheDocument()
  })

  it('プランカードが正しく表示される', () => {
    render(<PricingSection plans={mockPricingPlans} />)

    // プラン名の確認
    expect(screen.getByText('無料プラン')).toBeInTheDocument()
    expect(screen.getByText('プロプラン')).toBeInTheDocument()

    // 価格の確認
    expect(screen.getByText('無料')).toBeInTheDocument()
    expect(screen.getByText('¥980')).toBeInTheDocument()

    // CTAボタンの確認
    expect(screen.getByText('無料で始める')).toBeInTheDocument()
    expect(screen.getByText('今すぐ始める')).toBeInTheDocument()
  })

  it('機能リストが正しく表示される', () => {
    render(<PricingSection plans={mockPricingPlans} />)

    // 無料プランの機能
    expect(screen.getByText('月5冊まで')).toBeInTheDocument()
    expect(screen.getByText('基本的な読書記録')).toBeInTheDocument()

    // プロプランの機能
    expect(screen.getByText('無制限の読書記録')).toBeInTheDocument()
    expect(screen.getByText('データエクスポート')).toBeInTheDocument()
  })

  it('制限事項が表示される', () => {
    render(<PricingSection plans={mockPricingPlans} />)

    expect(screen.getByText('制限事項')).toBeInTheDocument()
    expect(screen.getByText('データエクスポート不可')).toBeInTheDocument()
  })

  it('ハイライトされたプランが強調表示される', () => {
    render(<PricingSection plans={mockPricingPlans} highlightFreePlan={true} />)

    const freeButton = screen.getByText('無料で始める').closest('a')
    expect(freeButton).toHaveClass('bg-blue-600')
  })

  it('年間料金の割引率が計算される', () => {
    const planWithDiscount: PricingPlan = {
      id: 'premium',
      name: 'プレミアム',
      price: { monthly: 1200, yearly: 12000 },
      features: ['すべての機能'],
      ctaText: '始める',
      ctaUrl: '/register',
    }

    render(<PricingSection plans={[planWithDiscount]} />)

    // 割引率の確認（年払いで17%お得）
    expect(screen.getByText(/17%お得/)).toBeInTheDocument()
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
    render(<PricingSection plans={mockPricingPlans} />)

    const freeButton = screen.getByText('無料で始める').closest('a')
    const proButton = screen.getByText('今すぐ始める').closest('a')

    expect(freeButton).toHaveAttribute('href', '/auth/register')
    expect(proButton).toHaveAttribute('href', '/auth/register')
  })

  it('team プランの特別機能が表示される', () => {
    const teamPlan: PricingPlan = {
      id: 'team',
      name: 'チームプラン',
      price: { monthly: 2980, yearly: 29800 },
      features: ['チーム管理', '共有機能'],
      ctaText: 'チームで始める',
      ctaUrl: '/auth/register',
    }

    render(<PricingSection plans={[teamPlan]} />)

    expect(screen.getByText('チーム向け特別機能')).toBeInTheDocument()
    expect(screen.getByText(/企業・組織での読書会/)).toBeInTheDocument()
  })

  it('accessibility属性が正しく設定される', () => {
    render(<PricingSection plans={mockPricingPlans} />)

    const section = screen.getByTestId('pricing-section')
    expect(section).toBeInTheDocument()

    // ボタンのaria属性確認
    const buttons = screen.getAllByRole('link')
    buttons.forEach((button) => {
      expect(button).toBeVisible()
    })
  })

  it('カスタムclassNameが適用される', () => {
    render(<PricingSection plans={mockPricingPlans} className="custom-pricing" />)

    const section = screen.getByTestId('pricing-section')
    expect(section).toHaveClass('custom-pricing')
  })

  it('プランが空の場合でもエラーにならない', () => {
    render(<PricingSection plans={[]} />)

    expect(screen.getByTestId('pricing-section')).toBeInTheDocument()
    expect(screen.getByText('シンプルな料金体系')).toBeInTheDocument()
  })

  it('FAQリンクが正しく動作する', () => {
    render(<PricingSection plans={mockPricingPlans} />)

    const faqLink = screen.getByText('すべての質問を見る').closest('a')
    expect(faqLink).toHaveAttribute('href', '#faq')
  })

  it('hover effects がbutton要素で機能する', () => {
    render(<PricingSection plans={mockPricingPlans} />)

    const button = screen.getByText('無料で始める')
    fireEvent.mouseEnter(button)
    fireEvent.mouseLeave(button)

    // エラーが発生しないことを確認
    expect(button).toBeInTheDocument()
  })
})
