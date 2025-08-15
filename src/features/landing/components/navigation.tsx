'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, LogIn, Menu, UserPlus, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '~/components/ui/shadcn/button'
import { useScrollPosition } from '~/features/landing/hooks/use-scroll-position'
import { cn } from '~/features/landing/utils'
import { LoginCTA, RegisterCTA } from './cta-button'

// Navigation Links
const NAVIGATION_LINKS = [
  { href: '#features', label: '機能', id: 'features' },
  { href: '#value-proposition', label: '価値提案', id: 'value-proposition' },
  { href: '#pricing', label: '料金', id: 'pricing' },
  { href: '#testimonials', label: 'お客様の声', id: 'testimonials' },
  { href: '#faq', label: 'FAQ', id: 'faq' },
] as const

// Mobile Menu Component
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleLinkClick = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Mobile Menu Panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[80vw] bg-white shadow-xl lg:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-slate-200 border-b p-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <span className="font-bold text-slate-900 text-xl">読書管理</span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2 transition-colors hover:bg-slate-100"
                  aria-label="メニューを閉じる"
                >
                  <X className="h-6 w-6 text-slate-600" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-6 py-8">
                <ul className="space-y-4">
                  {NAVIGATION_LINKS.map((link, index) => (
                    <motion.li
                      key={link.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={handleLinkClick}
                        className="block rounded-lg px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* CTA Buttons */}
              <div className="space-y-3 border-slate-200 border-t p-6">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login" onClick={handleLinkClick}>
                    <LogIn className="mr-2 h-4 w-4" />
                    ログイン
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/register" onClick={handleLinkClick}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    無料で始める
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Smooth scroll handler
function handleSmoothScroll(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault()

  if (href.startsWith('#')) {
    const targetId = href.slice(1)
    const target = document.getElementById(targetId)

    if (target) {
      const navHeight = 80 // Navigation height
      const targetPosition = target.offsetTop - navHeight

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      })
    }
  }
}

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY, scrollDirection } = useScrollPosition()

  // Hide navigation when scrolling down, show when scrolling up
  const isVisible = scrollDirection === 'up' || scrollY < 100
  const isScrolled = scrollY > 50

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 right-0 left-0 z-40 transition-all duration-300',
          isScrolled
            ? 'border-slate-200/20 border-b bg-white/95 shadow-lg backdrop-blur-md'
            : 'bg-transparent',
        )}
        initial={{ y: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          transition: { duration: 0.3, ease: 'easeInOut' },
        }}
        data-testid="navigation-header"
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="group flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 transition-colors group-hover:bg-blue-700">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span
                  className={cn(
                    'font-bold text-xl transition-colors',
                    isScrolled ? 'text-slate-900' : 'text-white',
                  )}
                >
                  読書管理
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
              className="hidden items-center space-x-8 lg:flex"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {NAVIGATION_LINKS.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                    className={cn(
                      'group relative font-medium text-sm transition-colors hover:text-blue-600',
                      isScrolled ? 'text-slate-700' : 'text-white hover:text-blue-200',
                    )}
                  >
                    {link.label}
                    <span className="-bottom-1 absolute left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Desktop CTA Buttons */}
            <motion.div
              className="hidden items-center space-x-3 lg:flex"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <LoginCTA
                size="md"
                variant={isScrolled ? 'outline' : 'secondary'}
                trackingId="nav-login"
                className={
                  isScrolled
                    ? 'border-slate-300 text-slate-700'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }
              />

              <RegisterCTA
                size="md"
                trackingId="nav-register"
                className="bg-blue-600 text-white hover:bg-blue-700"
              />
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              className="touch-target rounded-lg p-3 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
              onClick={toggleMobileMenu}
              aria-label="メニューを開く"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Menu className={cn('h-6 w-6', isScrolled ? 'text-slate-700' : 'text-white')} />
            </motion.button>
          </div>
        </nav>

        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"
          style={{
            width: `${Math.min((scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  )
}
