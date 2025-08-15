// Landing page constants and configuration

// Site configuration
export const SITE_CONFIG = {
  name: 'Reading Management App',
  description: '意図的読書で学習効果を最大化',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/images/og-image.jpg',
  author: 'Reading Management Team',
} as const

// Page metadata
export const LANDING_PAGE_META = {
  title: '意図的読書で学習効果を最大化 | Reading Management App',
  description:
    'メンタルマップ機能で読書前の意図を整理し、効果的な読書をサポート。読書管理、統計分析で学習効果を最大化しましょう。',
  keywords: [
    '読書管理',
    'メンタルマップ',
    '学習効果',
    '読書記録',
    '統計分析',
    '意図的読書',
    '知識管理',
    'ブックレビュー',
  ],
  openGraph: {
    title: '意図的読書で学習効果を最大化',
    description: 'メンタルマップ機能で読書前の意図を整理し、効果的な読書をサポート',
    type: 'website',
    locale: 'ja_JP',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Reading Management App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '意図的読書で学習効果を最大化',
    description: 'メンタルマップ機能で読書前の意図を整理し、効果的な読書をサポート',
    images: ['/images/twitter-image.jpg'],
  },
} as const

// CTA button texts and URLs
export const CTA_CONFIG = {
  primary: {
    text: '無料で始める',
    url: '/sign-up',
    variant: 'default' as const,
  },
  secondary: {
    text: 'ログイン',
    url: '/sign-in',
    variant: 'outline' as const,
  },
  pricing: {
    text: '詳しく見る',
    url: '#pricing',
    variant: 'ghost' as const,
  },
} as const

// Navigation configuration
export const NAVIGATION_CONFIG = {
  brand: {
    name: 'Reading Management',
    url: '/',
    logo: '/images/logo.svg',
  },
  links: [
    { name: '機能', href: '#features', external: false },
    { name: '価値', href: '#value-proposition', external: false },
    { name: '料金', href: '#pricing', external: false },
    { name: 'FAQ', href: '#faq', external: false },
  ],
  mobileBreakpoint: 768,
  stickyOffset: 100,
} as const

// Animation configuration
export const ANIMATION_CONFIG = {
  durations: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    xSlow: 0.8,
  },
  easing: {
    easeOut: [0.0, 0.0, 0.2, 1],
    easeInOut: [0.4, 0.0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
  },
  delays: {
    stagger: 0.1,
    section: 0.2,
    hero: 0.5,
  },
  spring: {
    type: 'spring',
    damping: 25,
    stiffness: 400,
  },
} as const

// Framer Motion variants
export const MOTION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  staggerContainer: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: ANIMATION_CONFIG.delays.stagger,
      },
    },
  },
} as const

// Intersection Observer configuration
export const INTERSECTION_CONFIG = {
  threshold: 0.1,
  rootMargin: '-10% 0px -10% 0px',
  triggerOnce: true,
} as const

// Responsive breakpoints
export const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const

// Icon mapping for features and components
export const ICON_MAP = {
  // Feature icons
  brain: 'Brain',
  'book-open': 'BookOpen',
  'trending-up': 'TrendingUp',
  users: 'Users',
  book: 'Book',
  analytics: 'BarChart3',
  'mind-map': 'Network',
  'book-management': 'BookMarked',

  // Navigation icons
  menu: 'Menu',
  close: 'X',
  external: 'ExternalLink',

  // Social proof icons
  star: 'Star',
  'star-filled': 'Star',
  quote: 'Quote',

  // CTA and action icons
  'arrow-right': 'ArrowRight',
  'arrow-down': 'ArrowDown',
  check: 'Check',
  'check-circle': 'CheckCircle',

  // FAQ and utility icons
  search: 'Search',
  'chevron-down': 'ChevronDown',
  'chevron-up': 'ChevronUp',
  info: 'Info',
  'help-circle': 'HelpCircle',
} as const

// Layout spacing
export const SPACING_CONFIG = {
  section: {
    mobile: 'py-12 sm:py-16',
    tablet: 'py-16 sm:py-20',
    desktop: 'py-20 sm:py-24 md:py-28',
  },
  container: {
    padding: 'px-4 xs:px-6 sm:px-8 lg:px-12',
    maxWidth: 'max-w-7xl mx-auto',
    narrow: 'max-w-4xl mx-auto',
    wide: 'max-w-screen-2xl mx-auto',
  },
  grid: {
    gap: 'gap-4 sm:gap-6 lg:gap-8',
    columns: {
      features: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      testimonials: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      pricing: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      stats: 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-3',
      footer: 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    },
  },
  touch: {
    target: 'min-h-[44px] min-w-[44px]', // WCAG AAA recommendation
    padding: 'p-3 sm:p-4',
    margin: 'm-2 sm:m-3',
  },
} as const

// Typography configuration
export const TYPOGRAPHY_CONFIG = {
  headings: {
    h1: 'text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight',
    h2: 'text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight',
    h3: 'text-xl xs:text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight',
    h4: 'text-lg xs:text-xl sm:text-2xl md:text-3xl font-semibold leading-tight',
  },
  body: {
    large: 'text-base xs:text-lg sm:text-xl md:text-2xl leading-relaxed',
    base: 'text-sm xs:text-base sm:text-lg leading-relaxed',
    small: 'text-xs xs:text-sm sm:text-base leading-relaxed',
  },
  colors: {
    primary: 'text-foreground',
    secondary: 'text-muted-foreground',
    accent: 'text-primary',
  },
} as const

// Performance configuration
export const PERFORMANCE_CONFIG = {
  // Core Web Vitals targets
  vitals: {
    lcp: 2500, // ms
    fid: 100, // ms
    cls: 0.1, // score
  },
  // Image optimization
  images: {
    quality: 85,
    formats: ['webp', 'avif'],
    sizes: {
      hero: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      feature: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px',
      avatar: '(max-width: 768px) 60px, 80px',
    },
  },
  // Animation performance
  animation: {
    reducedMotion: '(prefers-reduced-motion: reduce)',
    gpu: {
      willChange: 'transform',
      transform: 'translateZ(0)',
    },
  },
} as const

// Error messages
export const ERROR_MESSAGES = {
  generic: 'エラーが発生しました。しばらく待ってから再度お試しください。',
  network: 'ネットワークエラーが発生しました。接続を確認してください。',
  validation: '入力内容に誤りがあります。確認してください。',
  notFound: 'お探しのページが見つかりませんでした。',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  registration: 'アカウントが正常に作成されました。',
  login: 'ログインしました。',
  inquiry: 'お問い合わせを送信しました。',
} as const

// Feature flags (for development/testing)
export const FEATURE_FLAGS = {
  enableAnimations: true,
  enableTestimonials: true,
  enableAnalytics: true,
  enableA11y: true,
  enablePerformanceMonitoring: true,
} as const

// Development configuration
export const DEV_CONFIG = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
} as const
