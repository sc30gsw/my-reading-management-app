import { z } from 'zod/v4'

// Landing page statistics
export type LandingStats = {
  userCount: number
  bookCount: number
  mentalMapCount: number
  activeUsers: number
  booksTracked: number
  effectivenessRate: number
  updatedAt: Date
}

export const LandingStatsSchema = z.object({
  userCount: z.number().min(0),
  bookCount: z.number().min(0),
  mentalMapCount: z.number().min(0),
  activeUsers: z.number().min(0),
  booksTracked: z.number().min(0),
  effectivenessRate: z.number().min(0).max(100),
  updatedAt: z.date(),
})

// Feature definition
export type Feature = {
  id: string
  title: string
  description: string
  icon: string
  category: string
  highlighted?: boolean
}

export const FeatureSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  category: z.string().min(1),
  highlighted: z.boolean().optional(),
})

// Testimonial definition
export type Testimonial = {
  id: string
  userName: string
  content: string
  rating: number
  avatarUrl?: string
  avatar?: string // alias for avatarUrl
  author: string
  role?: string
  company?: string
}

export const TestimonialSchema = z.object({
  id: z.string().min(1),
  userName: z.string().min(1),
  content: z.string().min(1),
  rating: z.number().min(1).max(5),
  avatarUrl: z.string().url().optional(),
  avatar: z.string().url().optional(), // alias for avatarUrl
  author: z.string().min(1),
  role: z.string().optional(),
  company: z.string().optional(),
})

// FAQ item definition
export type FAQItem = {
  id: string
  question: string
  answer: string
  category: string
  priority?: number
}

export const FAQItemSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().min(1),
  priority: z.number().min(1).optional(),
})

// Value proposition definition
export type ValueProposition = {
  id: string
  title: string
  description?: string
  before: string
  after: string
  icon: string
  statistic?: {
    value: number
    unit: string
    trend: 'up' | 'down' | 'stable'
  }
}

export const ValuePropositionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  before: z.string().min(1),
  after: z.string().min(1),
  icon: z.string().min(1),
  statistic: z
    .object({
      value: z.number(),
      unit: z.string().min(1),
      trend: z.enum(['up', 'down', 'stable']),
    })
    .optional(),
})

// Pricing plan definition
export type PricingPlan = {
  id: string
  name: string
  price: {
    monthly: number
    yearly: number
  }
  features: string[]
  limitations?: string[]
  highlighted?: boolean
  ctaText: string
  ctaUrl: string
}

export const PricingPlanSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.object({
    monthly: z.number().min(0),
    yearly: z.number().min(0),
  }),
  features: z.array(z.string().min(1)),
  limitations: z.array(z.string().min(1)).optional(),
  highlighted: z.boolean().optional(),
  ctaText: z.string().min(1),
  ctaUrl: z.string().min(1),
})

// Component Props Types

export type HeroSectionProps = {
  className?: string
  variant?: 'default' | 'compact'
}

export type FeaturesSectionProps = {
  className?: string
  features?: Feature[]
  animated?: boolean
}

export type FeatureCardProps = {
  feature: Feature
  index?: number
  animated?: boolean
  className?: string
  highlighted?: boolean
}

export type ValuePropositionSectionProps = {
  className?: string
  valuePropositions?: ValueProposition[]
  showStatistics?: boolean
  showStats?: boolean
  animateOnScroll?: boolean
  animated?: boolean
}

export type SocialProofSectionProps = {
  className?: string
  stats?: LandingStats
  testimonials?: Testimonial[]
  autoPlay?: boolean
  showStats?: boolean
  animated?: boolean
}

export type TestimonialCarouselProps = {
  testimonials: Testimonial[]
  autoPlay?: boolean
  className?: string
}

export type PricingSectionProps = {
  className?: string
  plans?: PricingPlan[]
  highlightFreePlan?: boolean
}

export type FAQSectionProps = {
  className?: string
  faqItems?: FAQItem[]
  searchable?: boolean
  categories?: string[]
  showSearch?: boolean
  showCategories?: boolean
  animated?: boolean
  defaultOpenItems?: string[]
}

export type FAQSearchProps = {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export type NavigationProps = {
  className?: string
  sticky?: boolean
  showAuthButtons?: boolean
}

// Landing page main component props
export type LandingPageProps = {
  className?: string
  stats?: LandingStats
  features?: Feature[]
  valuePropositions?: ValueProposition[]
  testimonials?: Testimonial[]
  faqItems?: FAQItem[]
  pricingPlans?: PricingPlan[]
}

// Animation variant types
export type AnimationVariant = 'fadeIn' | 'slideUp' | 'slideInLeft' | 'slideInRight' | 'scaleIn'

export type AnimationConfig = {
  variant: AnimationVariant
  delay?: number
  duration?: number
  stagger?: number
}

// Utility types
export type IconName = string
export type BreakpointSize = 'mobile' | 'tablet' | 'desktop'
export type ThemeColor = 'primary' | 'secondary' | 'accent' | 'muted'

// Form types for search functionality
export type SearchState = {
  query: string
  filteredItems: FAQItem[]
  activeCategory?: string
}

// Scroll and intersection observer hook types
export type UseInViewOptions = {
  threshold?: number | number[]
  rootMargin?: string
  triggerOnce?: boolean
}

export type UseCountAnimationOptions = {
  duration?: number
  delay?: number
  easing?: string
}

export type UseScrollPositionOptions = {
  threshold?: number
  element?: Element | null
}

// Statistics display configuration
export type StatisticCon = {
  label: string
  value: number
  unit?: string
  icon?: IconName
  animated?: boolean
}

// Export validation schemas as a group
export const LandingPageSchemas = {
  LandingStats: LandingStatsSchema,
  Feature: FeatureSchema,
  Testimonial: TestimonialSchema,
  FAQItem: FAQItemSchema,
  ValueProposition: ValuePropositionSchema,
  PricingPlan: PricingPlanSchema,
} as const

// Type guards for runtime validation
export const isLandingStats = (obj: unknown): obj is LandingStats => {
  return LandingStatsSchema.safeParse(obj).success
}

export const isFeature = (obj: unknown): obj is Feature => {
  return FeatureSchema.safeParse(obj).success
}

export const isTestimonial = (obj: unknown): obj is Testimonial => {
  return TestimonialSchema.safeParse(obj).success
}

export const isFAQItem = (obj: unknown): obj is FAQItem => {
  return FAQItemSchema.safeParse(obj).success
}

export const isValueProposition = (obj: unknown): obj is ValueProposition => {
  return ValuePropositionSchema.safeParse(obj).success
}

export const isPricingPlan = (obj: unknown): obj is PricingPlan => {
  return PricingPlanSchema.safeParse(obj).success
}
