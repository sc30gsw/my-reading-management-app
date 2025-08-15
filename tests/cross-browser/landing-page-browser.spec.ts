import { devices, expect, type Page, test } from '@playwright/test'

// Browser configurations for testing
const _BROWSER_CONFIGS = [
  { name: 'Desktop Chrome', device: null, userAgent: null },
  { name: 'Desktop Firefox', device: null, userAgent: null },
  {
    name: 'Desktop Safari',
    device: null,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
  },
  { name: 'Mobile Chrome', device: devices['Pixel 5'], userAgent: null },
  { name: 'Mobile Safari', device: devices['iPhone 12'], userAgent: null },
  { name: 'Tablet iPad', device: devices['iPad Pro'], userAgent: null },
] as const

// Feature detection tests
async function testModernFeatures(page: Page) {
  return await page.evaluate(() => {
    const features = {
      // CSS Features
      cssGrid: CSS.supports('display', 'grid'),
      cssFlexbox: CSS.supports('display', 'flex'),
      cssCustomProperties: CSS.supports('--test', 'test'),
      cssClamp: CSS.supports('width', 'clamp(1rem, 2vw, 3rem)'),

      // JavaScript Features
      intersectionObserver: 'IntersectionObserver' in window,
      requestAnimationFrame: 'requestAnimationFrame' in window,
      fetch: 'fetch' in window,
      promises: 'Promise' in window,
      asyncAwait: (function () {
        try {
          // Check for async/await support without using eval
          return typeof (async () => {}).constructor === 'function'
        } catch (_e) {
          return false
        }
      })(),

      // Web APIs
      localStorage: 'localStorage' in window,
      sessionStorage: 'sessionStorage' in window,
      history: 'history' in window && 'pushState' in history,
      webGL: (() => {
        try {
          const canvas = document.createElement('canvas')
          return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        } catch (_e) {
          return false
        }
      })(),

      // Media Features
      webp: (() => {
        const canvas = document.createElement('canvas')
        canvas.width = 1
        canvas.height = 1
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
      })(),

      // Touch Support
      touchEvents: 'ontouchstart' in window,
      pointerEvents: 'PointerEvent' in window,

      // User Agent Info
      userAgent: navigator.userAgent,
    }

    return features
  })
}

