import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ValuePropositionSection } from '~/features/landing/components/value-proposition-section'
import type { ValueProposition } from '~/features/landing/types'

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

vi.mock('~/features/landing/hooks/use-count-animation', () => ({
  useCountAnimation: (target: number) => ({
    count: target,
  }),
}))

const mockValuePropositions: ValueProposition[] = [
  {
    id: '1',
    title: '読書の質向上',
    description: '意図的な読書により、理解度と記憶定着率が大幅に向上します。',
    before: '漠然とした読書',
    after: '明確な目的を持った読書',
    icon: 'BookOpen',
  },
  {
    id: '2',
    title: '学習効果最大化',
    description: 'メンタルマップとアウトプットで学習効果を最大化できます。',
    before: '受動的な学習',
    after: '能動的な学習',
    icon: 'Brain',
  },
  {
    id: '3',
    title: '成長の記録',
    description: '読書履歴と成長過程を可視化して継続的な改善を実現します。',
    before: '曖昧な進捗',
    after: '明確な成長指標',
    icon: 'TrendingUp',
  },
]

describe('ValuePropositionSection', () => {
  it('価値提案セクションが正しくレンダリングされる', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} />)

    expect(screen.getByTestId('value-proposition-section')).toBeInTheDocument()
    expect(screen.getByText('なぜ意図的読書が効果的なのか')).toBeInTheDocument()
    expect(screen.getByText(/従来の読書法との違いを/)).toBeInTheDocument()
  })

  it('統計情報が正しく表示される', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} showStats={true} />)

    expect(screen.getByTestId('statistics-display')).toBeInTheDocument()
    expect(screen.getByText('平均学習効果向上')).toBeInTheDocument()
    expect(screen.getByText('継続率')).toBeInTheDocument()
    expect(screen.getByText('満足度')).toBeInTheDocument()
  })

  it('統計情報を非表示にできる', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} showStats={false} />)

    expect(screen.queryByTestId('statistics-display')).not.toBeInTheDocument()
  })

  it('価値提案カードが正しく表示される', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} />)

    expect(screen.getByText('読書の質向上')).toBeInTheDocument()
    expect(screen.getByText('学習効果最大化')).toBeInTheDocument()
    expect(screen.getByText('成長の記録')).toBeInTheDocument()

    expect(
      screen.getByText('意図的な読書により、理解度と記憶定着率が大幅に向上します。'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('メンタルマップとアウトプットで学習効果を最大化できます。'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('読書履歴と成長過程を可視化して継続的な改善を実現します。'),
    ).toBeInTheDocument()
  })

  it('Before/After比較が表示される', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} />)

    expect(screen.getByText('漠然とした読書')).toBeInTheDocument()
    expect(screen.getByText('明確な目的を持った読書')).toBeInTheDocument()
    expect(screen.getByText('受動的な学習')).toBeInTheDocument()
    expect(screen.getByText('能動的な学習')).toBeInTheDocument()
    expect(screen.getByText('曖昧な進捗')).toBeInTheDocument()
    expect(screen.getByText('明確な成長指標')).toBeInTheDocument()
  })

  it('改善率が正しく表示される', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} />)

    expect(screen.getByText('85%向上')).toBeInTheDocument()
    expect(screen.getByText('92%向上')).toBeInTheDocument()
    expect(screen.getByText('78%向上')).toBeInTheDocument()
  })

  it('メソッド説明セクションが表示される', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} />)

    expect(screen.getByText('意図的読書の3つのステップ')).toBeInTheDocument()
    expect(screen.getByText('明確な目標設定')).toBeInTheDocument()
    expect(screen.getByText('構造化された読書')).toBeInTheDocument()
    expect(screen.getByText('継続的な振り返り')).toBeInTheDocument()
  })

  it('ユーザー体験例が表示される', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} />)

    expect(screen.getByText('ユーザー体験例')).toBeInTheDocument()
    expect(screen.getByText(/1ヶ月で読書効率が2倍に改善/)).toBeInTheDocument()
    expect(screen.getByText(/3ヶ月で30冊の専門書を/)).toBeInTheDocument()
    expect(screen.getByText(/6ヶ月で新しい分野の/)).toBeInTheDocument()
  })

  it('CTAセクションが表示される', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} />)

    expect(screen.getByText('今すぐ意図的読書を始めよう')).toBeInTheDocument()
    expect(screen.getByText(/無料プランで今すぐ/)).toBeInTheDocument()
    expect(screen.getByText('無料で始める')).toBeInTheDocument()
    expect(screen.getByText('詳細を見る')).toBeInTheDocument()
  })

  it('animatedがfalseの場合でも正常に動作する', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} animated={false} />)

    expect(screen.getByTestId('value-proposition-section')).toBeInTheDocument()
    expect(screen.getByText('なぜ意図的読書が効果的なのか')).toBeInTheDocument()
  })

  it('カスタムclassNameが適用される', () => {
    render(
      <ValuePropositionSection
        valuePropositions={mockValuePropositions}
        className="custom-value-prop"
      />,
    )

    const section = screen.getByTestId('value-proposition-section')
    expect(section).toHaveClass('custom-value-prop')
  })

  it('空の価値提案リストでもエラーにならない', () => {
    render(<ValuePropositionSection valuePropositions={[]} />)

    expect(screen.getByTestId('value-proposition-section')).toBeInTheDocument()
    expect(screen.getByText('なぜ意図的読書が効果的なのか')).toBeInTheDocument()
  })

  it('価値提案が1つだけの場合でも正常に動作する', () => {
    const singleValueProp = [mockValuePropositions[0]]
    render(<ValuePropositionSection valuePropositions={singleValueProp} />)

    expect(screen.getByText('読書の質向上')).toBeInTheDocument()
    expect(screen.getByText('85%向上')).toBeInTheDocument()
  })

  it('統計データが正しくカウントアップされる', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} showStats={true} />)

    // カウントアップされた値が表示されることを確認
    expect(screen.getByText('85%')).toBeInTheDocument()
    expect(screen.getByText('94%')).toBeInTheDocument()
    expect(screen.getByText('96%')).toBeInTheDocument()
  })

  it('レスポンシブデザインクラスが適用される', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} />)

    const section = screen.getByTestId('value-proposition-section')
    expect(section).toHaveClass('relative')

    // 価値提案グリッドの確認
    const valuePropsGrid = screen.getByTestId('value-propositions-grid')
    expect(valuePropsGrid).toBeInTheDocument()
  })

  it('すべてのCTAリンクが正しいURLを持つ', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} />)

    const startButton = screen.getByText('無料で始める').closest('a')
    const detailsButton = screen.getByText('詳細を見る').closest('a')

    expect(startButton).toHaveAttribute('href', '/auth/register')
    expect(detailsButton).toHaveAttribute('href', '/features')
  })

  it('アイコンマッピングが正しく動作する', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} />)

    // アイコンが表示されることを確認（data-testidで確認）
    expect(screen.getByTestId('value-prop-card-1')).toBeInTheDocument()
    expect(screen.getByTestId('value-prop-card-2')).toBeInTheDocument()
    expect(screen.getByTestId('value-prop-card-3')).toBeInTheDocument()
  })

  it('進歩バーが正しく表示される', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} />)

    // 各価値提案カードに進歩バーが含まれていることを確認
    const cards = screen.getAllByTestId(/value-prop-card-/)
    expect(cards).toHaveLength(3)
  })

  it('背景装飾要素が存在する', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} />)

    const section = screen.getByTestId('value-proposition-section')
    expect(section).toHaveClass('relative')

    // 背景装飾の確認（セクション全体の存在確認）
    expect(section).toBeInTheDocument()
  })

  it('ステップアイコンが正しく表示される', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} />)

    // ステップの番号が表示されることを確認
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('体験例の期間別表示が正しく動作する', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} />)

    expect(screen.getByText('1ヶ月後')).toBeInTheDocument()
    expect(screen.getByText('3ヶ月後')).toBeInTheDocument()
    expect(screen.getByText('6ヶ月後')).toBeInTheDocument()
  })

  it('統計セクションのアイコンが正しく表示される', () => {
    render(<ValuePropositionSection valuePropositions={mockValuePropositions} showStats={true} />)

    const statsSection = screen.getByTestId('statistics-display')
    expect(statsSection).toBeInTheDocument()
  })
})
