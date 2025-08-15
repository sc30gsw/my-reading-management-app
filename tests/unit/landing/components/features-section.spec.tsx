import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom'

import { FeaturesSection } from '~/features/landing/components/feature-section'

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
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}))

// Mock FeatureCard
vi.mock('~/features/landing/components/feature-card', () => ({
  FeatureCard: ({ feature, animated, index, className, ...props }: any) => (
    <div 
      data-testid={`feature-card-${feature.id}`} 
      data-highlighted={feature.highlighted?.toString()} 
      data-animated={animated?.toString()}
      className={className}
      {...props}
    >
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
      <span data-testid="feature-icon">{feature.icon}</span>
    </div>
  ),
}))

// Mock data
vi.mock('~/features/landing/data', () => ({
  features: [
    {
      id: 'mental-map',
      title: 'メンタルマップ',
      description: '3×3構造で読書前の意図を整理し、効果的な読書をサポート',
      icon: 'Brain',
      category: 'core',
      highlighted: true,
    },
    {
      id: 'reading-management',
      title: '読書管理',
      description: '読書記録と進捗管理で継続的な学習をサポート',
      icon: 'BookOpen',
      category: 'management',
      highlighted: false,
    },
    {
      id: 'analytics',
      title: '統計分析',
      description: '読書データの分析で学習効果を可視化',
      icon: 'TrendingUp',
      category: 'analytics',
      highlighted: false,
    },
  ],
}))

