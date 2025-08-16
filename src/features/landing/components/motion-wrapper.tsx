'use client'

import { type MotionProps, motion } from 'framer-motion'
import { forwardRef, type ReactNode } from 'react'
import { cn } from '~/features/landing/utils'

type MotionWrapperProps = Omit<MotionProps, 'animation'> & {
  children: ReactNode
  className?: string
  enableGPU?: boolean
  reducedMotion?: boolean
  animation?: string
  as?: string | React.ComponentType<any>
  delay?: number
  duration?: number
  staggerChildren?: number
  triggerOnce?: boolean
  threshold?: number
  onAnimationComplete?: () => void
}

/**
 * Performance-optimized Motion wrapper component
 * Automatically applies GPU acceleration and respects user motion preferences
 */
export const MotionWrapper = forwardRef<HTMLDivElement, MotionWrapperProps>(
  (
    { children, className, enableGPU = true, reducedMotion = false, style, ...motionProps },
    ref,
  ) => {
    // Check for user's motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false

    // Disable animations if user prefers reduced motion
    const shouldAnimate = !prefersReducedMotion && !reducedMotion

    // GPU acceleration styles
    const gpuStyles = enableGPU
      ? {
          transform: 'translateZ(0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden' as const,
          perspective: 1000,
        }
      : {}

    // Override motion props for reduced motion
    const finalMotionProps = shouldAnimate
      ? motionProps
      : {
          ...motionProps,
          initial: false,
          animate: motionProps.animate ? { opacity: 1 } : undefined,
          transition: { duration: 0 },
        }

    return (
      <motion.div
        ref={ref}
        className={cn(enableGPU && 'gpu-accelerated', className)}
        style={{
          ...gpuStyles,
          ...style,
        }}
        {...finalMotionProps}
      >
        {children}
      </motion.div>
    )
  },
)

MotionWrapper.displayName = 'MotionWrapper'

/**
 * Optimized motion component for sections with lazy loading
 */
export const MotionSection = forwardRef<
  HTMLElement,
  MotionWrapperProps & {
    as?: keyof HTMLElementTagNameMap
  }
>(({ as = 'section', children, className, ...props }, ref) => {
  const Component = motion[as as keyof typeof motion] as any

  return (
    <Component
      ref={ref}
      className={cn('gpu-accelerated', className)}
      style={{
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
      {...props}
    >
      {children}
    </Component>
  )
})

MotionSection.displayName = 'MotionSection'

/**
 * Performance-optimized scroll-triggered animation hook
 */
export function useScrollAnimation() {
  // Check if animations should be disabled
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const defaultVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  }

  const fastVariants = {
    hidden: {
      opacity: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.3 },
    },
    visible: {
      opacity: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.3 },
    },
  }

  return {
    variants: defaultVariants,
    fastVariants,
    prefersReducedMotion,
  }
}

/**
 * Optimized stagger container for better performance
 */
export const StaggerContainer = forwardRef<
  HTMLDivElement,
  MotionWrapperProps & {
    staggerDelay?: number
  }
>(({ children, className, staggerDelay = 0.1, ...props }, ref) => {
  const { prefersReducedMotion } = useScrollAnimation()

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
        duration: prefersReducedMotion ? 0 : 0.3,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={cn('gpu-accelerated', className)}
      variants={staggerVariants}
      style={{
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
})

StaggerContainer.displayName = 'StaggerContainer'
