import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

// Mock Framer Motion to handle all HTML elements
const createMotionComponent = (tag: string) => {
  return React.forwardRef((props: any, ref: any) => {
    // Extract animation props and pass only DOM props to actual element
    const animationProps = [
      'initial',
      'animate',
      'exit',
      'whileHover',
      'whileTap',
      'whileFocus',
      'whileDrag',
      'whileInView',
      'drag',
      'dragConstraints',
      'dragElastic',
      'dragMomentum',
      'dragTransition',
      'layout',
      'layoutId',
      'transition',
      'variants',
      'custom',
      'viewport',
    ]

    const domProps = Object.keys(props).reduce((acc: any, key) => {
      if (!animationProps.includes(key)) {
        acc[key] = props[key]
      }
      return acc
    }, {})

    return React.createElement(tag, { ...domProps, ref })
  })
}

vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_, tag) => createMotionComponent(tag as string),
    },
  ),
}))

// Simple icon mocks
vi.mock('lucide-react', () => ({
  ArrowUp: () => <div data-testid="arrow-up" />,
  BookOpen: () => <div data-testid="book-open" />,
  Facebook: () => <div data-testid="facebook" />,
  Github: () => <div data-testid="github" />,
  Heart: () => <div data-testid="heart" />,
  Linkedin: () => <div data-testid="linkedin" />,
  Mail: () => <div data-testid="mail" />,
  MapPin: () => <div data-testid="mappin" />,
  Phone: () => <div data-testid="phone" />,
  Twitter: () => <div data-testid="twitter" />,
}))

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}))

// Mock utilities
vi.mock('~/features/landing/utils', () => ({
  cn: (...classes: any[]) => classes.join(' '),
}))

vi.mock('~/features/landing/constants', () => ({
  SPACING_CONFIG: { container: { padding: 'px-4' } },
}))

// Mock window.scrollTo
const mockScrollTo = vi.fn()
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
})

