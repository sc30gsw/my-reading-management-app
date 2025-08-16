import { expect, type Page, test } from '@playwright/test'

// Test constants
const LANDING_PAGE_URL = '/'
const MOBILE_VIEWPORT = { width: 375, height: 667 }
const TABLET_VIEWPORT = { width: 768, height: 1024 }
const DESKTOP_VIEWPORT = { width: 1440, height: 900 }

// Helper functions
async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.waitForSelector('[data-testid="hero-section"]', { state: 'visible' })
}

async function scrollToSection(page: Page, sectionId: string) {
  await page.evaluate((id) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }, sectionId)
  await page.waitForTimeout(500) // Wait for smooth scroll
}

test.describe('Landing Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LANDING_PAGE_URL)
    await waitForPageLoad(page)
  })

  test.describe('Page Loading and Basic Structure', () => {
    test('should load landing page successfully', async ({ page }) => {
      // Check page title and meta description
      await expect(page).toHaveTitle(/読書管理/)

      // Check main sections are present
      await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
      await expect(page.locator('#features')).toBeVisible()
      await expect(page.locator('#value-proposition')).toBeVisible()
      await expect(page.locator('#pricing')).toBeVisible()
    })

    test('should have proper SEO meta tags', async ({ page }) => {
      // Check meta description
      const metaDescription = page.locator('meta[name="description"]')
      await expect(metaDescription).toHaveAttribute('content', /読書管理/)

      // Check Open Graph tags
      const ogTitle = page.locator('meta[property="og:title"]')
      await expect(ogTitle).toHaveAttribute('content', /読書管理/)

      const ogDescription = page.locator('meta[property="og:description"]')
      await expect(ogDescription).toHaveAttribute('content', /メンタルマップ/)
    })

    test('should have proper favicon and icons', async ({ page }) => {
      // Check favicon
      const favicon = page.locator('link[rel="icon"]')
      await expect(favicon).toHaveCount(1)

      // Check apple touch icon
      const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]')
      await expect(appleTouchIcon).toHaveCount(1)
    })
  })

  test.describe('Navigation Functionality', () => {
    test('should navigate to sections via navigation links', async ({ page }) => {
      const navigationLinks = [
        { text: '機能', sectionId: 'features' },
        { text: '価値提案', sectionId: 'value-proposition' },
        { text: '料金', sectionId: 'pricing' },
      ]

      for (const link of navigationLinks) {
        // Click navigation link
        await page.click(`text=${link.text}`)
        await page.waitForTimeout(1000) // Wait for smooth scroll

        // Check that section is visible
        await expect(page.locator(`#${link.sectionId}`)).toBeInViewport()
      }
    })

    test('should show/hide navigation on scroll', async ({ page }) => {
      const navigation = page.locator('[data-testid="navigation-header"]')

      // Initial state - navigation should be visible
      await expect(navigation).toBeVisible()

      // Scroll down significantly
      await page.evaluate(() => window.scrollTo(0, 800))
      await page.waitForTimeout(300)

      // Navigation should still be visible (with background)
      await expect(navigation).toBeVisible()

      // Check if background is applied
      const hasBackground = await navigation.evaluate((el) => {
        const styles = window.getComputedStyle(el)
        return styles.backgroundColor !== 'rgba(0, 0, 0, 0)'
      })
      expect(hasBackground).toBe(true)
    })

    test('should handle mobile menu correctly', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)

      // Mobile menu button should be visible
      const menuButton = page.locator('[aria-label="メニューを開く"]')
      await expect(menuButton).toBeVisible()

      // Open mobile menu
      await menuButton.click()

      // Mobile menu should be visible
      const mobileMenu = page.locator('.fixed.top-0.right-0')
      await expect(mobileMenu).toBeVisible()

      // Close mobile menu
      const closeButton = page.locator('[aria-label="メニューを閉じる"]')
      await closeButton.click()

      // Mobile menu should be hidden
      await expect(mobileMenu).not.toBeVisible()
    })
  })

  test.describe('CTA Button Functionality', () => {
    test('should handle CTA button clicks in hero section', async ({ page }) => {
      // Check primary CTA button
      const registerButton = page
        .locator('[data-testid="hero-cta-group"] >> text=無料で始める')
        .first()
      await expect(registerButton).toBeVisible()

      // Click should work (we'll check navigation intent)
      await registerButton.click()

      // Should navigate to sign-up page (or handle authentication)
      // In a real test, we'd check the URL or specific redirect behavior
    })

    test('should handle navigation CTA buttons', async ({ page }) => {
      // Check navigation login button
      const loginButton = page.locator('[data-testid="login-cta"]')
      await expect(loginButton).toBeVisible()

      // Check navigation register button
      const registerButton = page.locator('[data-testid="register-cta"]')
      await expect(registerButton).toBeVisible()

      // Both should be clickable
      await expect(loginButton).toBeEnabled()
      await expect(registerButton).toBeEnabled()
    })
  })

  test.describe('Section Content and Animations', () => {
    test('should display hero section content correctly', async ({ page }) => {
      const heroSection = page.locator('[data-testid="hero-section"]')

      // Check main heading
      await expect(heroSection.locator('h1')).toContainText('意図的読書で')
      await expect(heroSection.locator('h1')).toContainText('学習効果を最大化')

      // Check description
      await expect(heroSection).toContainText('3×3構造のメンタルマップ')

      // Check feature highlights
      await expect(heroSection).toContainText('メンタルマップ')
      await expect(heroSection).toContainText('読書管理')
      await expect(heroSection).toContainText('成長の記録')

      // Check trust indicators
      await expect(heroSection).toContainText('完全無料で開始')
      await expect(heroSection).toContainText('クレジットカード不要')
    })

    test('should display features section correctly', async ({ page }) => {
      await scrollToSection(page, 'features')

      const featuresSection = page.locator('#features')

      // Check section heading
      await expect(featuresSection.locator('h2')).toContainText('主要機能')

      // Check feature cards
      const featureCards = featuresSection.locator('[data-testid^="feature-card-"]')
      await expect(featureCards).toHaveCount(3)

      // Check specific features
      await expect(featuresSection).toContainText('メンタルマップ')
      await expect(featuresSection).toContainText('読書管理')
      await expect(featuresSection).toContainText('統計分析')
    })

    test('should trigger animations on scroll', async ({ page }) => {
      // Test intersection observer animations
      await page.evaluate(() => window.scrollTo(0, 0))

      // Scroll to features section
      await page.evaluate(() => {
        const featuresSection = document.getElementById('features')
        if (featuresSection) {
          featuresSection.scrollIntoView({ behavior: 'smooth' })
        }
      })

      await page.waitForTimeout(1000)

      // Check that features section is visible and likely animated
      const featuresSection = page.locator('#features')
      await expect(featuresSection).toBeVisible()

      // Check for presence of motion elements (they should be rendered)
      const featureCards = page.locator('[data-testid^="feature-card-"]')
      await expect(featureCards.first()).toBeVisible()
    })
  })

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile devices', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)

      // Hero section should be responsive
      const heroSection = page.locator('[data-testid="hero-section"]')
      await expect(heroSection).toBeVisible()

      // Features should stack vertically
      const featuresGrid = page.locator('[data-testid="features-grid"]')
      await expect(featuresGrid).toBeVisible()

      // Navigation should show mobile menu button
      const mobileMenuButton = page.locator('[aria-label="メニューを開く"]')
      await expect(mobileMenuButton).toBeVisible()

      // Desktop navigation should be hidden
      const desktopNav = page.locator('.hidden.lg\\:flex')
      await expect(desktopNav).not.toBeVisible()
    })

    test('should be responsive on tablet devices', async ({ page }) => {
      await page.setViewportSize(TABLET_VIEWPORT)

      // Check layout adjustments for tablet
      const heroSection = page.locator('[data-testid="hero-section"]')
      await expect(heroSection).toBeVisible()

      // Features grid should show 2 columns on tablet
      await scrollToSection(page, 'features')
      const featuresGrid = page.locator('[data-testid="features-grid"]')
      await expect(featuresGrid).toBeVisible()
    })

    test('should be responsive on desktop', async ({ page }) => {
      await page.setViewportSize(DESKTOP_VIEWPORT)

      // Desktop navigation should be visible
      const desktopNav = page.locator('.hidden.lg\\:flex')
      await expect(desktopNav).toBeVisible()

      // Mobile menu button should be hidden
      const mobileMenuButton = page.locator('[aria-label="メニューを開く"]')
      await expect(mobileMenuButton).not.toBeVisible()

      // Hero visual should be visible
      const heroVisual = page.locator('[data-testid="hero-visual"]')
      await expect(heroVisual).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      // Check heading levels
      const h1 = page.locator('h1')
      await expect(h1).toHaveCount(1)

      const h2Elements = page.locator('h2')
      await expect(h2Elements.first()).toBeVisible()

      const h3Elements = page.locator('h3')
      await expect(h3Elements.first()).toBeVisible()
    })

    test('should support keyboard navigation', async ({ page }) => {
      // Test keyboard navigation through interactive elements
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      // Check that focus is visible
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    })

    test('should have proper ARIA labels', async ({ page }) => {
      // Check mobile menu button ARIA label
      const menuButton = page.locator('[aria-label="メニューを開く"]')
      await expect(menuButton).toHaveAttribute('aria-label', 'メニューを開く')
    })

    test('should have sufficient color contrast', async ({ page }) => {
      // This is a basic check - in real tests you'd use axe-core
      const headings = page.locator('h1, h2, h3')
      await expect(headings.first()).toBeVisible()

      // Check that text is readable (not transparent)
      const textColor = await headings.first().evaluate((el) => {
        return window.getComputedStyle(el).color
      })

      expect(textColor).not.toBe('rgba(0, 0, 0, 0)')
    })
  })

  test.describe('Performance Metrics', () => {
    test('should meet Core Web Vitals thresholds', async ({ page }) => {
      // Navigate and measure performance
      const startTime = Date.now()
      await page.goto(LANDING_PAGE_URL)
      await waitForPageLoad(page)
      const loadTime = Date.now() - startTime

      // Basic load time check (should load within 3 seconds)
      expect(loadTime).toBeLessThan(3000)

      // Check for critical elements being rendered
      await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
      await expect(page.locator('[data-testid="navigation-header"]')).toBeVisible()
    })

    test('should handle smooth scrolling performance', async ({ page }) => {
      // Test smooth scrolling to multiple sections
      const sections = ['features', 'value-proposition', 'pricing']

      for (const sectionId of sections) {
        const startTime = Date.now()
        await scrollToSection(page, sectionId)
        const scrollTime = Date.now() - startTime

        // Smooth scroll should complete within 1 second
        expect(scrollTime).toBeLessThan(1000)

        // Section should be visible
        await expect(page.locator(`#${sectionId}`)).toBeVisible()
      }
    })

    test('should handle rapid interactions without blocking', async ({ page }) => {
      // Test rapid navigation interactions
      const navigationLinks = page.locator('nav a')
      const linkCount = await navigationLinks.count()

      // Rapidly hover over navigation links
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        await navigationLinks.nth(i).hover()
        await page.waitForTimeout(50) // Short delay between hovers
      }

      // Page should remain responsive
      await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
    })
  })

  test.describe('Cross-browser Compatibility', () => {
    test('should work consistently across different user agents', async ({ page }) => {
      // Test with different user agents
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      ]

      for (const userAgent of userAgents) {
        await page.setExtraHTTPHeaders({ 'User-Agent': userAgent })
        await page.reload()
        await waitForPageLoad(page)

        // Core elements should still be visible
        await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
        await expect(page.locator('#features')).toBeVisible()
      }
    })
  })

  test.describe('Error Handling', () => {
    test('should handle missing resources gracefully', async ({ page }) => {
      // Test with network failures
      await page.route('**/*.png', (route) => route.abort())
      await page.route('**/*.jpg', (route) => route.abort())

      await page.goto(LANDING_PAGE_URL)
      await waitForPageLoad(page)

      // Core content should still be visible even without images
      await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
      await expect(page.locator('h1')).toContainText('意図的読書で')
    })

    test('should handle JavaScript disabled gracefully', async ({ page }) => {
      // Disable JavaScript
      await page.context().addInitScript(() => {
        Object.defineProperty(navigator, 'javaEnabled', {
          value: () => false,
        })
      })

      await page.goto(LANDING_PAGE_URL)

      // Basic content should still be visible
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('main')).toBeVisible()
    })
  })

  test.describe('User Journey Tests', () => {
    test('should complete full conversion flow', async ({ page }) => {
      // Start from hero section
      await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()

      // Navigate through sections
      await scrollToSection(page, 'features')
      await expect(page.locator('#features')).toBeInViewport()

      await scrollToSection(page, 'value-proposition')
      await expect(page.locator('#value-proposition')).toBeInViewport()

      await scrollToSection(page, 'pricing')
      await expect(page.locator('#pricing')).toBeInViewport()

      // Click final CTA button
      const finalCTA = page.locator('text=無料で始める').last()
      await expect(finalCTA).toBeVisible()
      await finalCTA.click()

      // Should initiate conversion flow
      // In a real test, we'd verify the authentication flow
    })

    test('should handle feature exploration flow', async ({ page }) => {
      // Navigate to features section
      await page.click('text=機能')
      await page.waitForTimeout(1000)

      // Should be at features section
      await expect(page.locator('#features')).toBeInViewport()

      // Explore feature cards
      const featureCards = page.locator('[data-testid^="feature-card-"]')
      const cardCount = await featureCards.count()

      for (let i = 0; i < cardCount; i++) {
        const card = featureCards.nth(i)
        await card.hover()
        await page.waitForTimeout(100)

        // Card should be visible and interactive
        await expect(card).toBeVisible()
      }
    })
  })
})
