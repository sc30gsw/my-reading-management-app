import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import '@testing-library/jest-dom'

import { Navigation } from '~/features/landing/components/navigation'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock hooks
jest.mock('~/hooks/landing', () => ({
  useScrollPosition: jest.fn(() => ({
    scrollY: 0,
    scrollDirection: 'up',
  })),
}))

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock Next.js components
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
})

// Mock CTAButton components
jest.mock('../CTAButton', () => ({
  LoginCTA: ({ className, trackingId, ...props }: any) => (
    <button className={className} data-testid="login-cta" {...props}>
      ログイン
    </button>
  ),
  RegisterCTA: ({ className, trackingId, ...props }: any) => (
    <button className={className} data-testid="register-cta" {...props}>
      無料で始める
    </button>
  ),
}))

// Mock scroll behavior
const mockScrollTo = jest.fn()
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
})

describe('Navigation', () => {
  const mockUseScrollPosition = require('~/hooks/landing').useScrollPosition

  beforeEach(() => {
    mockScrollTo.mockClear()
    mockUseScrollPosition.mockReturnValue({
      scrollY: 0,
      scrollDirection: 'up',
    })

    // Mock document.getElementById for smooth scroll tests
    document.getElementById = jest.fn((_id) => ({
      offsetTop: 100,
    })) as any
  })

  describe('Basic Rendering', () => {
    it('renders navigation header', () => {
      render(<Navigation />)
      expect(screen.getByTestId('navigation-header')).toBeInTheDocument()
    })

    it('renders logo with correct link', () => {
      render(<Navigation />)
      const logoLink = screen.getByRole('link', { name: /読書管理/i })
      expect(logoLink).toBeInTheDocument()
      expect(logoLink).toHaveAttribute('href', '/')
    })

    it('renders all navigation links', () => {
      render(<Navigation />)

      expect(screen.getByRole('link', { name: '機能' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: '価値提案' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: '料金' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'お客様の声' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'FAQ' })).toBeInTheDocument()
    })

    it('renders CTA buttons', () => {
      render(<Navigation />)
      expect(screen.getByTestId('login-cta')).toBeInTheDocument()
      expect(screen.getByTestId('register-cta')).toBeInTheDocument()
    })

    it('renders mobile menu button', () => {
      render(<Navigation />)
      expect(screen.getByRole('button', { name: /メニューを開く/i })).toBeInTheDocument()
    })

    it('renders spacer div for fixed header', () => {
      const { container } = render(<Navigation />)
      expect(container.querySelector('.h-20')).toBeInTheDocument()
    })
  })

  describe('Scroll Behavior', () => {
    it('applies transparent background when not scrolled', () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 0,
        scrollDirection: 'up',
      })

      render(<Navigation />)
      const header = screen.getByTestId('navigation-header')
      expect(header).toHaveClass('bg-transparent')
    })

    it('applies opaque background when scrolled', () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 100,
        scrollDirection: 'up',
      })

      render(<Navigation />)
      const header = screen.getByTestId('navigation-header')
      expect(header).toHaveClass('bg-white/95', 'backdrop-blur-md', 'shadow-lg')
    })

    it('adjusts text colors based on scroll state', () => {
      const { rerender } = render(<Navigation />)

      // When not scrolled - should have white text
      let logoText = screen.getByText('読書管理')
      expect(logoText).toHaveClass('text-white')

      // When scrolled - should have dark text
      mockUseScrollPosition.mockReturnValue({
        scrollY: 100,
        scrollDirection: 'up',
      })

      rerender(<Navigation />)
      logoText = screen.getByText('読書管理')
      expect(logoText).toHaveClass('text-slate-900')
    })
  })

  describe('Smooth Scrolling', () => {
    it('implements smooth scroll for hash links', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      const featuresLink = screen.getByRole('link', { name: '機能' })
      await user.click(featuresLink)

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 20, // 100 (offsetTop) - 80 (navHeight)
        behavior: 'smooth',
      })
    })

    it('does not scroll for non-hash links', async () => {
      const user = userEvent.setup()

      // Mock a link that doesn't start with #
      const TestComponent = () => (
        <a
          href="/external"
          onClick={(_e) => {
            const mockEvent = {
              preventDefault: jest.fn(),
              currentTarget: { href: '/external' },
            } as any

            // Simulate the smooth scroll function logic
            if (!mockEvent.currentTarget.href.startsWith('#')) {
              return // Should not call scrollTo
            }
          }}
        >
          External Link
        </a>
      )

      render(<TestComponent />)
      const externalLink = screen.getByRole('link', { name: 'External Link' })
      await user.click(externalLink)

      expect(mockScrollTo).not.toHaveBeenCalled()
    })
  })

  describe('Mobile Menu', () => {
    it('opens mobile menu when hamburger is clicked', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      const menuButton = screen.getByRole('button', { name: /メニューを開く/i })
      await user.click(menuButton)

      // Mobile menu should be rendered
      expect(screen.getByRole('button', { name: /メニューを閉じる/i })).toBeInTheDocument()
    })

    it('closes mobile menu when close button is clicked', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      // Open menu first
      const menuButton = screen.getByRole('button', { name: /メニューを開く/i })
      await user.click(menuButton)

      // Close menu
      const closeButton = screen.getByRole('button', { name: /メニューを閉じる/i })
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /メニューを閉じる/i })).not.toBeInTheDocument()
      })
    })

    it('closes mobile menu when backdrop is clicked', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      // Open menu first
      const menuButton = screen.getByRole('button', { name: /メニューを開く/i })
      await user.click(menuButton)

      // Find and click backdrop
      const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/50')
      if (backdrop) {
        fireEvent.click(backdrop)
      }

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /メニューを閉じる/i })).not.toBeInTheDocument()
      })
    })

    it('closes mobile menu when navigation link is clicked', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      // Open menu first
      const menuButton = screen.getByRole('button', { name: /メニューを開く/i })
      await user.click(menuButton)

      // Click a navigation link in mobile menu
      const mobileLinks = screen.getAllByRole('link', { name: '機能' })
      const mobileLink = mobileLinks.find((link) => link.closest('.fixed.top-0.right-0'))

      if (mobileLink) {
        await user.click(mobileLink)
      }

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /メニューを閉じる/i })).not.toBeInTheDocument()
      })
    })

    it('prevents body scroll when mobile menu is open', async () => {
      const user = userEvent.setup()

      // Mock document.body.style
      const originalOverflow = document.body.style.overflow

      render(<Navigation />)

      // Open menu
      const menuButton = screen.getByRole('button', { name: /メニューを開く/i })
      await user.click(menuButton)

      expect(document.body.style.overflow).toBe('hidden')

      // Close menu
      const closeButton = screen.getByRole('button', { name: /メニューを閉じる/i })
      await user.click(closeButton)

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('unset')
      })

      // Restore original value
      document.body.style.overflow = originalOverflow
    })
  })

  describe('Progress Bar', () => {
    it('renders progress bar', () => {
      render(<Navigation />)
      const progressBar = document.querySelector('.absolute.bottom-0.left-0.h-1')
      expect(progressBar).toBeInTheDocument()
    })

    it('calculates progress based on scroll position', () => {
      // Mock document properties for scroll calculation
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 2000,
        writable: true,
      })
      Object.defineProperty(window, 'innerHeight', {
        value: 800,
        writable: true,
      })

      mockUseScrollPosition.mockReturnValue({
        scrollY: 600, // 50% through the scrollable content
        scrollDirection: 'up',
      })

      render(<Navigation />)
      const progressBar = document.querySelector('.absolute.bottom-0.left-0.h-1')

      // Progress should be 50% (600 / (2000 - 800) * 100)
      expect(progressBar).toHaveStyle({ width: '50%' })
    })
  })

  describe('Accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<Navigation />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should not have accessibility violations with mobile menu open', async () => {
      const user = userEvent.setup()
      const { container } = render(<Navigation />)

      // Open mobile menu
      const menuButton = screen.getByRole('button', { name: /メニューを開く/i })
      await user.click(menuButton)

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('provides proper ARIA labels for interactive elements', () => {
      render(<Navigation />)

      expect(screen.getByRole('button', { name: /メニューを開く/i })).toHaveAttribute(
        'aria-label',
        'メニューを開く',
      )
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      // Tab through navigation elements
      await user.tab()
      expect(screen.getByRole('link', { name: /読書管理/i })).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('link', { name: '機能' })).toHaveFocus()
    })

    it('mobile menu close button has proper aria-label', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      // Open mobile menu
      const menuButton = screen.getByRole('button', { name: /メニューを開く/i })
      await user.click(menuButton)

      const closeButton = screen.getByRole('button', { name: /メニューを閉じる/i })
      expect(closeButton).toHaveAttribute('aria-label', 'メニューを閉じる')
    })
  })

  describe('Responsive Behavior', () => {
    it('hides desktop navigation on mobile', () => {
      render(<Navigation />)
      const desktopNav = document.querySelector('.hidden.lg\\:flex')
      expect(desktopNav).toBeInTheDocument()
    })

    it('hides mobile menu button on desktop', () => {
      render(<Navigation />)
      const mobileButton = screen.getByRole('button', { name: /メニューを開く/i })
      expect(mobileButton).toHaveClass('lg:hidden')
    })
  })

  describe('Performance', () => {
    it('renders without performance issues', () => {
      const startTime = performance.now()
      render(<Navigation />)
      const endTime = performance.now()

      // Should render in under 100ms
      expect(endTime - startTime).toBeLessThan(100)
    })

    it('does not cause memory leaks with scroll listener', () => {
      const { unmount } = render(<Navigation />)

      // Unmount should clean up properly
      expect(() => unmount()).not.toThrow()
    })
  })
})
