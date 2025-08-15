'use client'

import { motion } from 'framer-motion'
import {
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { MOTION_VARIANTS, SPACING_CONFIG, TYPOGRAPHY_CONFIG } from '~/features/landing/constants'
import { testimonials as defaultTestimonials, landingStats } from '~/features/landing/data'
import { useCountAnimation } from '~/features/landing/hooks/use-count-animation'
import { useInView } from '~/features/landing/hooks/use-in-view'
import type { SocialProofSectionProps, Testimonial } from '~/features/landing/types'
import { cn } from '~/features/landing/utils'

// Stats Counter Component
function StatsCounter() {
  const { ref, isInView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  })

  const userCount = useCountAnimation(isInView ? landingStats.activeUsers : 0, {
    duration: 2000,
    easing: 'easeOut',
  })

  const bookCount = useCountAnimation(isInView ? landingStats.booksTracked : 0, {
    duration: 2500,
    easing: 'easeOut',
  })

  const effectivenessRate = useCountAnimation(isInView ? landingStats.effectivenessRate : 0, {
    duration: 2000,
    easing: 'easeOut',
  })

  return (
    <motion.div
      ref={ref}
      data-testid="stats-counter"
      className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3"
      variants={MOTION_VARIANTS.staggerContainer}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {/* Active Users */}
      <motion.div
        className="text-center"
        variants={MOTION_VARIANTS.slideUp}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="mb-3 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="mb-2 font-bold text-3xl text-blue-600 md:text-4xl">
          {userCount.count.toLocaleString()}+
        </div>
        <div className="font-medium text-slate-600">アクティブユーザー</div>
      </motion.div>

      {/* Books Tracked */}
      <motion.div
        className="text-center"
        variants={MOTION_VARIANTS.slideUp}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="mb-3 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-green-100">
            <BookOpen className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="mb-2 font-bold text-3xl text-green-600 md:text-4xl">
          {bookCount.count.toLocaleString()}+
        </div>
        <div className="font-medium text-slate-600">管理された書籍</div>
      </motion.div>

      {/* Effectiveness Rate */}
      <motion.div
        className="text-center"
        variants={MOTION_VARIANTS.slideUp}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="mb-3 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-100">
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="mb-2 font-bold text-3xl text-purple-600 md:text-4xl">
          {effectivenessRate.count}%
        </div>
        <div className="font-medium text-slate-600">学習効果向上率</div>
      </motion.div>
    </motion.div>
  )
}

// Testimonial Card Component
function TestimonialCard({
  testimonial,
  isActive = false,
}: {
  testimonial: Testimonial
  isActive: boolean
}) {
  return (
    <motion.div
      className={cn(
        'rounded-2xl border bg-white p-8 transition-all duration-300',
        isActive ? 'scale-105 border-blue-300 shadow-lg' : 'border-slate-200 shadow-md',
      )}
      data-testid={`testimonial-card-${testimonial.id}`}
      layout
    >
      {/* Quote Icon */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Quote className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      {/* Quote Content */}
      <blockquote className="mb-6 text-center text-lg text-slate-700 leading-relaxed">
        "{testimonial.content}"
      </blockquote>

      {/* Rating */}
      <div className="mb-4 flex justify-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-5 w-5',
              i < testimonial.rating ? 'fill-current text-yellow-400' : 'text-slate-300',
            )}
          />
        ))}
      </div>

      {/* Author Info */}
      <div className="text-center">
        <div className="mb-1 font-semibold text-slate-900">{testimonial.author}</div>
        <div className="text-slate-600 text-sm">{testimonial.role}</div>
        {testimonial.company && (
          <div className="font-medium text-blue-600 text-sm">{testimonial.company}</div>
        )}
      </div>
    </motion.div>
  )
}

