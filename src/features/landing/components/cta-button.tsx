import { motion } from 'framer-motion'
import { ArrowRight, Loader2, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '~/components/ui/shadcn/button'
import { cn } from '~/features/landing/utils'

export type CTAVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
export type CTASize = 'sm' | 'md' | 'lg' | 'xl' | 'large'
export type CTAAction = 'sign-up' | 'sign-in' | 'demo' | 'contact' | 'pricing'

type CTAButtonProps = {
  variant?: CTAVariant
  size?: CTASize
  action?: CTAAction
  text?: string
  href?: string
  className?: string
  showIcon?: boolean
  icon?: string
  external?: boolean
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  trackingId?: string
  children?: React.ReactNode
  onClick?: () => void
  'aria-label'?: string
  'aria-describedby'?: string
  'data-testid'?: string
}

// CTA action configurations
const CTA_ACTIONS = {
  'sign-up': {
    text: '無料で始める',
    href: '/sign-up',
    icon: UserPlus,
    trackingEvent: 'cta_sign_up_click',
  },
  'sign-in': {
    text: 'ログイン',
    href: '/sign-in',
    icon: LogIn,
    trackingEvent: 'cta_sign_in_click',
  },
  demo: {
    text: 'デモを見る',
    href: '/demo',
    icon: ArrowRight,
    trackingEvent: 'cta_demo_click',
  },
  contact: {
    text: 'お問い合わせ',
    href: '/contact',
    icon: ArrowRight,
    trackingEvent: 'cta_contact_click',
  },
  pricing: {
    text: '料金を見る',
    href: '#pricing',
    icon: ArrowRight,
    trackingEvent: 'cta_pricing_click',
  },
} as const

// Size configurations
const SIZE_CONFIG = {
  sm: {
    button: 'h-9 px-3 text-sm',
    icon: 'h-4 w-4',
  },
  md: {
    button: 'h-10 px-4 text-sm',
    icon: 'h-4 w-4',
  },
  lg: {
    button: 'h-11 px-6 text-base',
    icon: 'h-5 w-5',
  },
  xl: {
    button: 'h-12 px-8 text-lg',
    icon: 'h-6 w-6',
  },
  large: {
    button: 'h-12 px-8 text-lg',
    icon: 'h-6 w-6',
  },
} as const

// Analytics tracking function
function trackCTAClick(action: CTAAction, trackingId?: string) {
  if (
    typeof window !== 'undefined' &&
    'gtag' in window &&
    typeof (window as any).gtag === 'function'
  ) {
    const config = CTA_ACTIONS[action]
    ;(window as any).gtag('event', config.trackingEvent, {
      event_category: 'CTA',
      event_label: trackingId || action,
      value: 1,
    })
  }
}

// Map custom variants to shadcn/ui variants
function mapVariant(
  variant: CTAVariant,
): 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' {
  switch (variant) {
    case 'primary':
      return 'default'
    case 'default':
    case 'secondary':
    case 'outline':
    case 'ghost':
    case 'destructive':
      return variant
    default:
      return 'default'
  }
}

