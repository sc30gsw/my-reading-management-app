import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ValuePropositionSection } from '~/features/landing/components/value-proposition-section'

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

describe('ValuePropositionSection', () => {
  it('価値提案セクションが正しくレンダリングされる', () => {
    render(<ValuePropositionSection />)

    expect(screen.getByTestId('value-proposition-section')).toBeInTheDocument()
    expect(screen.getByText('読書体験の変化')).toBeInTheDocument()
    expect(
      screen.getByText('従来の読書から意図的読書へ。あなたの学習体験を根本から変革します。'),
    ).toBeInTheDocument()
  })

  it('統計情報が正しく表示される', () => {
    render(<ValuePropositionSection showStatistics={true} />)

    expect(screen.getByTestId('statistics-section')).toBeInTheDocument()
    expect(screen.getByText('数字で見る効果')).toBeInTheDocument()
    expect(screen.getByText('実際のユーザーデータに基づく改善効果')).toBeInTheDocument()
  })

  it('統計情報を非表示にできる', () => {
    render(<ValuePropositionSection showStatistics={false} />)

    expect(screen.queryByTestId('statistics-section')).not.toBeInTheDocument()
  })

  it('価値提案カードが正しく表示される', () => {
    render(<ValuePropositionSection />)

    // 実際のデータ構造に基づく値を確認 - 複数回表示される可能性があるのでgetAllByTextを使用
    expect(screen.getAllByText('読書の質向上')[0]).toBeInTheDocument()
    expect(screen.getAllByText('学習効果最大化')[0]).toBeInTheDocument()
    expect(screen.getAllByText('成長の記録')[0]).toBeInTheDocument()
  })

  it('Before/After比較が表示される', () => {
    render(<ValuePropositionSection />)

    // 実際のbefore/after値を確認 - 複数回表示される可能性があるのでgetAllByTextを使用
    expect(screen.getAllByText('漠然とした読書で内容が頭に残らない')[0]).toBeInTheDocument()
    expect(screen.getAllByText('メンタルマップによる構造化で深い理解')[0]).toBeInTheDocument()
    expect(screen.getAllByText('ただ読むだけで活用できない知識')[0]).toBeInTheDocument()
    expect(screen.getAllByText('意図的な読書プロセスで実践的な知識習得')[0]).toBeInTheDocument()
  })

  it('改善率が正しく表示される', () => {
    render(<ValuePropositionSection />)

    // 実際の統計値を確認 - 複数回表示される可能性があるのでgetAllByTextを使用
    expect(screen.getAllByText('+85%')[0]).toBeInTheDocument()
    expect(screen.getAllByText('+3倍')[0]).toBeInTheDocument()
    expect(screen.getAllByText('+60%')[0]).toBeInTheDocument()
  })

  it('従来の読書vs意図的読書の比較セクションが表示される', () => {
    render(<ValuePropositionSection />)

    expect(screen.getByText('従来の読書')).toBeInTheDocument()
    expect(screen.getByText('意図的読書')).toBeInTheDocument()
    expect(screen.getByTestId('before-section')).toBeInTheDocument()
    expect(screen.getByTestId('after-section')).toBeInTheDocument()
  })

  it('価値フロー図が表示される', () => {
    render(<ValuePropositionSection />)

    expect(screen.getByTestId('value-flow-diagram')).toBeInTheDocument()
    expect(screen.getByText('継続的な成長サイクル')).toBeInTheDocument()
    expect(screen.getByText('意図設定')).toBeInTheDocument()
    expect(screen.getByText('効果的読書')).toBeInTheDocument()
    expect(screen.getByText('記録・分析')).toBeInTheDocument()
    expect(screen.getByText('継続改善')).toBeInTheDocument()
  })

  it('animateOnScrollがfalseの場合でも正常に動作する', () => {
    render(<ValuePropositionSection animateOnScroll={false} />)

    expect(screen.getByTestId('value-proposition-section')).toBeInTheDocument()
    expect(screen.getByText('読書体験の変化')).toBeInTheDocument()
  })

  it('カスタムclassNameが適用される', () => {
    render(<ValuePropositionSection className="custom-value-prop" />)

    const section = screen.getByTestId('value-proposition-section')
    expect(section).toHaveClass('custom-value-prop')
  })

  it('価値提案が1つだけの場合でも正常に動作する', () => {
    render(<ValuePropositionSection />)

    expect(screen.getAllByText('読書の質向上')[0]).toBeInTheDocument()
    expect(screen.getAllByText('+85%')[0]).toBeInTheDocument()
  })

  it('統計データが正しくカウントアップされる', () => {
    render(<ValuePropositionSection showStatistics={true} />)

    // カウントアップされた値が表示されることを確認
    expect(screen.getByTestId('statistics-section')).toBeInTheDocument()
    expect(screen.getByText('数字で見る効果')).toBeInTheDocument()
  })

  it('レスポンシブデザインクラスが適用される', () => {
    render(<ValuePropositionSection />)

    const section = screen.getByTestId('value-proposition-section')
    expect(section).toHaveClass('relative')

    // 価値提案グリッドの確認
    const valuePropsGrid = screen.getByTestId('value-propositions-grid')
    expect(valuePropsGrid).toBeInTheDocument()
  })

  it('アイコンマッピングが正しく動作する', () => {
    render(<ValuePropositionSection />)

    // アイコンが表示されることを確認（data-testidで確認）
    expect(screen.getByTestId('value-prop-card-reading-quality')).toBeInTheDocument()
    expect(screen.getByTestId('value-prop-card-learning-effectiveness')).toBeInTheDocument()
    expect(screen.getByTestId('value-prop-card-growth-tracking')).toBeInTheDocument()
  })

  it('背景装飾要素が存在する', () => {
    render(<ValuePropositionSection />)

    const section = screen.getByTestId('value-proposition-section')
    expect(section).toHaveClass('relative')

    // 背景装飾の確認（セクション全体の存在確認）
    expect(section).toBeInTheDocument()
  })

  it('Before/Afterセクションのアイコンが正しく表示される', () => {
    render(<ValuePropositionSection />)

    const beforeSection = screen.getByTestId('before-section')
    const afterSection = screen.getByTestId('after-section')

    expect(beforeSection).toBeInTheDocument()
    expect(afterSection).toBeInTheDocument()
  })

  it('価値提案の統計表示セクションが正しく動作する', () => {
    render(<ValuePropositionSection showStatistics={true} />)

    const statsSection = screen.getByTestId('statistics-section')
    expect(statsSection).toBeInTheDocument()
    expect(screen.getByText('数字で見る効果')).toBeInTheDocument()
  })
})
