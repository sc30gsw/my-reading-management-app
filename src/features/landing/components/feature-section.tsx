'use client'

import { motion } from 'framer-motion'
import { MOTION_VARIANTS, SPACING_CONFIG, TYPOGRAPHY_CONFIG } from '~/features/landing/constants'
import { features as defaultFeatures } from '~/features/landing/data'
import { useInView } from '~/features/landing/hooks/use-in-view'
import type { FeaturesSectionProps } from '~/features/landing/types'
import { cn } from '~/features/landing/utils'
import { FeatureCard } from './feature-card'

export function FeaturesSection({
  className,
  features = defaultFeatures,
  animated = true,
}: FeaturesSectionProps) {
  const { ref, isInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  return (
    <section
      ref={ref}
      data-testid="features-section"
      className={cn(
        'relative',
        SPACING_CONFIG.section.desktop,
        SPACING_CONFIG.container.padding,
        className,
      )}
      aria-label="主要機能一覧"
    >
      <div className={SPACING_CONFIG.container.maxWidth}>
        {/* Section Header */}
        <motion.div
          data-testid="features-header"
          className="mx-auto mb-16 max-w-3xl text-center"
          variants={animated ? MOTION_VARIANTS.slideUp : undefined}
          initial={animated ? 'hidden' : undefined}
          animate={animated && isInView ? 'visible' : undefined}
        >
          <h2
            className={cn(TYPOGRAPHY_CONFIG.headings.h2, TYPOGRAPHY_CONFIG.colors.primary, 'mb-6')}
          >
            主要機能
          </h2>
          <p
            className={cn(
              TYPOGRAPHY_CONFIG.body.large,
              TYPOGRAPHY_CONFIG.colors.secondary,
              'mx-auto max-w-2xl',
            )}
          >
            効果的な読書をサポートする3つの核心機能で、あなたの学習効果を最大化します
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          data-testid="features-container"
          className={cn(SPACING_CONFIG.container.padding, SPACING_CONFIG.container.maxWidth)}
        >
          <motion.div
            data-testid="features-grid"
            className={cn(
              'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
              SPACING_CONFIG.grid.gap,
            )}
            variants={animated ? MOTION_VARIANTS.staggerContainer : undefined}
            initial={animated ? 'hidden' : undefined}
            animate={animated && isInView ? 'visible' : undefined}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                index={index}
                animated={animated && isInView}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          className="mt-16 text-center"
          variants={animated ? MOTION_VARIANTS.fadeIn : undefined}
          initial={animated ? 'hidden' : undefined}
          animate={animated && isInView ? 'visible' : undefined}
          transition={{ delay: 0.6 }}
        >
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
            <div className="mx-auto max-w-2xl">
              <h3 className="mb-3 font-semibold text-blue-900 text-xl">
                なぜメンタルマップが重要なのか？
              </h3>
              <p className="text-blue-800 leading-relaxed">
                読書前に「なぜ読むか」「何を学びたいか」「どう活用するか」を3×3の構造で整理することで、
                <strong className="font-semibold">読書の質が85%向上</strong>し、
                学習効果を最大化できることが研究で実証されています。
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background decorations */}
      <div className="-z-10 absolute inset-0 overflow-hidden">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-0 h-72 w-72 transform rounded-full bg-blue-100/30 blur-3xl" />
        <div className="-translate-y-1/2 absolute top-1/4 right-0 h-96 w-96 translate-x-1/2 transform rounded-full bg-indigo-100/20 blur-3xl" />
      </div>
    </section>
  )
}
