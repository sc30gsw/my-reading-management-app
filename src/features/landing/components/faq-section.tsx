'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Filter, HelpCircle, MessageCircle, Minus, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { MOTION_VARIANTS, SPACING_CONFIG, TYPOGRAPHY_CONFIG } from '~/features/landing/constants'
import { faqItems as defaultFaqItems } from '~/features/landing/data'
import { useInView } from '~/features/landing/hooks/use-in-view'
import type { FAQItem, FAQSectionProps } from '~/features/landing/types'
import { cn } from '~/features/landing/utils'

// FAQ Categories
const FAQ_CATEGORIES = [
  { id: 'all', label: 'すべて', icon: HelpCircle },
  { id: 'general', label: '一般', icon: MessageCircle },
  { id: 'pricing', label: '料金', icon: Filter },
  { id: 'features', label: '機能', icon: Search },
] as const

// FAQ Item Component
function FAQItemComponent({
  item,
  isOpen,
  onToggle,
  animated = true,
}: {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
  animated: boolean
}) {
  return (
    <motion.div
      className="overflow-hidden rounded-xl border border-slate-200 bg-white"
      data-testid={`faq-item-${item.id}`}
      variants={animated ? MOTION_VARIANTS.slideUp : undefined}
      layout
    >
      {/* Question Header */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'touch-target flex w-full items-center justify-between p-4 xs:p-6 text-left',
          'transition-colors duration-200 hover:bg-slate-50',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset',
          isOpen && 'border-blue-200 border-b bg-blue-50',
        )}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
      >
        <h3 className={cn('pr-4 font-semibold text-slate-900', TYPOGRAPHY_CONFIG.body.large)}>
          {item.question}
        </h3>

        <div
          className={cn(
            'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full',
            'transition-colors duration-200',
            isOpen ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300',
          )}
        >
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </div>
      </button>

      {/* Answer Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`faq-answer-${item.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-blue-100 border-t p-6 pt-0">
              <p className={cn('text-slate-700 leading-relaxed', TYPOGRAPHY_CONFIG.body.base)}>
                {item.answer}
              </p>

              {/* Category Badge */}
              <div className="mt-4">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs',
                    item.category === 'general' && 'bg-blue-100 text-blue-800',
                    item.category === 'pricing' && 'bg-green-100 text-green-800',
                    item.category === 'features' && 'bg-purple-100 text-purple-800',
                  )}
                >
                  {FAQ_CATEGORIES.find((cat) => cat.id === item.category)?.label || item.category}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Category Filter Component
