import type {
  FAQItem,
  Feature,
  LandingStats,
  PricingPlan,
  Testimonial,
  ValueProposition,
} from '~/features/landing/types'

// Landing page statistics
export const landingStats: LandingStats = {
  userCount: 1247,
  bookCount: 8932,
  mentalMapCount: 3456,
  activeUsers: 1247,
  booksTracked: 8932,
  effectivenessRate: 85,
  updatedAt: new Date('2024-01-15T10:00:00Z'),
}

// Main features data
export const features: Feature[] = [
  {
    id: 'mental-map',
    title: 'メンタルマップ',
    description:
      '3×3構造で読書前の意図を整理し、効果的な読書をサポート。「なぜ読むか」「何を学びたいか」「どう活用するか」を明確にして、読書の質を飛躍的に向上させます。',
    icon: 'brain',
    category: 'core',
    highlighted: true,
  },
  {
    id: 'reading-management',
    title: '読書管理',
    description:
      '読書記録の作成、進捗管理、レビュー機能を統合。読んだ本、読みたい本、学んだことを体系的に管理し、あなたの知識ライブラリを構築します。',
    icon: 'book-open',
    category: 'management',
    highlighted: false,
  },
  {
    id: 'statistics',
    title: '統計分析',
    description:
      '読書データの可視化と学習パターンの分析。読書時間、理解度、知識の定着率などを数値化し、継続的な学習改善をサポートします。',
    icon: 'trending-up',
    category: 'analytics',
    highlighted: false,
  },
]

// User testimonials
export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    userName: '田中 太郎',
    content:
      'メンタルマップ機能のおかげで、読書の効果が3倍になりました。意図的な読書が習慣になり、知識の定着が格段に向上しています。特に3×3構造での整理方法が画期的です。',
    rating: 5,
    avatarUrl: '/images/avatars/tanaka.jpg',
    author: '田中 太郎',
    role: 'ソフトウェアエンジニア',
    company: 'テック株式会社',
  },
  {
    id: 'testimonial-2',
    userName: '佐藤 花子',
    content:
      '読書管理機能が素晴らしく、今まで曖昧だった読書の成果が明確に見えるようになりました。統計分析で自分の読書パターンも理解できて、学習効率が大幅にアップ！',
    rating: 5,
    avatarUrl: '/images/avatars/sato.jpg',
    author: '佐藤 花子',
    role: 'プロダクトマネージャー',
    company: 'スタートアップ合同会社',
  },
  {
    id: 'testimonial-3',
    userName: '山田 次郎',
    content:
      '統計分析機能で自分の読書パターンが分析でき、より効率的な学習スケジュールを組めるようになりました。データに基づいた読書習慣の改善ができています。',
    rating: 4,
    avatarUrl: '/images/avatars/yamada.jpg',
    author: '山田 次郎',
    role: 'データアナリスト',
    company: '分析コンサルティング',
  },
  {
    id: 'testimonial-4',
    userName: '鈴木 美咲',
    content:
      '読書前にメンタルマップで目的を明確にすることで、同じ時間でも得られる知識量が倍増しました。無料プランでも十分すぎる機能です。',
    rating: 5,
    avatarUrl: '/images/avatars/suzuki.jpg',
    author: '鈴木 美咲',
    role: 'UXデザイナー',
    company: 'デザイン事務所',
  },
]

// FAQ items
export const faqItems: FAQItem[] = [
  {
    id: 'faq-1',
    question: '無料プランではどこまで利用できますか？',
    answer:
      '無料プランでは月に5冊まで読書記録を作成でき、基本的なメンタルマップ機能をご利用いただけます。また、統計分析の基本機能も無料でお使いいただけます。',
    category: '料金・プラン',
    priority: 1,
  },
  {
    id: 'faq-2',
    question: 'メンタルマップとは何ですか？',
    answer:
      '読書前に3×3の構造で「なぜ読むか」「何を学びたいか」「どう活用するか」を整理する機能です。意図的な読書を実現し、学習効果を最大化します。',
    category: '機能について',
    priority: 2,
  },
  {
    id: 'faq-3',
    question: 'データのバックアップは取られていますか？',
    answer:
      'すべてのデータは定期的にバックアップされ、複数の地域に分散して安全に保管されています。万が一の際にも迅速にデータを復旧できます。',
    category: 'セキュリティ',
    priority: 3,
  },
  {
    id: 'faq-4',
    question: 'モバイルアプリはありますか？',
    answer:
      '現在はWebアプリのみですが、レスポンシブデザインによりモバイルでも快適にご利用いただけます。専用アプリは今後のリリース予定です。',
    category: '利用環境',
    priority: 4,
  },
  {
    id: 'faq-5',
    question: '読書記録の共有は可能ですか？',
    answer:
      'プレミアムプランでは読書記録の共有機能をご利用いただけます。学習グループでの知識共有や読書会での活用に最適です。',
    category: '機能について',
    priority: 5,
  },
  {
    id: 'faq-6',
    question: '退会手続きはどのように行いますか？',
    answer:
      'アカウント設定画面から簡単に退会手続きを行えます。退会後もデータの保持期間は30日間あり、その間であれば復旧可能です。',
    category: 'アカウント',
    priority: 6,
  },
]