// Import the actual Footer component
import { Footer } from '~/features/landing/components/footer'

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render', () => {
      render(<Footer />)
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<Footer className="custom-class" />)
      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveClass('custom-class')
    })

    it('displays company logo and name', () => {
      render(<Footer />)
      expect(screen.getByTestId('book-open')).toBeInTheDocument()
      expect(screen.getByText('読書管理')).toBeInTheDocument()
    })

    it('displays company description', () => {
      render(<Footer />)
      expect(screen.getByText(/意図的読書で学習効果を最大化する/)).toBeInTheDocument()
    })

    it('displays current year in copyright', () => {
      render(<Footer />)
      const currentYear = new Date().getFullYear()
      expect(
        screen.getByText(`© ${currentYear} 読書管理. All rights reserved.`),
      ).toBeInTheDocument()
    })
  })

  describe('Contact Information', () => {
    it('renders all contact information items', () => {
      render(<Footer />)
      expect(screen.getByTestId('mail')).toBeInTheDocument()
      expect(screen.getByTestId('phone')).toBeInTheDocument()
      expect(screen.getByTestId('mappin')).toBeInTheDocument()
    })

    it('renders contact information', () => {
      render(<Footer />)
      expect(screen.getByText('support@reading-app.com')).toBeInTheDocument()
      expect(screen.getByText('03-1234-5678')).toBeInTheDocument()
      expect(screen.getByText('東京都渋谷区shibuya 1-1-1')).toBeInTheDocument()
    })
  })

  describe('Footer Links', () => {
    it('renders footer link sections', () => {
      render(<Footer />)
      expect(screen.getByText('プロダクト')).toBeInTheDocument()
      expect(screen.getByText('会社情報')).toBeInTheDocument()
      expect(screen.getByText('サポート')).toBeInTheDocument()
      expect(screen.getByText('法的情報')).toBeInTheDocument()
    })

    it('renders product section links', () => {
      render(<Footer />)
      expect(screen.getByText('機能')).toBeInTheDocument()
      expect(screen.getByText('料金プラン')).toBeInTheDocument()
      expect(screen.getByText('デモ')).toBeInTheDocument()
      expect(screen.getByText('API')).toBeInTheDocument()
    })

    it('renders company section links', () => {
      render(<Footer />)
      expect(screen.getByText('私たちについて')).toBeInTheDocument()
      expect(screen.getByText('採用情報')).toBeInTheDocument()
      expect(screen.getByText('ニュース')).toBeInTheDocument()
      expect(screen.getByText('お問い合わせ')).toBeInTheDocument()
    })

    it('renders support section links', () => {
      render(<Footer />)
      expect(screen.getByText('ヘルプセンター')).toBeInTheDocument()
      expect(screen.getByText('使い方ガイド')).toBeInTheDocument()
      expect(screen.getByText('コミュニティ')).toBeInTheDocument()
      expect(screen.getByText('システム状況')).toBeInTheDocument()
    })

    it('renders legal section links', () => {
      render(<Footer />)
      expect(screen.getByText('プライバシーポリシー')).toBeInTheDocument()
      expect(screen.getByText('利用規約')).toBeInTheDocument()
      expect(screen.getByText('セキュリティ')).toBeInTheDocument()
      expect(screen.getByText('コンプライアンス')).toBeInTheDocument()
    })
  })

  describe('Newsletter Signup', () => {
    it('renders newsletter signup section', () => {
      render(<Footer />)
      expect(screen.getByText('最新情報をお届け')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('メールアドレス')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '登録' })).toBeInTheDocument()
    })

    it('renders email input with correct type and placeholder', () => {
      render(<Footer />)
      const emailInput = screen.getByPlaceholderText('メールアドレス')
      expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('allows typing in email input', async () => {
      const user = userEvent.setup()
      render(<Footer />)

      const emailInput = screen.getByPlaceholderText('メールアドレス')
      await user.type(emailInput, 'test@example.com')
      expect(emailInput).toHaveValue('test@example.com')
    })
  })

  describe('Social Media Links', () => {
    it('renders social media icons', () => {
      render(<Footer />)
      expect(screen.getByTestId('twitter')).toBeInTheDocument()
      expect(screen.getByTestId('github')).toBeInTheDocument()
      expect(screen.getByTestId('linkedin')).toBeInTheDocument()
      expect(screen.getByTestId('facebook')).toBeInTheDocument()
    })

    it('social links have correct attributes', () => {
      render(<Footer />)
      const links = screen.getAllByRole('link')

      const twitterLink = links.find((link) => link.getAttribute('href')?.includes('twitter'))
      expect(twitterLink).toHaveAttribute('target', '_blank')
      expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer')
      expect(twitterLink).toHaveAttribute('aria-label', 'Twitter')
    })
  })

  describe('Scroll to Top Button', () => {
    it('renders scroll to top button', () => {
      render(<Footer />)
      const scrollButton = screen.getByRole('button', { name: 'ページトップへ戻る' })
      expect(scrollButton).toBeInTheDocument()
      expect(screen.getByTestId('arrow-up')).toBeInTheDocument()
    })

    it('calls scrollTo when clicked with userEvent', async () => {
      const user = userEvent.setup()
      render(<Footer />)

      const scrollButton = screen.getByRole('button', { name: 'ページトップへ戻る' })
      await user.click(scrollButton)

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      })
    })

    it('calls scrollTo when clicked with fireEvent', () => {
      render(<Footer />)

      const scrollButton = screen.getByRole('button', { name: 'ページトップへ戻る' })
      fireEvent.click(scrollButton)

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      })
    })
  })

  describe('Trust Badges', () => {
    it('renders trust badges', () => {
      render(<Footer />)
      expect(screen.getByText('SSL暗号化')).toBeInTheDocument()
      expect(screen.getByText('プライバシー準拠')).toBeInTheDocument()
      expect(screen.getByText('ISO27001認証')).toBeInTheDocument()
      expect(screen.getByText('24時間監視')).toBeInTheDocument()
    })
  })

  describe('Copyright Section', () => {
    it('renders "Made with ❤️ in Japan" message', () => {
      render(<Footer />)
      expect(screen.getByText(/Made with/)).toBeInTheDocument()
      expect(screen.getByText(/in Japan/)).toBeInTheDocument()
      expect(screen.getByTestId('heart')).toBeInTheDocument()
    })

    it('displays correct copyright text', () => {
      render(<Footer />)
      const currentYear = new Date().getFullYear()
      expect(
        screen.getByText(`© ${currentYear} 読書管理. All rights reserved.`),
      ).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('applies correct CSS classes for responsive layout', () => {
      render(<Footer />)
      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveClass('bg-slate-900', 'text-white')
    })
  })

  describe('Error Handling', () => {
    it('handles missing className prop gracefully', () => {
      expect(() => render(<Footer />)).not.toThrow()
    })

    it('renders correctly when scrollTo is not available', () => {
      const originalScrollTo = window.scrollTo
      // @ts-expect-error
      delete window.scrollTo

      expect(() => render(<Footer />)).not.toThrow()

      window.scrollTo = originalScrollTo
    })
  })

  describe('User Interactions', () => {
    it('handles multiple clicks on scroll to top button', async () => {
      const user = userEvent.setup()
      render(<Footer />)

      const scrollButton = screen.getByRole('button', { name: 'ページトップへ戻る' })

      await user.click(scrollButton)
      await user.click(scrollButton)
      await user.click(scrollButton)

      expect(mockScrollTo).toHaveBeenCalledTimes(3)
    })

    it('allows keyboard navigation to scroll button', async () => {
      const user = userEvent.setup()
      render(<Footer />)

      const scrollButton = screen.getByRole('button', { name: 'ページトップへ戻る' })

      scrollButton.focus()
      expect(scrollButton).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(mockScrollTo).toHaveBeenCalled()
    })
  })
})