// Cross-browser compatibility test suite
test.describe('Cross-Browser Landing Page Tests', () => {
  test.describe('Feature Detection and Polyfills', () => {
    test('should detect browser capabilities correctly', async ({ page, browserName }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const features = await testModernFeatures(page)

      console.log(`Browser: ${browserName}`)
      console.log('Feature support:', JSON.stringify(features, null, 2))

      // Core features should be supported in modern browsers
      expect(features.cssFlexbox).toBe(true)
      expect(features.fetch).toBe(true)
      expect(features.promises).toBe(true)
      expect(features.localStorage).toBe(true)

      // Optional features (warn if not supported)
      if (!features.cssGrid) {
        console.warn('CSS Grid not supported - fallback layout should be used')
      }

      if (!features.intersectionObserver) {
        console.warn('IntersectionObserver not supported - polyfill should be loaded')
      }

      if (!features.webp) {
        console.warn('WebP not supported - fallback images should be used')
      }
    })

    test('should load appropriate polyfills for older browsers', async ({ page }) => {
      // Simulate older browser by disabling modern features
      await page.addInitScript(() => {
        // Simulate missing IntersectionObserver
        if ('IntersectionObserver' in window) {
          delete (window as any).IntersectionObserver
        }

        // Simulate missing CSS Grid support
        if (CSS?.supports) {
          const originalSupports = CSS.supports
          CSS.supports = function (this: typeof CSS, propertyOrCondition: string, value?: string) {
            if (value !== undefined) {
              // Two-parameter version: supports(property, value)
              if (propertyOrCondition === 'display' && value === 'grid') {
                return false
              }
              return originalSupports(propertyOrCondition, value)
            } else {
              // Single-parameter version: supports(conditionText)
              return originalSupports(propertyOrCondition)
            }
          } as typeof CSS.supports
        }
      })

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Check that page still loads and functions
      await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
      await expect(page.locator('#features')).toBeVisible()

      // Test basic functionality without modern features
      await page.click('text=機能')
      await page.waitForTimeout(1000)
      await expect(page.locator('#features')).toBeInViewport()
    })
  })

  test.describe('Layout Consistency', () => {
    test('should maintain consistent layout across browsers', async ({ page, browserName }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Take screenshot for visual comparison
      const _screenshot = await page.screenshot({
        fullPage: true,
        animations: 'disabled',
      })

      // Basic layout checks
      const heroSection = page.locator('[data-testid="hero-section"]')
      await expect(heroSection).toBeVisible()

      const heroBox = await heroSection.boundingBox()
      expect(heroBox?.height).toBeGreaterThan(300)

      // Check features section layout
      const featuresSection = page.locator('#features')
      await expect(featuresSection).toBeVisible()

      const featuresBox = await featuresSection.boundingBox()
      expect(featuresBox?.height).toBeGreaterThan(200)

      console.log(
        `${browserName} layout - Hero: ${heroBox?.height}px, Features: ${featuresBox?.height}px`,
      )
    })

    test('should handle different viewport sizes consistently', async ({ page }) => {
      const viewports = [
        { width: 320, height: 568, name: 'Small Mobile' },
        { width: 375, height: 667, name: 'Mobile' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1024, height: 768, name: 'Tablet Landscape' },
        { width: 1440, height: 900, name: 'Desktop' },
        { width: 1920, height: 1080, name: 'Large Desktop' },
      ]

      for (const viewport of viewports) {
        await page.setViewportSize(viewport)
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        console.log(`Testing ${viewport.name} (${viewport.width}x${viewport.height})`)

        // Check that content is visible and accessible
        await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
        await expect(page.locator('h1')).toBeVisible()

        // Check that navigation works
        if (viewport.width >= 1024) {
          // Desktop navigation
          await expect(page.locator('.hidden.lg\\:flex')).toBeVisible()
        } else {
          // Mobile navigation
          await expect(page.locator('[aria-label="メニューを開く"]')).toBeVisible()
        }

        // Ensure no horizontal scrolling (except for very small screens)
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
        const viewportWidth = viewport.width

        if (viewport.width >= 375) {
          expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20) // Small tolerance
        }
      }
    })
  })

  test.describe('JavaScript Functionality', () => {
    test('should handle navigation interactions across browsers', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Test smooth scrolling navigation
      await page.click('text=機能')
      await page.waitForTimeout(1000)

      const featuresSection = page.locator('#features')
      await expect(featuresSection).toBeInViewport()

      // Test mobile menu (if applicable)
      const currentViewport = page.viewportSize()
      if (currentViewport && currentViewport.width < 1024) {
        const menuButton = page.locator('[aria-label="メニューを開く"]')
        if (await menuButton.isVisible()) {
          await menuButton.click()
          await expect(page.locator('.fixed.top-0.right-0')).toBeVisible()

          // Close menu
          await page.keyboard.press('Escape')
          await expect(page.locator('.fixed.top-0.right-0')).not.toBeVisible()
        }
      }
    })

    test('should handle form interactions consistently', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Test CTA button interactions
      const ctaButtons = page.locator('text=無料で始める')
      const buttonCount = await ctaButtons.count()

      expect(buttonCount).toBeGreaterThan(0)

      // Test hover states (desktop only)
      const viewport = page.viewportSize()
      if (viewport && viewport.width >= 1024) {
        await ctaButtons.first().hover()
        await page.waitForTimeout(300)

        // Button should be interactive
        await expect(ctaButtons.first()).toBeEnabled()
      }

      // Test click interaction
      await ctaButtons.first().click()
      // Note: In a real test, we'd verify the navigation or modal behavior
    })

    test('should handle animations and transitions smoothly', async ({ page, browserName }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Test scroll-based animations
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(500)

      // Scroll to trigger animations
      await page.evaluate(() => {
        const featuresSection = document.getElementById('features')
        if (featuresSection) {
          featuresSection.scrollIntoView({ behavior: 'smooth' })
        }
      })

      await page.waitForTimeout(1000)

      // Check that animations completed without errors
      const consoleErrors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text())
        }
      })

      // Additional scroll to test animation performance
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(1000)

      // Should have minimal console errors
      const animationErrors = consoleErrors.filter(
        (error) => error.includes('animation') || error.includes('transition'),
      )

      if (animationErrors.length > 0) {
        console.warn(`${browserName} animation warnings:`, animationErrors)
      }
    })
  })

  test.describe('Performance Across Browsers', () => {
    test('should load quickly on all browsers', async ({ page, browserName }) => {
      const startTime = Date.now()

      await page.goto('/')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('[data-testid="hero-section"]', { state: 'visible' })

      const loadTime = Date.now() - startTime

      console.log(`${browserName} load time: ${loadTime}ms`)

      // Load time should be reasonable (under 5 seconds for most browsers)
      expect(loadTime).toBeLessThan(5000)

      // Critical content should be visible
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('[data-testid="hero-cta-group"]')).toBeVisible()
    })

    test('should handle resource loading efficiently', async ({ page }) => {
      const _resourcePromises: Promise<any>[] = []
      const resourceErrors: string[] = []

      page.on('response', (response) => {
        if (!response.ok()) {
          resourceErrors.push(`${response.status()} ${response.url()}`)
        }
      })

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Check for failed resources
      if (resourceErrors.length > 0) {
        console.warn('Failed resources:', resourceErrors)
      }

      // Should have minimal failed resources
      expect(resourceErrors.length).toBeLessThan(3)

      // Check for essential resources
      const resourceTypes = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
        const types = new Set(resources.map((r) => r.initiatorType))
        return Array.from(types)
      })

      expect(resourceTypes).toContain('link') // CSS files
      expect(resourceTypes).toContain('script') // JS files
    })
  })

  test.describe('User Experience Consistency', () => {
    test('should provide consistent interaction feedback', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Test button hover states
      const primaryButton = page.locator('text=無料で始める').first()

      // Get initial styles
      const initialStyles = await primaryButton.evaluate((el) => {
        const styles = window.getComputedStyle(el)
        return {
          backgroundColor: styles.backgroundColor,
          transform: styles.transform,
        }
      })

      // Hover and check for changes
      await primaryButton.hover()
      await page.waitForTimeout(300)

      const hoverStyles = await primaryButton.evaluate((el) => {
        const styles = window.getComputedStyle(el)
        return {
          backgroundColor: styles.backgroundColor,
          transform: styles.transform,
        }
      })

      // Should have some visual feedback on hover
      const hasVisualChange =
        initialStyles.backgroundColor !== hoverStyles.backgroundColor ||
        initialStyles.transform !== hoverStyles.transform

      expect(hasVisualChange).toBe(true)
    })

    test('should handle focus states consistently', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Test keyboard navigation
      await page.keyboard.press('Tab')

      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()

      // Check for focus indicator
      const hasFocusStyles = await focusedElement.evaluate((el) => {
        const styles = window.getComputedStyle(el)
        return (
          styles.outline !== 'none' ||
          styles.outlineWidth !== '0px' ||
          styles.boxShadow?.includes('rgb')
        )
      })

      expect(hasFocusStyles).toBe(true)
    })

    test('should handle touch interactions on mobile browsers', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Test touch targets are appropriately sized
      const touchTargets = page.locator('button, a, [role="button"]')
      const targetCount = await touchTargets.count()

      for (let i = 0; i < Math.min(targetCount, 10); i++) {
        const target = touchTargets.nth(i)
        const isVisible = await target.isVisible()

        if (!isVisible) continue

        const box = await target.boundingBox()
        if (box) {
          // Touch targets should be at least 44x44px (WCAG guideline)
          expect(box.width).toBeGreaterThanOrEqual(44)
          expect(box.height).toBeGreaterThanOrEqual(44)
        }
      }
    })
  })

  test.describe('Error Handling', () => {
    test('should handle JavaScript errors gracefully', async ({ page, browserName }) => {
      const jsErrors: string[] = []

      page.on('pageerror', (error) => {
        jsErrors.push(error.message)
      })

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          jsErrors.push(msg.text())
        }
      })

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Interact with the page to trigger potential errors
      await page.click('text=機能')
      await page.waitForTimeout(1000)

      await page.click('text=価値提案')
      await page.waitForTimeout(1000)

      // Try mobile menu if available
      const mobileMenuButton = page.locator('[aria-label="メニューを開く"]')
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click()
        await page.waitForTimeout(500)
        await page.keyboard.press('Escape')
      }

      // Filter out known/acceptable errors
      const criticalErrors = jsErrors.filter(
        (error) =>
          !error.includes('favicon') &&
          !error.includes('analytics') &&
          !error.includes('gtag') &&
          !error.toLowerCase().includes('third-party'),
      )

      if (criticalErrors.length > 0) {
        console.warn(`${browserName} JavaScript errors:`, criticalErrors)
      }

      // Should have minimal critical JavaScript errors
      expect(criticalErrors.length).toBeLessThan(3)

      // Core functionality should still work
      await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
    })

    test('should handle network failures gracefully', async ({ page }) => {
      // Simulate network issues
      await page.route('**/*.css', (route) => {
        if (Math.random() > 0.8) {
          // 20% failure rate
          route.abort()
        } else {
          route.continue()
        }
      })

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Core content should still be accessible even with some resource failures
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('main')).toBeVisible()

      // Basic navigation should work
      await page.click('text=機能')
      await page.waitForTimeout(1000)
    })
  })
})