// Value propositions
export const valuePropositions: ValueProposition[] = [
  {
    id: 'reading-quality',
    title: '読書の質向上',
    before: '漠然とした読書で内容が頭に残らない',
    after: 'メンタルマップによる構造化で深い理解',
    icon: 'book-open',
    statistic: {
      value: 85,
      unit: '%',
      trend: 'up',
    },
  },
  {
    id: 'learning-effectiveness',
    title: '学習効果最大化',
    before: 'ただ読むだけで活用できない知識',
    after: '意図的な読書プロセスで実践的な知識習得',
    icon: 'brain',
    statistic: {
      value: 3,
      unit: '倍',
      trend: 'up',
    },
  },
  {
    id: 'growth-tracking',
    title: '成長の記録',
    before: '読書の成果が見えずモチベーション低下',
    after: '読書履歴の可視化で継続的な成長実感',
    icon: 'trending-up',
    statistic: {
      value: 60,
      unit: '%',
      trend: 'up',
    },
  },
]

// Pricing plans
export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: '無料プラン',
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      '月5冊までの読書記録',
      '基本的なメンタルマップ機能',
      '統計分析（基本）',
      'コミュニティアクセス',
    ],
    limitations: ['読書記録は月5冊まで', '高度な統計機能は利用不可'],
    highlighted: true,
    ctaText: '無料で始める',
    ctaUrl: '/auth/register',
  },
  {
    id: 'premium',
    name: 'プレミアム',
    price: {
      monthly: 980,
      yearly: 9800,
    },
    features: [
      '無制限の読書記録',
      '高度なメンタルマップ機能',
      '詳細な統計分析',
      '読書記録の共有機能',
      'PDFエクスポート',
      '優先サポート',
    ],
    highlighted: false,
    ctaText: 'プレミアムを試す',
    ctaUrl: '/auth/register?plan=premium',
  },
  {
    id: 'team',
    name: 'チームプラン',
    price: {
      monthly: 2980,
      yearly: 29800,
    },
    features: [
      'プレミアムの全機能',
      'チーム管理機能',
      '読書会サポート',
      'グループ統計',
      '専用サポート',
      'カスタマイズ可能',
    ],
    highlighted: false,
    ctaText: 'チームプランを試す',
    ctaUrl: '/contact?plan=team',
  },
]

// Additional data exports for specific use cases

// Featured testimonials (top 3)
export const featuredTestimonials = testimonials.slice(0, 3)

// High priority FAQ items
export const priorityFAQItems = faqItems
  .filter((item) => (item.priority || Infinity) <= 3)
  .sort((a, b) => (a.priority || Infinity) - (b.priority || Infinity))

// FAQ categories
export const faqCategories = Array.from(new Set(faqItems.map((item) => item.category))).sort()

// Statistics for counter animations
export const statisticsConfig = [
  {
    label: 'アクティブユーザー',
    value: landingStats.userCount,
    unit: '人',
    icon: 'users',
    animated: true,
  },
  {
    label: '読書記録数',
    value: landingStats.bookCount,
    unit: '冊',
    icon: 'book',
    animated: true,
  },
  {
    label: 'メンタルマップ作成数',
    value: landingStats.mentalMapCount,
    unit: '個',
    icon: 'brain',
    animated: true,
  },
]

// Export all data as default
export default {
  landingStats,
  features,
  testimonials,
  faqItems,
  valuePropositions,
  pricingPlans,
  featuredTestimonials,
  priorityFAQItems,
  faqCategories,
  statisticsConfig,
}
