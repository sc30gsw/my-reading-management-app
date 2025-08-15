'use client'

import { motion } from 'framer-motion'
import {
  BarChart3,
  BookMarked,
  BookOpen,
  Brain,
  type LucideIcon,
  Network,
  TrendingUp,
} from 'lucide-react'
import { MOTION_VARIANTS, TYPOGRAPHY_CONFIG } from '~/features/landing/constants'
import type { FeatureCardProps } from '~/features/landing/types'
import { cn } from '~/features/landing/utils'

// Icon mapping for features
const FEATURE_ICONS: Record<string, LucideIcon> = {
  brain: Brain,
  'book-open': BookOpen,
  'trending-up': TrendingUp,
  analytics: BarChart3,
  'mind-map': Network,
  'book-management': BookMarked,
}

export function FeatureCard({ feature, index = 0, animated = true, className }: FeatureCardProps) {
  const IconComponent = FEATURE_ICONS[feature.icon] || Brain
  const isHighlighted = feature.highlighted

  return (
    <motion.div
      data-testid={`feature-card-${feature.id}`}
      data-highlighted={isHighlighted.toString()}
      className={cn(
        'group relative rounded-2xl p-6 transition-all duration-300',
        'border border-slate-200 bg-white',
        'hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg',
        // Highlighted styling
        isHighlighted && [
          'border-blue-300 bg-blue-50/50',
          'shadow-md ring-1 ring-blue-200/50',
          'highlighted',
        ],
        className,
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
      data-animate-on-scroll={animated.toString()}
    >
      {/* Highlight indicator for featured item */}
      {isHighlighted && (
        <div className="-top-3 absolute left-6 rounded-full bg-blue-600 px-3 py-1 font-semibold text-white text-xs">
          注目機能
        </div>
      )}

      {/* Icon */}
      <div
        className={cn(
          'mb-4 inline-flex items-center justify-center',
          'h-12 w-12 rounded-xl transition-colors duration-300',
          isHighlighted
            ? 'bg-blue-600 text-white group-hover:bg-blue-700'
            : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
        )}
      >
        <IconComponent className="h-6 w-6" data-testid="feature-icon" data-icon={feature.icon} />
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title */}
        <h3
          className={cn(
            TYPOGRAPHY_CONFIG.headings.h4,
            TYPOGRAPHY_CONFIG.colors.primary,
            'transition-colors duration-300 group-hover:text-blue-600',
          )}
        >
          {feature.title}
        </h3>

        {/* Description */}
        <p
          className={cn(
            TYPOGRAPHY_CONFIG.body.base,
            TYPOGRAPHY_CONFIG.colors.secondary,
            'leading-relaxed',
          )}
          data-testid="feature-description"
        >
          {feature.description}
        </p>
      </div>

      {/* Hover effect background */}
      <div
        className={cn(
          'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100',
          'bg-gradient-to-br from-blue-50/50 to-indigo-50/50',
          '-z-10 transition-opacity duration-300',
        )}
      />

      {/* Special highlighting for mental map feature */}
      {feature.id === 'mental-map' && (
        <motion.div
          className="-inset-0.5 -z-20 absolute rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  )
}
