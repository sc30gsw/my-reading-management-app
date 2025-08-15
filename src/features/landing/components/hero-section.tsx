'use client'

import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Brain } from 'lucide-react'
import { MOTION_VARIANTS, SPACING_CONFIG, TYPOGRAPHY_CONFIG } from '~/features/landing/constants'
import { useInView } from '~/features/landing/hooks/use-in-view'
import type { HeroSectionProps } from '~/features/landing/types'
import { cn } from '~/features/landing/utils'
import { CTAButtonGroup } from './cta-button'

export function HeroSection({ className, variant = 'default' }: HeroSectionProps) {
  const { ref, isInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  const isCompact = variant === 'compact'

  return (
    <section
      ref={ref}
      data-testid="hero-section"
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/30',
        SPACING_CONFIG.section.desktop,
        SPACING_CONFIG.container.padding,
        className,
      )}
    >
      <div className={cn('relative', SPACING_CONFIG.container.maxWidth)}>
        <div
          className={cn(
            'grid gap-8 lg:gap-12',
            isCompact ? 'text-center lg:grid-cols-1' : 'lg:grid-cols-2 lg:items-center',
          )}
        >
          {/* Content */}
          <motion.div
            data-testid="hero-content"
            className={cn('space-y-6', !isCompact && 'lg:order-1')}
            variants={MOTION_VARIANTS.slideInLeft}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Main Heading */}
            <motion.h1
              data-testid="hero-title"
              className={cn(
                TYPOGRAPHY_CONFIG.headings.h1,
                TYPOGRAPHY_CONFIG.colors.primary,
                'leading-tight',
              )}
              variants={MOTION_VARIANTS.slideUp}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              意図的読書で
              <span className="block text-blue-600">学習効果を最大化</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              data-testid="hero-description"
              className={cn(
                TYPOGRAPHY_CONFIG.body.large,
                TYPOGRAPHY_CONFIG.colors.secondary,
                'max-w-2xl leading-relaxed',
              )}
              variants={MOTION_VARIANTS.slideUp}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              3×3構造のメンタルマップで読書前の意図を整理し、効果的な読書をサポート。
              読書管理、統計分析機能で継続的な学習改善を実現します。
            </motion.p>

            {/* Key Features Highlights */}
            <motion.div
              className="flex flex-wrap gap-4 text-slate-600 text-sm"
              variants={MOTION_VARIANTS.slideUp}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-600" />
                <span>メンタルマップ</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span>読書管理</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-blue-600" />
                <span>成長の記録</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              data-testid="hero-cta-group"
              className="flex flex-col gap-4 sm:flex-row"
              variants={MOTION_VARIANTS.slideUp}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <CTAButtonGroup
                primary={{
                  action: 'register',
                  size: 'xl',
                  trackingId: 'hero-primary',
                  className: 'shadow-lg hover:shadow-xl',
                }}
                secondary={{
                  action: 'demo',
                  size: 'xl',
                  variant: 'outline',
                  text: '機能を見る',
                  href: '#features',
                  trackingId: 'hero-secondary',
                }}
              />
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex items-center gap-6 text-slate-500 text-sm"
              variants={MOTION_VARIANTS.fadeIn}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span>完全無料で開始</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span>クレジットカード不要</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          {!isCompact && (
            <motion.div
              data-testid="hero-visual"
              className="relative lg:order-2"
              variants={MOTION_VARIANTS.slideInRight}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                {/* Main Hero Image */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 shadow-2xl">
                  {/* Placeholder for hero image - will be replaced with actual image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="space-y-4 text-center">
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-600/20">
                        <Brain className="h-12 w-12 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="font-semibold text-lg text-slate-700">
                          メンタルマップ作成
                        </div>
                        <div className="text-slate-500 text-sm">3×3構造で読書意図を整理</div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    className="absolute top-4 right-4 rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur-sm"
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="font-medium">+85% 理解度向上</span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute bottom-4 left-4 rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur-sm"
                    animate={{
                      y: [0, 8, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 1,
                    }}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">1,247名が利用中</span>
                    </div>
                  </motion.div>
                </div>

                {/* Background Decorations */}
                <div className="-top-4 -right-4 absolute h-24 w-24 rounded-full bg-yellow-200/30 blur-xl" />
                <div className="-bottom-6 -left-6 absolute h-32 w-32 rounded-full bg-blue-200/30 blur-xl" />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Background Pattern */}
      <div className="-z-10 absolute inset-0">
        <div className="-translate-y-32 absolute top-0 right-0 h-96 w-96 translate-x-32 transform rounded-full bg-blue-200/20 blur-3xl" />
        <div className="-translate-x-32 absolute bottom-0 left-0 h-96 w-96 translate-y-32 transform rounded-full bg-indigo-200/20 blur-3xl" />
      </div>
    </section>
  )
}
