import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Footer } from '~/features/landing/components/footer'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    footer: ({ children, ...props }: any) => <footer {...props}>{children}</footer>,
  },
}))

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('Footer', () => {
  it('フッターが正しくレンダリングされる', () => {
    render(<Footer />)

    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByText('読書管理アプリ')).toBeInTheDocument()
    expect(screen.getByText(/意図的読書で人生を変える/)).toBeInTheDocument()
  })

  it('ナビゲーションリンクが表示される', () => {
    render(<Footer />)

    expect(screen.getByText('機能')).toBeInTheDocument()
    expect(screen.getByText('料金')).toBeInTheDocument()
    expect(screen.getByText('サポート')).toBeInTheDocument()
    expect(screen.getByText('会社情報')).toBeInTheDocument()
  })

  it('機能セクションのリンクが正しく表示される', () => {
    render(<Footer />)

    expect(screen.getByText('読書記録')).toBeInTheDocument()
    expect(screen.getByText('進捗管理')).toBeInTheDocument()
    expect(screen.getByText('メンタルマップ')).toBeInTheDocument()
    expect(screen.getByText('レビュー機能')).toBeInTheDocument()
  })

  it('サポートセクションのリンクが表示される', () => {
    render(<Footer />)

    expect(screen.getByText('ヘルプセンター')).toBeInTheDocument()
    expect(screen.getByText('お問い合わせ')).toBeInTheDocument()
    expect(screen.getByText('FAQ')).toBeInTheDocument()
    expect(screen.getByText('システム状況')).toBeInTheDocument()
  })

  it('会社情報セクションのリンクが表示される', () => {
    render(<Footer />)

    expect(screen.getByText('私たちについて')).toBeInTheDocument()
    expect(screen.getByText('ブログ')).toBeInTheDocument()
    expect(screen.getByText('採用情報')).toBeInTheDocument()
    expect(screen.getByText('プレスキット')).toBeInTheDocument()
  })

  it('ソーシャルメディアリンクが表示される', () => {
    render(<Footer />)

    const twitterLink = screen.getByLabelText('Twitter')
    const facebookLink = screen.getByLabelText('Facebook')
    const linkedinLink = screen.getByLabelText('LinkedIn')

    expect(twitterLink).toBeInTheDocument()
    expect(facebookLink).toBeInTheDocument()
    expect(linkedinLink).toBeInTheDocument()
  })

  it('リーガルリンクが表示される', () => {
    render(<Footer />)

    expect(screen.getByText('プライバシーポリシー')).toBeInTheDocument()
    expect(screen.getByText('利用規約')).toBeInTheDocument()
    expect(screen.getByText('特定商取引法')).toBeInTheDocument()
  })

  it('著作権表示が正しく表示される', () => {
    render(<Footer />)

    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument()
    expect(screen.getByText(/読書管理アプリ/)).toBeInTheDocument()
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument()
  })

  it('ニュースレター登録セクションが表示される', () => {
    render(<Footer />)

    expect(screen.getByText('最新情報を受け取る')).toBeInTheDocument()
    expect(screen.getByText(/新機能やアップデート情報/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('メールアドレス')).toBeInTheDocument()
    expect(screen.getByText('登録する')).toBeInTheDocument()
  })

  it('すべてのリンクが正しいURLを持つ', () => {
    render(<Footer />)

    // 機能リンクの確認
    expect(screen.getByText('読書記録').closest('a')).toHaveAttribute(
      'href',
      '/features/reading-log',
    )
    expect(screen.getByText('進捗管理').closest('a')).toHaveAttribute('href', '/features/progress')
    expect(screen.getByText('メンタルマップ').closest('a')).toHaveAttribute(
      'href',
      '/features/mental-map',
    )

    // サポートリンクの確認
    expect(screen.getByText('ヘルプセンター').closest('a')).toHaveAttribute('href', '/help')
    expect(screen.getByText('お問い合わせ').closest('a')).toHaveAttribute('href', '/contact')
    expect(screen.getByText('FAQ').closest('a')).toHaveAttribute('href', '/faq')

    // 会社情報リンクの確認
    expect(screen.getByText('私たちについて').closest('a')).toHaveAttribute('href', '/about')
    expect(screen.getByText('ブログ').closest('a')).toHaveAttribute('href', '/blog')
    expect(screen.getByText('採用情報').closest('a')).toHaveAttribute('href', '/careers')

    // リーガルリンクの確認
    expect(screen.getByText('プライバシーポリシー').closest('a')).toHaveAttribute(
      'href',
      '/privacy',
    )
    expect(screen.getByText('利用規約').closest('a')).toHaveAttribute('href', '/terms')
  })

  it('ソーシャルメディアリンクが正しいURLを持つ', () => {
    render(<Footer />)

    const twitterLink = screen.getByLabelText('Twitter')
    const facebookLink = screen.getByLabelText('Facebook')
    const linkedinLink = screen.getByLabelText('LinkedIn')

    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/reading-app')
    expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/reading-app')
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/company/reading-app')
  })

  it('ニュースレター登録フォームが機能する', () => {
    render(<Footer />)

    const emailInput = screen.getByPlaceholderText('メールアドレス')
    const submitButton = screen.getByText('登録する')

    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('アクセシビリティ属性が正しく設定される', () => {
    render(<Footer />)

    // nav要素にaria-labelが設定されていることを確認
    const footerNavs = screen.getAllByRole('navigation')
    footerNavs.forEach((nav) => {
      expect(nav).toHaveAttribute('aria-label')
    })

    // ソーシャルメディアリンクにaria-labelが設定されていることを確認
    const socialLinks = [
      screen.getByLabelText('Twitter'),
      screen.getByLabelText('Facebook'),
      screen.getByLabelText('LinkedIn'),
    ]
    socialLinks.forEach((link) => {
      expect(link).toHaveAttribute('aria-label')
    })
  })

  it('外部リンクが新しいタブで開く', () => {
    render(<Footer />)

    const twitterLink = screen.getByLabelText('Twitter')
    const facebookLink = screen.getByLabelText('Facebook')
    const linkedinLink = screen.getByLabelText('LinkedIn')

    expect(twitterLink).toHaveAttribute('target', '_blank')
    expect(facebookLink).toHaveAttribute('target', '_blank')
    expect(linkedinLink).toHaveAttribute('target', '_blank')

    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('カスタムclassNameが適用される', () => {
    render(<Footer className="custom-footer" />)

    const footer = screen.getByTestId('footer')
    expect(footer).toHaveClass('custom-footer')
  })

  it('レスポンシブデザインクラスが適用される', () => {
    render(<Footer />)

    const footer = screen.getByTestId('footer')
    expect(footer).toBeInTheDocument()

    // フッターコンテンツグリッドの確認
    const footerContent = footer.querySelector('[class*="grid"]')
    expect(footerContent).toBeInTheDocument()
  })

  it('ロゴとブランディングが正しく表示される', () => {
    render(<Footer />)

    expect(screen.getByText('読書管理アプリ')).toBeInTheDocument()
    expect(screen.getByText(/意図的読書で人生を変える/)).toBeInTheDocument()
  })

  it('言語切り替えオプションが表示される', () => {
    render(<Footer />)

    expect(screen.getByText('日本語')).toBeInTheDocument()
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('すべてのセクションタイトルが正しく表示される', () => {
    render(<Footer />)

    expect(screen.getByText('機能')).toBeInTheDocument()
    expect(screen.getByText('サポート')).toBeInTheDocument()
    expect(screen.getByText('会社情報')).toBeInTheDocument()
    expect(screen.getByText('最新情報を受け取る')).toBeInTheDocument()
  })
})