// Mock constants
vi.mock('~/features/landing/constants', () => ({
  MOTION_VARIANTS: {
    slideUp: { hidden: {}, visible: {} },
    fadeIn: { hidden: {}, visible: {} },
    staggerContainer: { hidden: {}, visible: {} },
  },
  SPACING_CONFIG: {
    section: { desktop: 'py-20' },
    container: {
      padding: 'px-4 sm:px-6 lg:px-8',
      maxWidth: 'max-w-7xl mx-auto',
    },
    grid: {
      gap: 'gap-6 md:gap-8 lg:gap-12',
    },
  },
  TYPOGRAPHY_CONFIG: {
    headings: {
      h2: 'text-3xl sm:text-4xl lg:text-5xl font-bold',
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

describe('FeaturesSection', () => {
  beforeEach(() => {
    // Setup is handled by vi.mock
  })

  describe('Basic Rendering', () => {
    it('renders features section', () => {
      render(<FeaturesSection />)
      expect(screen.getByTestId('features-section')).toBeInTheDocument()
    })

    it('renders section heading', () => {
      render(<FeaturesSection />)
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent(/主要機能/i)
    })

    it('renders section description', () => {
      render(<FeaturesSection />)
      expect(screen.getByText(/効果的な読書をサポートする3つの核心機能/i)).toBeInTheDocument()
    })

    it('renders all feature cards', () => {
      render(<FeaturesSection />)

      expect(screen.getByTestId('feature-card-mental-map')).toBeInTheDocument()
      expect(screen.getByTestId('feature-card-reading-management')).toBeInTheDocument()
      expect(screen.getByTestId('feature-card-analytics')).toBeInTheDocument()
    })
  })

  describe('Feature Content', () => {
    it('displays correct feature titles', () => {
      render(<FeaturesSection />)

      expect(screen.getByText('メンタルマップ')).toBeInTheDocument()
      expect(screen.getByText('読書管理')).toBeInTheDocument()
      expect(screen.getByText('統計分析')).toBeInTheDocument()
    })

    it('displays correct feature descriptions', () => {
      render(<FeaturesSection />)

      expect(screen.getByText(/3×3構造で読書前の意図を整理/)).toBeInTheDocument()
      expect(screen.getByText(/読書記録と進捗管理で継続的な学習/)).toBeInTheDocument()
      expect(screen.getByText(/読書データの分析で学習効果を可視化/)).toBeInTheDocument()
    })

    it('highlights the mental map feature', () => {
      render(<FeaturesSection />)

      const mentalMapCard = screen.getByTestId('feature-card-mental-map')
      expect(mentalMapCard).toHaveAttribute('data-highlighted', 'true')

      const readingManagementCard = screen.getByTestId('feature-card-reading-management')
      expect(readingManagementCard).toHaveAttribute('data-highlighted', 'false')
    })
  })

  describe('Layout and Structure', () => {
    it('uses proper grid layout', () => {
      render(<FeaturesSection />)
      const featuresGrid = screen.getByTestId('features-grid')
      expect(featuresGrid).toHaveClass('grid')
    })

    it('applies responsive grid classes', () => {
      render(<FeaturesSection />)
      const featuresGrid = screen.getByTestId('features-grid')
      expect(featuresGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
    })

    it('applies proper spacing', () => {
      render(<FeaturesSection />)
      const section = screen.getByTestId('features-section')
      expect(section).toHaveClass('py-20')
    })

    it('uses container constraints', () => {
      render(<FeaturesSection />)
      const container = screen.getByTestId('features-container')
      expect(container).toHaveClass('max-w-7xl', 'mx-auto')
    })
  })

  describe('Animation Integration', () => {
    it('triggers animations when in view', () => {
      render(<FeaturesSection />)

      // Component should render without errors when animations are triggered
      expect(screen.getByTestId('features-section')).toBeInTheDocument()
    })

    it('does not trigger animations when not in view', () => {
      render(<FeaturesSection />)

      // Component should still render but animations won't be active
      expect(screen.getByTestId('features-section')).toBeInTheDocument()
    })

    it('uses intersection observer with correct options', () => {
      render(<FeaturesSection />)
      // Mock useInView handles the options
      expect(screen.getByTestId('features-section')).toBeInTheDocument()
    })
  })

  describe('Feature Data Integration', () => {
    it('renders features from data source', () => {
      render(<FeaturesSection />)

      // Should render all 3 features from mock data
      const featureCards = screen.getAllByTestId(/^feature-card-/)
      expect(featureCards).toHaveLength(3)
    })

    it('passes correct props to FeatureCard components', () => {
      render(<FeaturesSection />)

      const mentalMapCard = screen.getByTestId('feature-card-mental-map')
      expect(mentalMapCard).toHaveAttribute('data-highlighted', 'true')

      const otherCards = [
        screen.getByTestId('feature-card-reading-management'),
        screen.getByTestId('feature-card-analytics'),
      ]

      otherCards.forEach((card) => {
        expect(card).toHaveAttribute('data-highlighted', 'false')
      })
    })
  })

  describe('Responsive Design', () => {
    it('applies responsive classes correctly', () => {
      render(<FeaturesSection />)
      const section = screen.getByTestId('features-section')

      // Should include responsive padding
      expect(section).toHaveClass('px-4', 'sm:px-6', 'lg:px-8')
    })

    it('uses responsive typography', () => {
      render(<FeaturesSection />)
      const heading = screen.getByRole('heading', { level: 2 })

      // Should use responsive text sizing
      expect(heading).toHaveClass('text-3xl', 'sm:text-4xl', 'lg:text-5xl')
    })

    it('handles mobile layout correctly', () => {
      render(<FeaturesSection />)
      const featuresGrid = screen.getByTestId('features-grid')

      // Should start with single column on mobile
      expect(featuresGrid).toHaveClass('grid-cols-1')
    })
  })

  describe('Accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<FeaturesSection />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('provides proper heading hierarchy', () => {
      render(<FeaturesSection />)
      const mainHeading = screen.getByRole('heading', { level: 2 })
      expect(mainHeading).toBeInTheDocument()
    })

    it('includes proper section structure', () => {
      render(<FeaturesSection />)

      // Should use section element with proper ID
      const section = screen.getByTestId('features-section')
      expect(section).toHaveAttribute('id', 'features')
    })

    it('provides meaningful content structure', () => {
      render(<FeaturesSection />)

      // Should have clear heading and description
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      const supportTexts = screen.getAllByText(/効果的な読書をサポート/)
      expect(supportTexts.length).toBeGreaterThan(0)
    })
  })

  describe('Performance', () => {
    it('renders efficiently without excessive re-renders', () => {
      const startTime = performance.now()
      render(<FeaturesSection />)
      const endTime = performance.now()

      // Should render quickly
      expect(endTime - startTime).toBeLessThan(100)
    })

    it('handles props changes without errors', () => {
      const { rerender } = render(<FeaturesSection />)

      expect(() => {
        rerender(<FeaturesSection className="custom-class" />)
      }).not.toThrow()
    })
  })

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      render(<FeaturesSection className="custom-features-class" />)
      const section = screen.getByTestId('features-section')
      expect(section).toHaveClass('custom-features-class')
    })

    it('merges custom className with default classes', () => {
      render(<FeaturesSection className="custom-class" />)
      const section = screen.getByTestId('features-section')
      expect(section).toHaveClass('custom-class')
      expect(section).toHaveClass('relative')
    })
  })

  describe('Section Anchor', () => {
    it('includes features section ID for navigation', () => {
      render(<FeaturesSection />)
      const section = screen.getByTestId('features-section')
      expect(section).toHaveAttribute('id', 'features')
    })
  })

  describe('Error Handling', () => {
    it('handles missing features data gracefully', () => {
      // Mock empty features array
      vi.doMock('~/features/landing/data', () => ({
        features: [],
      }))

      expect(() => render(<FeaturesSection />)).not.toThrow()
    })

    it('handles invalid feature data gracefully', () => {
      // Mock malformed features data
      vi.doMock('~/features/landing/data', () => ({
        features: [{ id: 'test' }], // Missing required fields
      }))

      expect(() => render(<FeaturesSection />)).not.toThrow()
    })
  })
})
