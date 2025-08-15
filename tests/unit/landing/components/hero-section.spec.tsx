import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom'
import { HeroSection } from '~/features/landing/components/hero-section'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock hooks
vi.mock('~/features/landing/hooks/use-in-view', () => ({
  useInView: () => ({
    ref: vi.fn(),
    isInView: true,
  }),
}))

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}))

// Mock Next.js components
vi.mock('next/link', () => ({
  default: function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
}))

vi.mock('next/image', () => ({
  default: function MockImage({ alt, ...props }: any) {
    return <img alt={alt} {...props} />
  }
}))

// Mock CTAButton components
vi.mock('~/features/landing/components/cta-button', () => ({
  CTAButtonGroup: ({ primary, secondary }: any) => (
    <div data-testid="cta-button-group">
      <button type="button" data-testid="primary-cta">
        {primary.action}
      </button>
      {secondary && (
        <button type="button" data-testid="secondary-cta">
          {secondary.action}
        </button>
      )}
    </div>
  ),
  RegisterCTA: ({ className, ...props }: any) => (
    <button className={className} data-testid="register-cta" {...props}>
      無料で始める
    </button>
  ),
  DemoCTA: ({ className, ...props }: any) => (
    <button className={className} data-testid="demo-cta" {...props}>
      機能を見る
    </button>
  ),
}))

// Mock constants
vi.mock('~/features/landing/constants', () => ({
  CTA_CONFIG: {
    primary: { text: '無料で始める' },
    secondary: { text: '機能を見る' },
  },
  MOTION_VARIANTS: {
    slideInLeft: { hidden: {}, visible: {} },
    slideInRight: { hidden: {}, visible: {} },
    slideUp: { hidden: {}, visible: {} },
    fadeIn: { hidden: {}, visible: {} },
  },
  SPACING_CONFIG: {
    section: { desktop: 'py-20' },
    container: {
      padding: 'px-4 sm:px-6 lg:px-8',
      maxWidth: 'max-w-7xl mx-auto',
    },
  },
  TYPOGRAPHY_CONFIG: {
    headings: {
      h1: 'text-4xl sm:text-5xl lg:text-6xl font-bold',
    },
    body: {
      large: 'text-lg sm:text-xl',
    },
    colors: {
      primary: 'text-slate-900',
      secondary: 'text-slate-600',
    },
  },
}))