// Testimonials Carousel Component
function TestimonialsCarousel({
  testimonials = defaultTestimonials,
}: {
  testimonials: Testimonial[]
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay, testimonials.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
    setIsAutoPlay(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlay(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlay(false)
  }

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3)
  if (visibleTestimonials.length < 3) {
    visibleTestimonials.push(...testimonials.slice(0, 3 - visibleTestimonials.length))
  }

  return (
    <div
      className="relative"
      data-testid="testimonials-carousel"
      role="region"
      aria-label="証言カルーセル"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Carousel Content */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleTestimonials.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.id}-${currentIndex}-${index}`}
            testimonial={testimonial}
            isActive={index === 1} // Middle card is active
          />
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="mb-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={goToPrevious}
          className="rounded-full border border-slate-300 p-2 transition-colors hover:border-blue-500 hover:bg-blue-50"
          aria-label="前の証言"
        >
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </button>

        {/* Pagination Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'h-2 w-2 rounded-full transition-colors',
                index === currentIndex ? 'bg-blue-600' : 'bg-slate-300 hover:bg-slate-400',
              )}
              aria-label={`証言 ${index + 1}へ移動`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goToNext}
          className="rounded-full border border-slate-300 p-2 transition-colors hover:border-blue-500 hover:bg-blue-50"
          aria-label="次の証言"
        >
          <ChevronRight className="h-5 w-5 text-slate-600" />
        </button>
      </div>

      {/* Auto-play indicator */}
      <div className="text-center text-slate-500 text-sm">
        {isAutoPlay ? '自動再生中' : '手動操作中'} • {testimonials.length}件の証言
      </div>
    </div>
  )
}

export function SocialProofSection({
  className,
  testimonials = defaultTestimonials,
  showStats = true,
  animated = true,
}: SocialProofSectionProps) {
  const { ref, isInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  return (
    <section
      ref={ref}
      data-testid="social-proof-section"
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
          variants={animated ? MOTION_VARIANTS.slideUp : undefined}
          initial={animated ? 'hidden' : undefined}
          animate={animated && isInView ? 'visible' : undefined}
          transition={animated ? { duration: 0.6 } : undefined}
        >
          <h2
            className={cn(TYPOGRAPHY_CONFIG.headings.h2, TYPOGRAPHY_CONFIG.colors.primary, 'mb-4')}
          >
            ユーザーの声
          </h2>

          <p
            className={cn(
              TYPOGRAPHY_CONFIG.body.large,
              TYPOGRAPHY_CONFIG.colors.secondary,
              'leading-relaxed',
            )}
          >
            意図的読書で人生が変わった方々の体験談をご覧ください。
            あなたも同じような変化を体験できます。
          </p>
        </motion.div>

        {/* Statistics Counter */}
        {showStats && <StatsCounter />}

        {/* Testimonials Carousel */}
        <motion.div
          variants={animated ? MOTION_VARIANTS.fadeIn : undefined}
          initial={animated ? 'hidden' : undefined}
          animate={animated && isInView ? 'visible' : undefined}
          transition={animated ? { duration: 0.8, delay: 0.4 } : undefined}
        >
          <TestimonialsCarousel testimonials={testimonials} />
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="mt-16 text-center"
          variants={animated ? MOTION_VARIANTS.slideUp : undefined}
          initial={animated ? 'hidden' : undefined}
          animate={animated && isInView ? 'visible' : undefined}
          transition={animated ? { duration: 0.6, delay: 0.8 } : undefined}
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h3 className="mb-6 font-semibold text-lg text-slate-900">信頼と実績</h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex items-center justify-center gap-3">
                <Award className="h-6 w-6 text-gold-500" />
                <span className="font-medium text-slate-700">読書効率化アプリ部門 1位</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Star className="h-6 w-6 fill-current text-yellow-500" />
                <span className="font-medium text-slate-700">App Store 4.8★評価</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Users className="h-6 w-6 text-blue-500" />
                <span className="font-medium text-slate-700">月間10,000+ユーザー</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Decoration */}
      <div className="-z-10 absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-blue-100/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/3 h-80 w-80 rounded-full bg-indigo-100/30 blur-3xl" />
      </div>
    </section>
  )
}
