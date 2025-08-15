'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  CheckCircle,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import { MOTION_VARIANTS, SPACING_CONFIG, TYPOGRAPHY_CONFIG } from '~/features/landing/constants'
import { valuePropositions as defaultValuePropositions } from '~/features/landing/data'
import { useInView } from '~/features/landing/hooks/use-in-view'
import type { ValuePropositionSectionProps } from '~/features/landing/types'
import { cn } from '~/features/landing/utils'

// Icon mapping for value propositions
const VALUE_ICONS = {
  'book-open': BookOpen,
  brain: Brain,
  'trending-up': TrendingUp,
}

// Statistics Display Component
function StatisticsDisplay({ showStatistics = true }) {
  if (!showStatistics) return null

  return (
    <motion.div
      data-testid="statistics-section"
      className="mt-12 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50 p-8"
      variants={MOTION_VARIANTS.slideUp}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="mb-8 text-center">
        <h3 className="mb-2 font-bold text-2xl text-slate-900">数字で見る効果</h3>
        <p className="text-slate-600">実際のユーザーデータに基づく改善効果</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {defaultValuePropositions.map((value, index) => (
          <motion.div
            key={value.id}
            className="text-center"
            variants={MOTION_VARIANTS.slideUp}
            transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
          >
            <div className="mb-2 font-bold text-3xl text-blue-600">
              {value.statistic?.trend === 'up' ? '+' : ''}
              {value.statistic?.value}
              {value.statistic?.unit}
            </div>
            <div className="font-medium text-slate-600 text-sm">{value.title}</div>
            <div
              className="mt-1 text-slate-500 text-xs"
              data-testid={`trend-indicator-${value.id}`}
              data-trend={value.statistic?.trend}
            >
              {value.statistic?.trend === 'up' && (
                <ArrowUpRight className="mr-1 inline h-4 w-4 text-green-500" />
              )}
              向上
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export function ValuePropositionSection({
  className,
  showStatistics = true,
  animateOnScroll = true,
}: ValuePropositionSectionProps) {
  const { ref, isInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  return (
    <section
      ref={ref}
      data-testid="value-proposition-section"
      className={cn(
        'relative',
        SPACING_CONFIG.section.desktop,
        SPACING_CONFIG.container.padding,
        className,
      )}
    >
      <div className={SPACING_CONFIG.container.maxWidth}>
        {/* Section Header */}
        <motion.div
          data-testid="value-prop-header"
          className="mx-auto mb-16 max-w-3xl text-center"
          variants={animateOnScroll ? MOTION_VARIANTS.slideUp : undefined}
          initial={animateOnScroll ? 'hidden' : undefined}
          animate={animateOnScroll && isInView ? 'visible' : undefined}
          transition={animateOnScroll ? { duration: 0.6 } : undefined}
        >
          <h2
            data-testid="value-prop-title"
            className={cn(TYPOGRAPHY_CONFIG.headings.h2, TYPOGRAPHY_CONFIG.colors.primary, 'mb-4')}
          >
            読書体験の変化
          </h2>

          <p
            data-testid="value-prop-description"
            className={cn(
              TYPOGRAPHY_CONFIG.body.large,
              TYPOGRAPHY_CONFIG.colors.secondary,
              'leading-relaxed',
            )}
          >
            従来の読書から意図的読書へ。あなたの学習体験を根本から変革します。
          </p>
        </motion.div>

        {/* Before/After Comparison */}
        <motion.div
          data-testid="before-after-container"
          className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2"
          variants={animateOnScroll ? MOTION_VARIANTS.staggerContainer : undefined}
          initial={animateOnScroll ? 'hidden' : undefined}
          animate={animateOnScroll && isInView ? 'visible' : undefined}
        >
          {/* Before Section */}
          <motion.div
            data-testid="before-section"
            className="space-y-6 rounded-2xl bg-slate-50 p-8 text-muted-foreground"
            variants={animateOnScroll ? MOTION_VARIANTS.slideInLeft : undefined}
            transition={animateOnScroll ? { duration: 0.6, delay: 0.2 } : undefined}
          >
            <div className="mb-4 flex items-center gap-3">
              <XCircle className="h-6 w-6 text-red-500" />
              <h3 className="font-semibold text-slate-700 text-xl">従来の読書</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-red-400" />
                <p>漠然とした読書で内容が頭に残らない</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-red-400" />
                <p>記録が残らず成長が見えない</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-red-400" />
                <p>読書の成果が実感できない</p>
              </div>
            </div>
          </motion.div>

          {/* After Section */}
          <motion.div
            data-testid="after-section"
            className="space-y-6 rounded-2xl border border-blue-200 bg-blue-50 p-8 text-primary"
            variants={animateOnScroll ? MOTION_VARIANTS.slideInRight : undefined}
            transition={animateOnScroll ? { duration: 0.6, delay: 0.4 } : undefined}
          >
            <div className="mb-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-blue-900 text-xl">意図的読書</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                <p className="text-blue-800">明確な目的を持った構造化された読書</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                <p className="text-blue-800">体系的な記録で成長を可視化</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                <p className="text-blue-800">継続的な学習効果の実感</p>
              </div>
            </div>
          </motion.div>

          {/* Arrow indicator */}
          <div
            className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 hidden transform lg:block"
            data-testid="before-after-arrow"
          >
            <div className="rounded-full border-2 border-blue-200 bg-white p-3 shadow-lg">
              <ArrowRight className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        {/* Value Propositions Grid */}
        <motion.div
          data-testid="value-propositions-grid"
          className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3"
          variants={animateOnScroll ? MOTION_VARIANTS.staggerContainer : undefined}
          initial={animateOnScroll ? 'hidden' : undefined}
          animate={animateOnScroll && isInView ? 'visible' : undefined}
        >
          {defaultValuePropositions.map((proposition, index) => {
            const IconComponent =
              VALUE_ICONS[proposition.icon as keyof typeof VALUE_ICONS] || BookOpen

            return (
              <motion.div
                key={proposition.id}
                data-testid={`value-prop-card-${proposition.id}`}
                className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-center transition-all duration-300 hover:border-blue-300 hover:shadow-lg"
                variants={animateOnScroll ? MOTION_VARIANTS.slideUp : undefined}
                transition={
                  animateOnScroll ? { duration: 0.5, delay: 0.6 + index * 0.1 } : undefined
                }
              >
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100">
                    <IconComponent
                      className="h-8 w-8 text-blue-600"
                      data-testid={`icon-${proposition.id.replace('-', '_')}`}
                      data-icon={proposition.icon}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-slate-900 text-xl">{proposition.title}</h3>

                {/* Before/After */}
                <div className="space-y-3 text-sm">
                  <div className="text-slate-500">
                    <span className="font-medium text-red-600">Before:</span>
                    <br />
                    {proposition.before}
                  </div>
                  <div className="text-slate-700">
                    <span className="font-medium text-blue-600">After:</span>
                    <br />
                    {proposition.after}
                  </div>
                </div>

                {/* Statistic */}
                {proposition.statistic && (
                  <div
                    className="rounded-lg bg-blue-50 p-3"
                    data-testid="value-statistic"
                    data-trend={proposition.statistic.trend}
                  >
                    <div className="font-bold text-2xl text-blue-600">
                      +{proposition.statistic.value}
                      {proposition.statistic.unit}
                    </div>
                    <div className="text-blue-800 text-xs">改善効果</div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* Statistics Section */}
        <StatisticsDisplay showStatistics={showStatistics} />

        {/* Value Flow Diagram */}
        <motion.div
          data-testid="value-flow-diagram"
          className="mt-16 text-center"
          variants={animateOnScroll ? MOTION_VARIANTS.fadeIn : undefined}
          initial={animateOnScroll ? 'hidden' : undefined}
          animate={animateOnScroll && isInView ? 'visible' : undefined}
          transition={animateOnScroll ? { duration: 0.6, delay: 1.0 } : undefined}
        >
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <h3 className="mb-4 font-bold text-2xl">継続的な成長サイクル</h3>
            <div className="flex flex-col items-center justify-center gap-4 text-sm md:flex-row">
              <div className="min-w-32 rounded-lg bg-white/20 p-3">意図設定</div>
              <ArrowRight className="h-4 w-4 rotate-90 md:rotate-0" />
              <div className="min-w-32 rounded-lg bg-white/20 p-3">効果的読書</div>
              <ArrowRight className="h-4 w-4 rotate-90 md:rotate-0" />
              <div className="min-w-32 rounded-lg bg-white/20 p-3">記録・分析</div>
              <ArrowRight className="h-4 w-4 rotate-90 md:rotate-0" />
              <div className="min-w-32 rounded-lg bg-white/20 p-3">継続改善</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Decoration */}
      <div className="-z-10 absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-yellow-100/30 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-blue-100/20 blur-3xl" />
      </div>
    </section>
  )
}