export function CTAButton({
  variant = 'primary',
  size = 'lg',
  action = 'sign-up',
  text,
  href,
  className,
  showIcon = true,
  external = false,
  fullWidth = false,
  disabled = false,
  loading = false,
  trackingId,
  children,
  onClick,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  'data-testid': dataTestId,
}: CTAButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const config = CTA_ACTIONS[action]
  const sizeConfig = SIZE_CONFIG[size]

  const finalText = text || config.text
  const finalHref = href || config.href
  const IconComponent = config.icon

  const handleClick = () => {
    if (!disabled && !loading) {
      trackCTAClick(action, trackingId)
      onClick?.()
    }
  }

  const buttonContent = (
    <>
      {loading ? (
        <Loader2 className={cn(sizeConfig.icon, 'mr-2 animate-spin')} />
      ) : (
        showIcon && (
          <IconComponent
            className={cn(
              sizeConfig.icon,
              'mr-2 transition-transform duration-200',
              isHovered && !loading && 'translate-x-0.5',
            )}
          />
        )
      )}
      {children || finalText}
      {showIcon && !loading && action !== 'sign-in' && (
        <motion.div
          className="ml-2"
          animate={{ x: isHovered ? 2 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <ArrowRight className={sizeConfig.icon} />
        </motion.div>
      )}
    </>
  )

  const buttonProps = {
    className: cn(
      sizeConfig.button,
      'relative overflow-hidden transition-all duration-300',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      'active:scale-95',
      fullWidth && 'w-full',
      disabled && 'opacity-50 cursor-not-allowed',
      className,
    ),
    disabled: disabled || loading,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onMouseDown: () => setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
    onClick: handleClick,
  }

  // Enhanced ripple effect
  const rippleVariants = {
    hidden: { scale: 0, opacity: 0.6 },
    visible: {
      scale: 4,
      opacity: 0,
    },
  }

  const mappedVariant = mapVariant(variant)

  if (finalHref && !disabled && !loading) {
    const linkProps = {
      href: finalHref,
      external,
      ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
      ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
      ...(ariaDescribedby ? { 'aria-describedby': ariaDescribedby } : {}),
      ...(dataTestId ? { 'data-testid': dataTestId } : {}),
    }
    return (
      <Button asChild variant={mappedVariant} {...buttonProps}>
        <Link {...linkProps} className="flex items-center justify-center">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {buttonContent}
          </motion.div>

          {/* Ripple effect */}
          <motion.div
            className="absolute inset-0 rounded-lg bg-white/20"
            variants={rippleVariants}
            initial="hidden"
            animate={isPressed ? 'visible' : 'hidden'}
          />
        </Link>
      </Button>
    )
  }

  return (
    <Button variant={mappedVariant} {...buttonProps} data-testid={dataTestId}>
      <motion.div
        className="flex items-center justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {buttonContent}
      </motion.div>

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-white/20"
        variants={rippleVariants}
        initial="hidden"
        animate={isPressed ? 'visible' : 'hidden'}
      />
    </Button>
  )
}

// Specialized CTA components for common use cases
export function RegisterCTA({ className, ...props }: Omit<CTAButtonProps, 'action'>) {
  return (
    <CTAButton
      action="sign-up"
      variant="default"
      className={cn('bg-blue-600 text-white hover:bg-blue-700', className)}
      {...props}
    />
  )
}

export function LoginCTA({ className, ...props }: Omit<CTAButtonProps, 'action'>) {
  return (
    <CTAButton
      action="sign-in"
      variant="outline"
      className={cn('border-blue-600 text-blue-600 hover:bg-blue-50', className)}
      {...props}
    />
  )
}

export function DemoCTA({ className, ...props }: Omit<CTAButtonProps, 'action'>) {
  return (
    <CTAButton
      action="demo"
      variant="secondary"
      className={cn('bg-slate-100 text-slate-900 hover:bg-slate-200', className)}
      {...props}
    />
  )
}

// CTA Button Group for multiple actions
export function CTAButtonGroup({
  primary,
  secondary,
  className,
  orientation = 'horizontal',
}: {
  primary: CTAButtonProps
  secondary?: CTAButtonProps
  className?: string
  orientation?: 'horizontal' | 'vertical'
}) {
  return (
    <div
      className={cn(
        'flex gap-3',
        orientation === 'vertical' ? 'flex-col' : 'flex-col sm:flex-row',
        className,
      )}
    >
      <CTAButton {...primary} />
      {secondary && <CTAButton {...secondary} />}
    </div>
  )
}

// Progressive enhancement wrapper
export function ProgressiveEnhancedCTA({
  fallbackHref,
  children,
  ...props
}: CTAButtonProps & { fallbackHref?: string }) {
  const [isJSEnabled, setIsJSEnabled] = useState(false)

  useEffect(() => {
    setIsJSEnabled(true)
  }, [])

  if (!isJSEnabled && fallbackHref) {
    // Fallback for no-JS scenarios
    return (
      <a
        href={fallbackHref}
        className={cn(
          'inline-flex items-center justify-center',
          'rounded-lg bg-blue-600 px-6 py-3 text-white',
          'transition-colors hover:bg-blue-700',
          props.className,
        )}
      >
        {children || CTA_ACTIONS[props.action || 'sign-up'].text}
      </a>
    )
  }

  return <CTAButton {...props}>{children}</CTAButton>
}
