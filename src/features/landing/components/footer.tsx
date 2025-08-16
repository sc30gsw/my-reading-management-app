'use client'

import { motion } from 'framer-motion'
import {
  ArrowUp,
  BookOpen,
  Facebook,
  Github,
  Heart,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react'
import Link from 'next/link'
import { SPACING_CONFIG } from '~/features/landing/constants'
import { cn } from '~/features/landing/utils'

// Footer Links
const FOOTER_LINKS = {
  product: {
    title: 'プロダクト',
    links: [
      { href: '#features', label: '機能' },
      { href: '#pricing', label: '料金プラン' },
      { href: '/demo', label: 'デモ' },
      { href: '/api', label: 'API' },
    ],
  },
  company: {
    title: '会社情報',
    links: [
      { href: '/about', label: '私たちについて' },
      { href: '/careers', label: '採用情報' },
      { href: '/news', label: 'ニュース' },
      { href: '/contact', label: 'お問い合わせ' },
    ],
  },
  support: {
    title: 'サポート',
    links: [
      { href: '/help', label: 'ヘルプセンター' },
      { href: '/guides', label: '使い方ガイド' },
      { href: '/community', label: 'コミュニティ' },
      { href: '/status', label: 'システム状況' },
    ],
  },
  legal: {
    title: '法的情報',
    links: [
      { href: '/privacy', label: 'プライバシーポリシー' },
      { href: '/terms', label: '利用規約' },
      { href: '/security', label: 'セキュリティ' },
      { href: '/compliance', label: 'コンプライアンス' },
    ],
  },
} as const

// Social Media Links
const SOCIAL_LINKS = [
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
] as const

// Contact Information
const CONTACT_INFO = [
  { icon: Mail, text: 'support@reading-app.com', href: 'mailto:support@reading-app.com' },
  { icon: Phone, text: '03-1234-5678', href: 'tel:03-1234-5678' },
  { icon: MapPin, text: '東京都渋谷区shibuya 1-1-1', href: '#' },
] as const

// Scroll to top function
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

export function Footer({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn('bg-slate-900 text-white', className)}>
      {/* Main Footer Content */}
      <div className={cn('mx-auto max-w-7xl', SPACING_CONFIG.container.padding, 'py-16')}>
        {/* Footer Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Company Info */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Logo */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl">読書管理</span>
            </div>

            {/* Description */}
            <p className="mb-6 text-slate-300 leading-relaxed">
              意図的読書で学習効果を最大化する次世代の読書管理アプリ。
              あなたの読書体験を変革し、継続的な成長をサポートします。
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {CONTACT_INFO.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 text-slate-300"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <IconComponent className="h-4 w-4 text-blue-400" />
                    {item.href === '#' ? (
                      <span className="text-sm">{item.text}</span>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm transition-colors hover:text-blue-400"
                      >
                        {item.text}
                      </Link>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Footer Links */}
          {Object.entries(FOOTER_LINKS).map(([key, section], sectionIndex) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (sectionIndex + 1) * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-4 font-semibold text-white">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: (sectionIndex + 1) * 0.1 + linkIndex * 0.05,
                    }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={link.href}
                      className="text-slate-300 text-sm transition-colors hover:text-blue-400"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          className="mt-12 border-slate-700 border-t pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="max-w-md">
            <h3 className="mb-2 font-semibold text-white">最新情報をお届け</h3>
            <p className="mb-4 text-slate-300 text-sm">
              新機能や読書に関するヒントを週1回お送りします
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="メールアドレス"
                className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              >
                登録
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-slate-700 border-t bg-slate-950">
        <div className={cn('mx-auto max-w-7xl', SPACING_CONFIG.container.padding, 'py-6')}>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright */}
            <motion.div
              className="flex items-center gap-2 text-slate-400 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span>© {currentYear} 読書管理. All rights reserved.</span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="h-3 w-3 fill-current text-red-500" /> in Japan
              </span>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {SOCIAL_LINKS.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <motion.a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-colors hover:bg-slate-700 hover:text-blue-400"
                    aria-label={social.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent className="h-4 w-4" />
                  </motion.a>
                )
              })}
            </motion.div>

            {/* Scroll to Top */}
            <motion.button
              onClick={scrollToTop}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-colors hover:bg-slate-700 hover:text-blue-400"
              aria-label="ページトップへ戻る"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <motion.div
        className="border-slate-700 border-t bg-slate-900 py-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className={cn('mx-auto max-w-7xl', SPACING_CONFIG.container.padding)}>
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-500 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>SSL暗号化</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>プライバシー準拠</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span>ISO27001認証</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              <span>24時間監視</span>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
