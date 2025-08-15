'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Check, Star, Zap } from 'lucide-react'
import Link from 'next/link'

import { Button } from '~/components/ui/shadcn/button'
import { MOTION_VARIANTS, SPACING_CONFIG, TYPOGRAPHY_CONFIG } from '~/features/landing/constants'
import { pricingPlans as defaultPricingPlans } from '~/features/landing/data'
import { useInView } from '~/features/landing/hooks/use-in-view'
import type { PricingPlan, PricingSectionProps } from '~/features/landing/types'
import { cn } from '~/features/landing/utils'

// Pricing Card Component
function PricingCard({
  plan,
  index,
  isHighlighted,
  animated = true,
}: {
  plan: PricingPlan
  index: number
  isHighlighted: boolean
  animated: boolean
}) {
  const isFree = plan.price.monthly === 0
  const isTeam = plan.id === 'team'

  return (
    <motion.div
      className={cn(
        'relative rounded-2xl border-2 bg-white transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-xl',
        isHighlighted
          ? 'border-blue-500 shadow-lg ring-4 ring-blue-100'
          : 'border-slate-200 hover:border-blue-300',
      )}
      variants={animated ? MOTION_VARIANTS.slideUp : undefined}
      transition={
        animated
          ? {
              duration: 0.5,
              delay: index * 0.1,
            }
          : undefined
      }
    >
      {/* Popular badge */}
      {isHighlighted && (
        <div className="-top-4 -translate-x-1/2 absolute left-1/2 transform">
          <div className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 font-semibold text-sm text-white">
            <Star className="h-4 w-4 fill-current" />
            おすすめ
          </div>
        </div>
      )}

      <div className="p-8">
        {/* Plan Header */}
        <div className="mb-8 text-center">
          <h3 className="mb-2 font-bold text-2xl text-slate-900">{plan.name}</h3>

          <div className="mb-4">
            {isFree ? (
              <div className="font-bold text-4xl text-blue-600">無料</div>
            ) : (
              <div className="space-y-1">
                <div className="font-bold text-4xl text-slate-900">
                  ¥{plan.price.monthly.toLocaleString()}
                  <span className="font-normal text-lg text-slate-500">/月</span>
                </div>
                <div className="text-slate-600 text-sm">
                  年払い: ¥{plan.price.yearly.toLocaleString()}/年
                  <span className="ml-2 font-medium text-green-600">
                    {Math.round((1 - plan.price.yearly / (plan.price.monthly * 12)) * 100)}%お得
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <Button
            asChild
            size="lg"
            className={cn(
              'mb-6 w-full',
              isHighlighted
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200',
            )}
          >
            <Link href={plan.ctaUrl} className="flex items-center justify-center gap-2">
              {plan.ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Features List */}
        <div className="mb-8 space-y-4">
          <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">
            含まれる機能
          </h4>

          <ul className="space-y-3">
            {plan.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Limitations (for free plan) */}
        {plan.limitations && plan.limitations.length > 0 && (
          <div className="border-slate-200 border-t pt-6">
            <h4 className="mb-3 font-semibold text-slate-700 text-sm uppercase tracking-wide">
              制限事項
            </h4>
            <ul className="space-y-2">
              {plan.limitations.map((limitation, limitIndex) => (
                <li key={limitIndex} className="text-slate-500 text-sm">
                  • {limitation}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Special features for team plan */}
        {isTeam && (
          <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              <span className="font-semibold text-purple-900 text-sm">チーム向け特別機能</span>
            </div>
            <p className="text-purple-800 text-sm">
              企業・組織での読書会や学習グループ管理に最適な機能を提供します。
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function PricingSection({
  className,
  plans = defaultPricingPlans,
  highlightFreePlan = true,
}: PricingSectionProps) {
  const { ref, isInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  return (
    <section
      ref={ref}
      data-testid="pricing-section"
      className={cn(
        'relative bg-slate-50',
        SPACING_CONFIG.section.desktop,
        SPACING_CONFIG.container.padding,
        className,
      )}
    >
      <div className={SPACING_CONFIG.container.maxWidth}>
        {/* Section Header */}
        <motion.div
          className="mx-auto mb-16 max-w-3xl text-center"
          variants={MOTION_VARIANTS.slideUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ duration: 0.6 }}
        >
          <h2
            className={cn(TYPOGRAPHY_CONFIG.headings.h2, TYPOGRAPHY_CONFIG.colors.primary, 'mb-4')}
          >
            シンプルな料金体系
          </h2>

          <p
            className={cn(
              TYPOGRAPHY_CONFIG.body.large,
              TYPOGRAPHY_CONFIG.colors.secondary,
              'leading-relaxed',
            )}
          >
            無料プランから始めて、必要に応じてアップグレード。
            すべてのプランで14日間の無料トライアルをご利用いただけます。
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div
          className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={MOTION_VARIANTS.staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {plans.map((plan, index) => {
            const isHighlighted = highlightFreePlan
              ? plan.highlighted || plan.id === 'free'
              : (plan.highlighted ?? false)

            return (
              <PricingCard
                key={plan.id}
                plan={plan}
                index={index}
                isHighlighted={isHighlighted}
                animated={isInView}
              />
            )
          })}
        </motion.div>

        {/* Additional Information */}
        <motion.div
          className="space-y-8 text-center"
          variants={MOTION_VARIANTS.fadeIn}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* FAQ teaser */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h3 className="mb-4 font-semibold text-slate-900 text-xl">よくある質問</h3>
            <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium text-slate-900">
                  プランの変更はいつでも可能ですか？
                </h4>
                <p className="text-slate-600 text-sm">
                  はい、いつでもプランの変更が可能です。アップグレードは即座に反映され、ダウングレードは次の請求サイクルから適用されます。
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-slate-900">
                  無料プランに制限期間はありますか？
                </h4>
                <p className="text-slate-600 text-sm">
                  無料プランに期間制限はありません。ただし、月5冊までの読書記録制限があります。
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" asChild>
                <Link href="#faq">すべての質問を見る</Link>
              </Button>
            </div>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>SSL暗号化通信</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>データ定期バックアップ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span>24時間サポート</span>
            </div>
          </div>

          {/* Money back guarantee */}
          <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-6">
            <h3 className="mb-2 font-semibold text-lg text-slate-900">14日間返金保証</h3>
            <p className="text-slate-700">
              ご満足いただけない場合は、14日以内であれば全額返金いたします。
            </p>
          </div>
        </motion.div>
      </div>

      {/* Background Decoration */}
      <div className="-z-10 absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-100/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-indigo-100/30 blur-3xl" />
      </div>
    </section>
  )
}
