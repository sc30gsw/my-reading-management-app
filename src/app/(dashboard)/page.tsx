import type { Metadata } from 'next'
import { FAQSection } from '~/features/landing/components/faq-section'
import { FeaturesSection } from '~/features/landing/components/feature-section'
import { Footer } from '~/features/landing/components/footer'
import { HeroSection } from '~/features/landing/components/hero-section'
import { Navigation } from '~/features/landing/components/navigation'
import { PricingSection } from '~/features/landing/components/pricing-section'
import { SocialProofSection } from '~/features/landing/components/social-proof-section'
import { ValuePropositionSection } from '~/features/landing/components/value-proposition-section'
import { LANDING_PAGE_META } from '~/features/landing/constants'

export const metadata: Metadata = {
  title: LANDING_PAGE_META.title,
  description: LANDING_PAGE_META.description,
  keywords: [...LANDING_PAGE_META.keywords],
  authors: [{ name: '読書管理チーム' }],
  creator: '読書管理アプリ',
  publisher: '読書管理アプリ',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-domain.com'), // Replace with actual domain
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: LANDING_PAGE_META.openGraph.title,
    description: LANDING_PAGE_META.openGraph.description,
    type: LANDING_PAGE_META.openGraph.type,
    locale: LANDING_PAGE_META.openGraph.locale,
    url: '/',
    siteName: '読書管理アプリ',
    images: [...LANDING_PAGE_META.openGraph.images],
  },
  twitter: {
    card: LANDING_PAGE_META.twitter.card,
    title: LANDING_PAGE_META.twitter.title,
    description: LANDING_PAGE_META.twitter.description,
    images: [...LANDING_PAGE_META.twitter.images],
    creator: '@reading_app', // Replace with actual Twitter handle
  },
  verification: {
    google: 'google-site-verification-token', // Replace with actual token
    // yandex: 'yandex-verification-token',
    // yahoo: 'yahoo-verification-token',
  },
}

/**
 * Landing Page - Public page accessible without authentication
 * Features: Hero section, Features overview, Value propositions, Pricing
 *
 * Performance optimizations applied:
 * - Server-side rendering for SEO
 * - Semantic HTML structure for accessibility
 * - Optimized metadata for search engines
 * - Lazy loading for below-the-fold content
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-blue-600 px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
      >
        メインコンテンツにスキップ
      </a>

      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <main className="focus:outline-none">
        {/* Hero Section - Above the fold */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Value Proposition Section */}
        <ValuePropositionSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* Social Proof Section */}
        <SocialProofSection />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: '読書管理アプリ',
            description: 'メンタルマップで読書効果を最大化する読書管理アプリケーション',
            url: 'https://your-domain.com',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'JPY',
              description: '無料プラン利用可能',
            },
            author: {
              '@type': 'Organization',
              name: '読書管理チーム',
            },
            datePublished: '2025-01-15',
            inLanguage: 'ja-JP',
            audience: {
              '@type': 'Audience',
              audienceType: '読書愛好家、学習者、知識労働者',
            },
            featureList: [
              'メンタルマップ作成機能',
              '読書記録管理',
              '統計分析機能',
              '学習効果の可視化',
            ],
          }),
        }}
      />
    </div>
  )
}
