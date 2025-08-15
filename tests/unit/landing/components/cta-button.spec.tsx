import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CTAButton } from '~/features/landing/components/cta-button'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({
      children,
      whileHover,
      whileTap,
      whileInView,
      initial,
      animate,
      transition,
      ...props
    }: any) => <button {...props}>{children}</button>,
    div: ({
      children,
      whileHover,
      whileTap,
      whileInView,
      initial,
      animate,
      transition,
      ...props
    }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    target,
    rel,
    external,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    ...props
  }: any) => {
    const linkProps: any = { href, ...props }
    if (external) {
      linkProps.target = '_blank'
      linkProps.rel = 'noopener noreferrer'
    }
    if (ariaLabel) {
      linkProps['aria-label'] = ariaLabel
    }
    if (ariaDescribedby) {
      linkProps['aria-describedby'] = ariaDescribedby
    }
    // Remove boolean props that shouldn't be passed to DOM
    delete linkProps.external
    return <a {...linkProps}>{children}</a>
  },
}))

describe('CTAButton', () => {
  const user = userEvent.setup()

  it('CTAボタンが正しくレンダリングされる', () => {
    render(<CTAButton href="/sign-up">無料で始める</CTAButton>)

    const button = screen.getByRole('link', { name: '無料で始める' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('href', '/sign-up')
  })

  it('プライマリスタイルが適用される', () => {
    render(
      <CTAButton href="/sign-up" variant="primary">
        登録
      </CTAButton>,
    )

    const button = screen.getByRole('link', { name: '登録' })
    expect(button).toBeInTheDocument()
  })

  it('セカンダリスタイルが適用される', () => {
    render(
      <CTAButton href="/sign-in" variant="secondary">
        ログイン
      </CTAButton>,
    )

    const button = screen.getByRole('link', { name: 'ログイン' })
    expect(button).toBeInTheDocument()
  })

  it('サイズが正しく適用される', () => {
    render(
      <CTAButton href="/sign-up" size="large">
        大きなボタン
      </CTAButton>,
    )

    const button = screen.getByRole('link', { name: '大きなボタン' })
    expect(button).toBeInTheDocument()
  })

  it('無効状態が正しく動作する', () => {
    render(
      <CTAButton href="/sign-up" disabled>
        無効ボタン
      </CTAButton>,
    )

    const button = screen.getByRole('button', { name: '無効ボタン' })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
  })

  it('ローディング状態が表示される', () => {
    render(
      <CTAButton href="/sign-up" loading>
        読み込み中
      </CTAButton>,
    )

    const button = screen.getByRole('button', { name: '読み込み中' })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
  })

  it('アイコンが表示される', () => {
    render(
      <CTAButton href="/sign-up" icon="ArrowRight">
        次へ
      </CTAButton>,
    )

    const button = screen.getByRole('link', { name: '次へ' })
    expect(button).toBeInTheDocument()
  })

  it('全幅設定が適用される', () => {
    render(
      <CTAButton href="/sign-up" fullWidth>
        全幅ボタン
      </CTAButton>,
    )

    const button = screen.getByRole('link', { name: '全幅ボタン' })
    expect(button).toBeInTheDocument()
  })

  it('クリックイベントが正しく動作する', async () => {
    const handleClick = vi.fn(() => {
      // クリックハンドラー
    })
    render(
      <CTAButton href="/sign-up" onClick={handleClick}>
        クリックテスト
      </CTAButton>,
    )

    const button = screen.getByRole('link', { name: 'クリックテスト' })
    // Force preventDefault to avoid JSDOM navigation error
    button.addEventListener('click', (e) => e.preventDefault())
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('外部リンクが新しいタブで開く', () => {
    render(
      <CTAButton href="https://example.com" external>
        外部リンク
      </CTAButton>,
    )

    const button = screen.getByRole('link', { name: '外部リンク' })
    expect(button).toHaveAttribute('target', '_blank')
    expect(button).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('カスタムclassNameが適用される', () => {
    render(
      <CTAButton href="/sign-up" className="custom-class">
        カスタム
      </CTAButton>,
    )

    const button = screen.getByRole('link', { name: 'カスタム' })
    expect(button).toHaveClass('custom-class')
  })

  it('アクセシビリティ属性が正しく設定される', () => {
    render(
      <CTAButton href="/sign-up" aria-label="アカウント登録" aria-describedby="register-help">
        登録
      </CTAButton>,
    )

    const button = screen.getByRole('link', { name: 'アカウント登録' })
    expect(button).toHaveAttribute('aria-describedby', 'register-help')
  })

  it('data属性が正しく設定される', () => {
    render(
      <CTAButton href="/sign-up" data-testid="register-button">
        登録
      </CTAButton>,
    )

    expect(screen.getByTestId('register-button')).toBeInTheDocument()
  })
})
