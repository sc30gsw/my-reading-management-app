import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FAQSection } from '~/features/landing/components/faq-section'
import type { FAQItem } from '~/features/landing/types'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      layout,
      initial,
      animate,
      whileInView,
      transition,
      variants,
      ...props
    }: any) => <div {...props}>{children}</div>,
    section: ({
      children,
      layout,
      initial,
      animate,
      whileInView,
      transition,
      variants,
      ...props
    }: any) => <section {...props}>{children}</section>,
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

const mockFAQItems: FAQItem[] = [
  {
    id: '1',
    question: 'サービスの利用は無料ですか？',
    answer: 'はい、基本機能は無料でご利用いただけます。',
    category: 'general',
  },
  {
    id: '2',
    question: '料金はいくらですか？',
    answer: 'プロプランは月額980円です。',
    category: 'pricing',
  },
  {
    id: '3',
    question: 'どのような機能がありますか？',
    answer: '読書記録、進捗管理、レビュー機能があります。',
    category: 'features',
  },
]

describe('FAQSection', () => {
  const user = userEvent.setup()

  it('FAQセクションが正しくレンダリングされる', () => {
    render(<FAQSection faqItems={mockFAQItems} />)

    expect(screen.getByTestId('faq-section')).toBeInTheDocument()
    expect(screen.getByText('よくある質問')).toBeInTheDocument()
    expect(screen.getByText(/お客様からよく寄せられる質問/)).toBeInTheDocument()
  })

  it('FAQ項目が正しく表示される', () => {
    render(<FAQSection faqItems={mockFAQItems} />)

    expect(screen.getByText('サービスの利用は無料ですか？')).toBeInTheDocument()
    expect(screen.getByText('料金はいくらですか？')).toBeInTheDocument()
    expect(screen.getByText('どのような機能がありますか？')).toBeInTheDocument()
  })

  it('FAQ項目をクリックすると回答が表示される', async () => {
    render(<FAQSection faqItems={mockFAQItems} />)

    const question = screen.getByRole('button', { name: /サービスの利用は無料ですか？/ })
    await user.click(question)

    await waitFor(() => {
      expect(screen.getByText('はい、基本機能は無料でご利用いただけます。')).toBeInTheDocument()
    })
  })

  it('検索機能が正常に動作する', async () => {
    render(<FAQSection faqItems={mockFAQItems} showSearch={true} />)

    const searchInput = screen.getByTestId('faq-search-input')
    await user.type(searchInput, '料金')

    await waitFor(() => {
      expect(screen.getByText('料金はいくらですか？')).toBeInTheDocument()
      expect(screen.queryByText('サービスの利用は無料ですか？')).not.toBeInTheDocument()
    })
  })

  it('カテゴリフィルターが正常に動作する', async () => {
    render(<FAQSection faqItems={mockFAQItems} showCategories={true} />)

    const pricingFilter = screen.getByTestId('category-filter-pricing')
    await user.click(pricingFilter)

    await waitFor(() => {
      expect(screen.getByText('料金はいくらですか？')).toBeInTheDocument()
      expect(screen.queryByText('サービスの利用は無料ですか？')).not.toBeInTheDocument()
    })
  })

  it('カテゴリバッジが正しく表示される', async () => {
    render(<FAQSection faqItems={mockFAQItems} />)

    const question = screen.getByRole('button', { name: /サービスの利用は無料ですか？/ })
    await user.click(question)

    await waitFor(() => {
      // より具体的なセレクターでカテゴリバッジを取得
      const categoryBadges = screen.getAllByText('一般')
      expect(categoryBadges.length).toBeGreaterThan(0)

      // バッジクラスを持つ要素を確認
      const badge = categoryBadges.find(
        (el) => el.classList.contains('bg-blue-100') && el.classList.contains('text-blue-800'),
      )
      expect(badge).toBeInTheDocument()
    })
  })

  it('検索結果がない場合のメッセージが表示される', async () => {
    render(<FAQSection faqItems={mockFAQItems} showSearch={true} />)

    const searchInput = screen.getByTestId('faq-search-input')
    await user.type(searchInput, '存在しない質問')

    await waitFor(() => {
      expect(screen.getByText('検索条件に一致する質問が見つかりませんでした。')).toBeInTheDocument()
    })
  })

  it('検索条件リセットボタンが動作する', async () => {
    render(<FAQSection faqItems={mockFAQItems} showSearch={true} showCategories={true} />)

    // まず検索を実行
    const searchInput = screen.getByTestId('faq-search-input')
    await user.type(searchInput, '存在しない質問')

    await waitFor(() => {
      expect(screen.getByText('検索条件に一致する質問が見つかりませんでした。')).toBeInTheDocument()
    })

    // リセットボタンをクリック
    const resetButton = screen.getByText('検索条件をリセット')
    await user.click(resetButton)

    await waitFor(() => {
      expect(screen.getByText('サービスの利用は無料ですか？')).toBeInTheDocument()
      expect(searchInput).toHaveValue('')
    })
  })

  it('デフォルトで開いているアイテムが設定される', () => {
    render(<FAQSection faqItems={mockFAQItems} defaultOpenItems={['1']} />)

    expect(screen.getByText('はい、基本機能は無料でご利用いただけます。')).toBeInTheDocument()
  })

  it('問い合わせCTAセクションが表示される', () => {
    render(<FAQSection faqItems={mockFAQItems} />)

    expect(screen.getByText('まだ疑問が解決されませんか？')).toBeInTheDocument()
    expect(screen.getByText('お問い合わせ')).toBeInTheDocument()
    expect(screen.getByText('サポートセンター')).toBeInTheDocument()
  })

  it('統計情報が表示される', () => {
    render(<FAQSection faqItems={mockFAQItems} />)

    expect(screen.getByText('平均2分')).toBeInTheDocument()
    expect(screen.getByText('回答時間')).toBeInTheDocument()
    expect(screen.getByText('98%')).toBeInTheDocument()
    expect(screen.getByText('解決率')).toBeInTheDocument()
    expect(screen.getByText('24時間')).toBeInTheDocument()
    expect(screen.getByText('サポート対応')).toBeInTheDocument()
  })

  it('アクセシビリティ属性が正しく設定される', async () => {
    render(<FAQSection faqItems={mockFAQItems} />)

    const firstQuestion = screen.getByRole('button', { name: /サービスの利用は無料ですか？/ })
    expect(firstQuestion).toHaveAttribute('aria-expanded', 'false')
    expect(firstQuestion).toHaveAttribute('aria-controls', 'faq-answer-1')

    await user.click(firstQuestion)

    await waitFor(() => {
      expect(firstQuestion).toHaveAttribute('aria-expanded', 'true')
    })
  })

  it('showSearchがfalseの場合検索バーが非表示', () => {
    render(<FAQSection faqItems={mockFAQItems} showSearch={false} />)

    expect(screen.queryByTestId('faq-search-input')).not.toBeInTheDocument()
  })

  it('showCategoriesがfalseの場合カテゴリフィルターが非表示', () => {
    render(<FAQSection faqItems={mockFAQItems} showCategories={false} />)

    expect(screen.queryByTestId('category-filter-all')).not.toBeInTheDocument()
  })

  it('animatedがfalseの場合でも正常に動作する', () => {
    render(<FAQSection faqItems={mockFAQItems} animated={false} />)

    expect(screen.getByTestId('faq-section')).toBeInTheDocument()
    expect(screen.getByText('よくある質問')).toBeInTheDocument()
  })

  it('カスタムclassNameが適用される', () => {
    render(<FAQSection faqItems={mockFAQItems} className="custom-faq" />)

    const section = screen.getByTestId('faq-section')
    expect(section).toHaveClass('custom-faq')
  })

  it('キーボードナビゲーションが機能する', async () => {
    render(<FAQSection faqItems={mockFAQItems} />)

    const firstQuestion = screen.getByRole('button', { name: /サービスの利用は無料ですか？/ })
    firstQuestion.focus()

    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByText('はい、基本機能は無料でご利用いただけます。')).toBeInTheDocument()
    })
  })

  it('複数のFAQ項目を同時に開くことができる', async () => {
    render(<FAQSection faqItems={mockFAQItems} />)

    const firstQuestion = screen.getByRole('button', { name: /サービスの利用は無料ですか？/ })
    const secondQuestion = screen.getByRole('button', { name: /料金はいくらですか？/ })

    await user.click(firstQuestion)
    await user.click(secondQuestion)

    await waitFor(() => {
      expect(screen.getByText('はい、基本機能は無料でご利用いただけます。')).toBeInTheDocument()
      expect(screen.getByText('プロプランは月額980円です。')).toBeInTheDocument()
    })
  })

  it('カテゴリ変更時に開いているアイテムが閉じる', async () => {
    render(<FAQSection faqItems={mockFAQItems} showCategories={true} />)

    // まず質問を開く
    const question = screen.getByRole('button', { name: /サービスの利用は無料ですか？/ })
    await user.click(question)

    await waitFor(() => {
      expect(screen.getByText('はい、基本機能は無料でご利用いただけます。')).toBeInTheDocument()
    })

    // カテゴリを変更
    const pricingFilter = screen.getByTestId('category-filter-pricing')
    await user.click(pricingFilter)

    // 前の回答が閉じていることを確認
    await waitFor(() => {
      expect(
        screen.queryByText('はい、基本機能は無料でご利用いただけます。'),
      ).not.toBeInTheDocument()
    })
  })
})