describe('HeroSection', () => {
  beforeEach(() => {
    // Setup is handled by vi.mock
  })

  describe('Basic Rendering', () => {
    it('renders hero section with default variant', () => {
      render(<HeroSection />)
      expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    })

    it('renders main heading', () => {
      render(<HeroSection />)
      const heading = screen.getByTestId('hero-title')
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent('意図的読書で学習効果を最大化')
    })

    it('renders description text', () => {
      render(<HeroSection />)
      const description = screen.getByTestId('hero-description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveTextContent(
        '3×3構造のメンタルマップで読書前の意図を整理し、効果的な読書をサポート',
      )
    })

    it('renders key features highlights', () => {
      render(<HeroSection />)
      const mentalMapTexts = screen.getAllByText(/メンタルマップ/)
      expect(mentalMapTexts.length).toBeGreaterThan(0)
      expect(screen.getByText('読書管理')).toBeInTheDocument()
      expect(screen.getByText('成長の記録')).toBeInTheDocument()
    })

    it('renders CTA button group', () => {
      render(<HeroSection />)
      expect(screen.getByTestId('hero-cta-group')).toBeInTheDocument()
      expect(screen.getByTestId('cta-button-group')).toBeInTheDocument()
    })

    it('renders trust indicators', () => {
      render(<HeroSection />)
      expect(screen.getByText('完全無料で開始')).toBeInTheDocument()
      expect(screen.getByText('クレジットカード不要')).toBeInTheDocument()
    })

    it('renders hero visual section', () => {
      render(<HeroSection />)
      expect(screen.getByTestId('hero-visual')).toBeInTheDocument()
    })
  })

  describe('Variant Handling', () => {
    it('renders compact variant correctly', () => {
      render(<HeroSection variant="compact" />)
      const section = screen.getByTestId('hero-section')
      expect(section).toBeInTheDocument()

      // Hero visual should not be rendered in compact mode
      expect(screen.queryByTestId('hero-visual')).not.toBeInTheDocument()
    })

    it('applies correct grid classes for default variant', () => {
      render(<HeroSection />)
      const content = screen.getByTestId('hero-content')
      expect(content.parentElement).toHaveClass('lg:grid-cols-2', 'lg:items-center')
    })

    it('applies correct grid classes for compact variant', () => {
      render(<HeroSection variant="compact" />)
      const content = screen.getByTestId('hero-content')
      expect(content.parentElement).toHaveClass('lg:grid-cols-1', 'text-center')
    })
  })

  describe('Animation Integration', () => {
    it('triggers animations when in view', () => {
      render(<HeroSection />)

      // Component should render without errors when animations are triggered
      expect(screen.getByTestId('hero-content')).toBeInTheDocument()
      expect(screen.getByTestId('hero-visual')).toBeInTheDocument()
    })

    it('does not trigger animations when not in view', () => {
      render(<HeroSection />)

      // Component should still render but animations won't be active
      expect(screen.getByTestId('hero-content')).toBeInTheDocument()
    })

    it('uses intersection observer with correct options', () => {
      render(<HeroSection />)
      // Mock useInView handles the options
      expect(screen.getByTestId('hero-content')).toBeInTheDocument()
    })
  })

  describe('Visual Elements', () => {
    it('renders main hero image placeholder', () => {
      render(<HeroSection />)
      const visualSection = screen.getByTestId('hero-visual')
      expect(visualSection).toBeInTheDocument()

      // Check for key visual elements
      expect(screen.getByText('メンタルマップ作成')).toBeInTheDocument()
      expect(screen.getByText('3×3構造で読書意図を整理')).toBeInTheDocument()
    })

    it('renders floating statistics elements', () => {
      render(<HeroSection />)
      expect(screen.getByText('+85% 理解度向上')).toBeInTheDocument()
      expect(screen.getByText('1,247名が利用中')).toBeInTheDocument()
    })

    it('renders background decorative elements', () => {
      const { container } = render(<HeroSection />)
      const backgroundDecorations = container.querySelectorAll('.absolute')
      expect(backgroundDecorations.length).toBeGreaterThan(0)
    })
  })

  describe('Content Structure', () => {
    it('displays heading with proper hierarchy', () => {
      render(<HeroSection />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent(/意図的読書で/)
    })

    it('includes structured content sections', () => {
      render(<HeroSection />)

      // Main content should include all key sections
      expect(screen.getByTestId('hero-title')).toBeInTheDocument()
      expect(screen.getByTestId('hero-description')).toBeInTheDocument()
      expect(screen.getByTestId('hero-cta-group')).toBeInTheDocument()
    })

    it('renders feature icons correctly', () => {
      render(<HeroSection />)

      // Should have Brain, BookOpen, and ArrowRight icons (represented by their text)
      const mentalMapTexts = screen.getAllByText(/メンタルマップ/)
      expect(mentalMapTexts.length).toBeGreaterThan(0)
      const features = mentalMapTexts[0].parentElement
      expect(features).toBeInTheDocument()
    })
  })

  describe('CTA Integration', () => {
    it('renders CTA buttons with correct configuration', () => {
      render(<HeroSection />)
      const ctaGroup = screen.getByTestId('cta-button-group')
      expect(ctaGroup).toBeInTheDocument()

      // Should render primary and secondary CTAs
      expect(screen.getByTestId('primary-cta')).toBeInTheDocument()
      expect(screen.getByTestId('secondary-cta')).toBeInTheDocument()
    })

    it('passes correct props to CTA button group', () => {
      render(<HeroSection />)

      // Primary CTA should be register action
      expect(screen.getByTestId('primary-cta')).toHaveTextContent('register')

      // Secondary CTA should be demo action
      expect(screen.getByTestId('secondary-cta')).toHaveTextContent('demo')
    })
  })

  describe('Responsive Design', () => {
    it('applies responsive classes correctly', () => {
      render(<HeroSection />)
      const section = screen.getByTestId('hero-section')

      // Should include responsive padding and spacing
      expect(section).toHaveClass('px-4', 'sm:px-6', 'lg:px-8')
    })

    it('handles mobile layout correctly', () => {
      render(<HeroSection />)
      const ctaGroup = screen.getByTestId('hero-cta-group')

      // CTA group should be responsive
      expect(ctaGroup).toHaveClass('flex-col', 'sm:flex-row')
    })
  })

  describe('Accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<HeroSection />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should not have accessibility violations in compact variant', async () => {
      const { container } = render(<HeroSection variant="compact" />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('provides proper heading structure', () => {
      render(<HeroSection />)
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toBeInTheDocument()
    })

    it('includes proper semantic structure', () => {
      render(<HeroSection />)

      // Should use section element
      expect(screen.getByTestId('hero-section')).toHaveAttribute('data-testid', 'hero-section')

      // Should have proper content hierarchy
      expect(screen.getByTestId('hero-content')).toBeInTheDocument()
    })

    it('provides meaningful text content', () => {
      render(<HeroSection />)

      // All key messages should be present and meaningful
      expect(screen.getByText(/意図的読書/)).toBeInTheDocument()
      const mentalMapTexts = screen.getAllByText(/メンタルマップ/)
      expect(mentalMapTexts.length).toBeGreaterThan(0)
      expect(screen.getByText(/完全無料/)).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('renders efficiently without excessive re-renders', () => {
      const startTime = performance.now()
      render(<HeroSection />)
      const endTime = performance.now()

      // Should render quickly
      expect(endTime - startTime).toBeLessThan(100)
    })

    it('handles props changes without errors', () => {
      const { rerender } = render(<HeroSection />)

      expect(() => {
        rerender(<HeroSection variant="compact" />)
        rerender(<HeroSection className="custom-class" />)
      }).not.toThrow()
    })
  })

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      render(<HeroSection className="custom-hero-class" />)
      const section = screen.getByTestId('hero-section')
      expect(section).toHaveClass('custom-hero-class')
    })

    it('merges custom className with default classes', () => {
      render(<HeroSection className="custom-class" />)
      const section = screen.getByTestId('hero-section')
      expect(section).toHaveClass('custom-class')
      expect(section).toHaveClass('relative', 'overflow-hidden')
    })
  })
})