function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}) {
  return (
    <div className="mb-8 flex flex-wrap justify-center gap-3">
      {FAQ_CATEGORIES.map((category) => {
        const IconComponent = category.icon
        const isSelected = selectedCategory === category.id

        return (
          <button
            type="button"
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              'flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-200',
              'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500',
              isSelected
                ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                : 'border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50',
            )}
            data-testid={`category-filter-${category.id}`}
          >
            <IconComponent className="h-4 w-4" />
            <span className="font-medium text-sm">{category.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// Search Component
function FAQSearch({
  searchTerm,
  onSearchChange,
}: {
  searchTerm: string
  onSearchChange: (term: string) => void
}) {
  return (
    <div className="relative mx-auto mb-8 max-w-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        placeholder="質問を検索..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={cn(
          'block w-full rounded-xl border border-slate-300 py-3 pr-3 pl-10',
          'text-slate-900 placeholder-slate-500',
          'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500',
          'transition-colors duration-200',
        )}
        data-testid="faq-search-input"
      />
    </div>
  )
}

export function FAQSection({
  className,
  faqItems = defaultFaqItems,
  showSearch = true,
  showCategories = true,
  animated = true,
  defaultOpenItems = [],
}: FAQSectionProps) {
  const { ref, isInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(defaultOpenItems?.map(String) || []),
  )
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter FAQ items based on category and search
  const filteredItems = faqItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch =
      searchTerm === '' ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    // Close all items when changing category
    setOpenItems(new Set())
  }

  return (
    <section
      ref={ref}
      data-testid="faq-section"
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
          className="mx-auto mb-12 max-w-3xl text-center"
          variants={animated ? MOTION_VARIANTS.slideUp : undefined}
          initial={animated ? 'hidden' : undefined}
          animate={animated && isInView ? 'visible' : undefined}
          transition={animated ? { duration: 0.6 } : undefined}
        >
          <h2
            className={cn(TYPOGRAPHY_CONFIG.headings.h2, TYPOGRAPHY_CONFIG.colors.primary, 'mb-4')}
          >
            よくある質問
          </h2>

          <p
            className={cn(
              TYPOGRAPHY_CONFIG.body.large,
              TYPOGRAPHY_CONFIG.colors.secondary,
              'leading-relaxed',
            )}
          >
            お客様からよく寄せられる質問にお答えします。
            他にご質問がございましたら、お気軽にお問い合わせください。
          </p>
        </motion.div>

        {/* Search Bar */}
        {showSearch && (
          <motion.div
            variants={animated ? MOTION_VARIANTS.fadeIn : undefined}
            initial={animated ? 'hidden' : undefined}
            animate={animated && isInView ? 'visible' : undefined}
            transition={animated ? { duration: 0.6, delay: 0.2 } : undefined}
          >
            <FAQSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </motion.div>
        )}

        {/* Category Filter */}
        {showCategories && (
          <motion.div
            variants={animated ? MOTION_VARIANTS.slideUp : undefined}
            initial={animated ? 'hidden' : undefined}
            animate={animated && isInView ? 'visible' : undefined}
            transition={animated ? { duration: 0.6, delay: 0.3 } : undefined}
          >
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </motion.div>
        )}

        {/* FAQ Items */}
        <motion.div
          className="mb-12 space-y-4"
          variants={animated ? MOTION_VARIANTS.staggerContainer : undefined}
          initial={animated ? 'hidden' : undefined}
          animate={animated && isInView ? 'visible' : undefined}
          data-testid="faq-items-container"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={animated ? MOTION_VARIANTS.slideUp : undefined}
                transition={
                  animated
                    ? {
                        duration: 0.5,
                        delay: 0.4 + index * 0.1,
                      }
                    : undefined
                }
              >
                <FAQItemComponent
                  item={item}
                  isOpen={openItems.has(item.id)}
                  onToggle={() => toggleItem(item.id)}
                  animated={animated}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="py-12 text-center"
              variants={animated ? MOTION_VARIANTS.fadeIn : undefined}
              transition={animated ? { duration: 0.6, delay: 0.4 } : undefined}
            >
              <HelpCircle className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <p className="text-slate-600">検索条件に一致する質問が見つかりませんでした。</p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="mt-2 font-medium text-blue-600 hover:text-blue-700"
              >
                検索条件をリセット
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 text-center"
          variants={animated ? MOTION_VARIANTS.slideUp : undefined}
          initial={animated ? 'hidden' : undefined}
          animate={animated && isInView ? 'visible' : undefined}
          transition={animated ? { duration: 0.6, delay: 0.8 } : undefined}
        >
          <MessageCircle className="mx-auto mb-4 h-12 w-12 text-blue-600" />
          <h3 className="mb-2 font-semibold text-slate-900 text-xl">
            まだ疑問が解決されませんか？
          </h3>
          <p className="mb-6 text-slate-700">
            お気軽にお問い合わせください。専門スタッフが丁寧にサポートいたします。
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              お問い合わせ
            </button>
            <button
              type="button"
              className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              サポートセンター
            </button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
          variants={animated ? MOTION_VARIANTS.staggerContainer : undefined}
          initial={animated ? 'hidden' : undefined}
          animate={animated && isInView ? 'visible' : undefined}
        >
          <motion.div
            className="text-center"
            variants={animated ? MOTION_VARIANTS.slideUp : undefined}
            transition={animated ? { duration: 0.5, delay: 1.0 } : undefined}
          >
            <div className="mb-1 font-bold text-2xl text-blue-600">平均2分</div>
            <div className="text-slate-600 text-sm">回答時間</div>
          </motion.div>

          <motion.div
            className="text-center"
            variants={animated ? MOTION_VARIANTS.slideUp : undefined}
            transition={animated ? { duration: 0.5, delay: 1.1 } : undefined}
          >
            <div className="mb-1 font-bold text-2xl text-green-600">98%</div>
            <div className="text-slate-600 text-sm">解決率</div>
          </motion.div>

          <motion.div
            className="text-center"
            variants={animated ? MOTION_VARIANTS.slideUp : undefined}
            transition={animated ? { duration: 0.5, delay: 1.2 } : undefined}
          >
            <div className="mb-1 font-bold text-2xl text-purple-600">24時間</div>
            <div className="text-slate-600 text-sm">サポート対応</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Decoration */}
      <div className="-z-10 absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 h-64 w-64 rounded-full bg-blue-100/20 blur-3xl" />
        <div className="absolute right-1/3 bottom-1/4 h-80 w-80 rounded-full bg-indigo-100/30 blur-3xl" />
      </div>
    </section>
  )
}
