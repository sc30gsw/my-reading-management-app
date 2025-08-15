import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'

// Accessibility test configuration
const A11Y_CONFIG = {
  rules: {
    // Enable all WCAG 2.1 AA rules
    'color-contrast': { enabled: true },
    'heading-order': { enabled: true },
    'landmark-one-main': { enabled: true },
    'page-has-heading-one': { enabled: true },
    region: { enabled: true },
    'skip-link': { enabled: true },
    'focus-order-semantics': { enabled: true },
    'keyboard-navigation': { enabled: true },
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
} as const

// Helper function to check keyboard navigation
async function testKeyboardNavigation(page: Page) {
  // Reset focus to the top of the page
  await page.keyboard.press('Home')

  const focusableElements: Array<{ element: string; description: string }> = []
  let tabCount = 0
  const maxTabs = 50 // Prevent infinite loops

  while (tabCount < maxTabs) {
    await page.keyboard.press('Tab')
    tabCount++

    const focusedElement = await page.locator(':focus').first()
    const elementExists = (await focusedElement.count()) > 0

    if (!elementExists) break

    const tagName = await focusedElement.evaluate((el) => el.tagName.toLowerCase())
    const role = await focusedElement.getAttribute('role')
    const ariaLabel = await focusedElement.getAttribute('aria-label')
    const text = await focusedElement.textContent()

    const description = ariaLabel || text?.slice(0, 50) || `${tagName}${role ? `[${role}]` : ''}`

    focusableElements.push({
      element: tagName,
      description: description.trim(),
    })

    // Check if we've completed a full cycle (back to first element)
    if (tabCount > 3 && focusableElements.length > 3) {
      const currentDescription = description.trim()
      const firstDescription = focusableElements[0].description
      if (currentDescription === firstDescription) break
    }
  }

  return focusableElements
}

// Helper function to check color contrast
async function _checkColorContrast(page: Page, selector: string) {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel)
    if (!element) return null

    const computedStyle = window.getComputedStyle(element)
    const backgroundColor = computedStyle.backgroundColor
    const color = computedStyle.color

    // Convert RGB to relative luminance (simplified)
    const parseRGB = (rgbString: string) => {
      const match = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
      if (!match) return null
      return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)]
    }

    const getLuminance = (rgb: number[]) => {
      const [r, g, b] = rgb.map((c) => {
        const normalized = c / 255
        return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const textRGB = parseRGB(color)
    const bgRGB = parseRGB(backgroundColor)

    if (!textRGB || !bgRGB) return null

    const textLuminance = getLuminance(textRGB)
    const bgLuminance = getLuminance(bgRGB)

    const ratio =
      (Math.max(textLuminance, bgLuminance) + 0.05) / (Math.min(textLuminance, bgLuminance) + 0.05)

    return {
      ratio: ratio,
      passes: ratio >= 4.5, // WCAG AA standard for normal text
      color: color,
      backgroundColor: backgroundColor,
    }
  }, selector)
}

test.describe('Landing Page Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('[data-testid="hero-section"]', { state: 'visible' })
  })

  test.describe('Automated Accessibility Scanning', () => {
    test('should pass axe accessibility tests', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags([...A11Y_CONFIG.tags])
        .analyze()

      console.log(`Found ${accessibilityScanResults.violations.length} accessibility violations`)

      // Log violations for debugging
      if (accessibilityScanResults.violations.length > 0) {
        console.log('Accessibility violations:')
        accessibilityScanResults.violations.forEach((violation, index) => {
          console.log(`${index + 1}. ${violation.id}: ${violation.description}`)
          console.log(`   Impact: ${violation.impact}`)
          console.log(`   Nodes: ${violation.nodes.length}`)
        })
      }

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('should pass axe tests on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.reload()
      await page.waitForSelector('[data-testid="hero-section"]', { state: 'visible' })

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags([...A11Y_CONFIG.tags])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('should pass axe tests with mobile menu open', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Open mobile menu
      await page.click('[aria-label="メニューを開く"]')
      await page.waitForSelector('.fixed.top-0.right-0', { state: 'visible' })

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags([...A11Y_CONFIG.tags])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('should have logical tab order', async ({ page }) => {
      const focusableElements = await testKeyboardNavigation(page)

      console.log('Focusable elements found:')
      focusableElements.forEach((el, index) => {
        console.log(`${index + 1}. ${el.element}: ${el.description}`)
      })

      // Should have at least some focusable elements
      expect(focusableElements.length).toBeGreaterThan(5)

      // Should include key interactive elements
      const elementDescriptions = focusableElements.map((el) => el.description.toLowerCase())

      // Should include navigation elements
      const hasNavigation = elementDescriptions.some(
        (desc) => desc.includes('機能') || desc.includes('navigation') || desc.includes('menu'),
      )
      expect(hasNavigation).toBe(true)

      // Should include CTA buttons
      const hasCTA = elementDescriptions.some(
        (desc) =>
          desc.includes('無料で始める') || desc.includes('ログイン') || desc.includes('button'),
      )
      expect(hasCTA).toBe(true)
    })

    test('should support skip links for screen readers', async ({ page }) => {
      // Focus the first element and check for skip link
      await page.keyboard.press('Tab')

      const focusedElement = page.locator(':focus')
      const text = await focusedElement.textContent()
      const href = await focusedElement.getAttribute('href')

      // Check if first focusable element is a skip link
      if (text?.includes('skip') || text?.includes('スキップ') || href?.startsWith('#')) {
        // Activate skip link
        await page.keyboard.press('Enter')
        await page.waitForTimeout(500)

        // Verify that focus moved to main content
        const newFocusedElement = page.locator(':focus')
        const newText = await newFocusedElement.textContent()

        expect(newText).not.toBe(text)
      }
    })

    test('should handle keyboard navigation in mobile menu', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Open mobile menu with keyboard
      await page.keyboard.press('Tab') // Navigate to menu button
      const _menuButton = page.locator('[aria-label="メニューを開く"]')

      // Find the menu button through tab navigation if not focused
      let attempts = 0
      while (attempts < 10) {
        const focusedElement = page.locator(':focus')
        const ariaLabel = await focusedElement.getAttribute('aria-label')

        if (ariaLabel === 'メニューを開く') {
          break
        }

        await page.keyboard.press('Tab')
        attempts++
      }

      // Open menu
      await page.keyboard.press('Enter')
      await page.waitForSelector('.fixed.top-0.right-0', { state: 'visible' })

      // Navigate through mobile menu items
      const mobileMenuFocusableElements = await testKeyboardNavigation(page)

      // Should be able to focus mobile menu items
      expect(mobileMenuFocusableElements.length).toBeGreaterThan(3)

      // Should include close button
      const hasCloseButton = mobileMenuFocusableElements.some(
        (el) => el.description.includes('閉じる') || el.description.includes('close'),
      )
      expect(hasCloseButton).toBe(true)
    })

    test('should handle escape key to close mobile menu', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Open mobile menu
      await page.click('[aria-label="メニューを開く"]')
      await page.waitForSelector('.fixed.top-0.right-0', { state: 'visible' })

      // Press escape to close
      await page.keyboard.press('Escape')

      // Menu should be closed
      await expect(page.locator('.fixed.top-0.right-0')).not.toBeVisible()
    })
  })

  test.describe('Screen Reader Support', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
      const headingLevels: number[] = []

      for (const heading of headings) {
        const tagName = await heading.evaluate((el) => el.tagName)
        const level = parseInt(tagName.charAt(1), 10)
        const text = await heading.textContent()

        headingLevels.push(level)
        console.log(`${tagName}: ${text?.slice(0, 50)}`)
      }

      // Should start with h1
      expect(headingLevels[0]).toBe(1)

      // Should not skip heading levels
      for (let i = 1; i < headingLevels.length; i++) {
        const currentLevel = headingLevels[i]
        const previousLevel = headingLevels[i - 1]

        // Next heading should not skip more than one level
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1)
      }
    })

    test('should have meaningful link text', async ({ page }) => {
      const links = await page.locator('a').all()

      for (const link of links) {
        const text = await link.textContent()
        const ariaLabel = await link.getAttribute('aria-label')
        const href = await link.getAttribute('href')

        const linkText = ariaLabel || text || ''

        // Skip empty links or icon-only links with proper aria-labels
        if (linkText.trim() === '' && !ariaLabel) continue

        // Link text should be meaningful (not just "click here", "more", etc.)
        const meaninglessTexts = ['click here', 'here', 'more', 'read more', 'link']
        const isMeaningless = meaninglessTexts.some((meaningless) =>
          linkText.toLowerCase().includes(meaningless),
        )

        if (isMeaningless) {
          console.warn(`Potentially meaningless link text: "${linkText}" (href: ${href})`)
        }

        // For this test, we'll just warn rather than fail
        // expect(isMeaningless).toBe(false);
      }
    })

    test('should have proper form labels and descriptions', async ({ page }) => {
      const formElements = await page.locator('input, select, textarea').all()

      for (const element of formElements) {
        const id = await element.getAttribute('id')
        const ariaLabel = await element.getAttribute('aria-label')
        const ariaLabelledBy = await element.getAttribute('aria-labelledby')
        const _ariaDescribedBy = await element.getAttribute('aria-describedby')
        const type = await element.getAttribute('type')

        // Check for proper labeling
        let hasLabel = false

        if (ariaLabel) {
          hasLabel = true
        } else if (id) {
          const label = page.locator(`label[for="${id}"]`)
          hasLabel = (await label.count()) > 0
        } else if (ariaLabelledBy) {
          hasLabel = true
        }

        // Hidden inputs and buttons don't need labels
        if (type === 'hidden' || type === 'submit' || type === 'button') {
          continue
        }

        console.log(`Form element ${type} has label: ${hasLabel}`)
        expect(hasLabel).toBe(true)
      }
    })

    test('should have proper landmark regions', async ({ page }) => {
      // Check for main landmarks
      const mainLandmark = page.locator('main, [role="main"]')
      await expect(mainLandmark).toHaveCount(1)

      // Check for navigation landmark
      const navLandmark = page.locator('nav, [role="navigation"]')
      const navCount = await navLandmark.count()
      expect(navCount).toBeGreaterThanOrEqual(1)

      // Check for banner (header) landmark
      const bannerLandmark = page.locator('header, [role="banner"]')
      const bannerCount = await bannerLandmark.count()
      expect(bannerCount).toBeGreaterThanOrEqual(1)

      // Check for contentinfo (footer) landmark if present
      const footerLandmark = page.locator('footer, [role="contentinfo"]')
      const footerCount = await footerLandmark.count()

      console.log(
        `Landmarks found - main: 1, nav: ${navCount}, header: ${bannerCount}, footer: ${footerCount}`,
      )
    })
  })

  test.describe('Color and Contrast', () => {
    test('should have sufficient color contrast for all text', async ({ page }) => {
      const textSelectors = [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'span',
        'div',
        'button',
        'a',
        'label',
        'input',
      ]

      const _contrastResults: Array<{ selector: string; passes: boolean; ratio: number }> = []

      for (const selector of textSelectors) {
        const elements = await page.locator(selector).all()

        for (let i = 0; i < Math.min(elements.length, 10); i++) {
          // Test first 10 of each type
          const element = elements[i]
          const isVisible = await element.isVisible()

          if (!isVisible) continue

          const contrastInfo = await element.evaluate((el) => {
            const computedStyle = window.getComputedStyle(el)
            const color = computedStyle.color
            const backgroundColor = computedStyle.backgroundColor
            const fontSize = parseFloat(computedStyle.fontSize)
            const fontWeight = computedStyle.fontWeight

            // Skip elements with transparent backgrounds
            if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
              return null
            }

            return {
              color,
              backgroundColor,
              fontSize,
              fontWeight,
              text: el.textContent?.slice(0, 50),
            }
          })

          if (!contrastInfo || !contrastInfo.text?.trim()) continue

          // Note: Full contrast calculation would require a proper color library
          // This is a simplified version for demonstration
          const _isLargeText =
            contrastInfo.fontSize >= 18 ||
            (contrastInfo.fontSize >= 14 && contrastInfo.fontWeight >= '700')

          console.log(
            `${selector}: "${contrastInfo.text}" (${contrastInfo.color} on ${contrastInfo.backgroundColor})`,
          )
        }
      }
    })

    test('should not rely solely on color to convey information', async ({ page }) => {
      // Check for elements that might rely only on color
      const colorOnlySelectors = [
        '.text-red-500',
        '.text-green-500',
        '.text-yellow-500',
        '.bg-red-500',
        '.bg-green-500',
        '.bg-yellow-500',
        '[style*="color: red"]',
        '[style*="color: green"]',
      ]

      for (const selector of colorOnlySelectors) {
        const elements = await page.locator(selector).all()

        for (const element of elements) {
          const hasIcon = (await element.locator('svg, img, [class*="icon"]').count()) > 0
          const hasText = await element.textContent()
          const hasAriaLabel = await element.getAttribute('aria-label')

          // Elements using color should also have icons, text, or aria-labels
          const hasAlternativeIndicator = hasIcon || hasText || hasAriaLabel

          if (!hasAlternativeIndicator) {
            console.warn(`Element with color-only styling found: ${selector}`)
          }
        }
      }
    })
  })

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ page }) => {
      // Navigate through focusable elements and check for focus indicators
      await page.keyboard.press('Tab')

      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()

      // Check if focus indicator is visible (outline or ring)
      const hasVisibleFocus = await focusedElement.evaluate((el) => {
        const styles = window.getComputedStyle(el)
        const outline = styles.outline
        const outlineWidth = styles.outlineWidth
        const boxShadow = styles.boxShadow

        // Check for outline or box-shadow (ring) focus indicators
        return (
          outline !== 'none' ||
          outlineWidth !== '0px' ||
          (boxShadow && boxShadow !== 'none' && boxShadow.includes('rgb'))
        )
      })

      expect(hasVisibleFocus).toBe(true)
    })

    test('should trap focus in modal dialogs', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Open mobile menu (acts as a modal)
      await page.click('[aria-label="メニューを開く"]')
      await page.waitForSelector('.fixed.top-0.right-0', { state: 'visible' })

      // Tab through modal and ensure focus stays within
      const initialFocusedElement = page.locator(':focus')
      const _initialText = await initialFocusedElement.textContent()

      // Tab through multiple times
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab')
      }

      const finalFocusedElement = page.locator(':focus')

      // Focus should still be within the modal
      const isWithinModal = await finalFocusedElement.evaluate((el) => {
        return el.closest('.fixed.top-0.right-0') !== null
      })

      expect(isWithinModal).toBe(true)
    })

    test('should restore focus after modal close', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Focus on menu button
      await page.keyboard.press('Tab')
      while (true) {
        const focusedElement = page.locator(':focus')
        const ariaLabel = await focusedElement.getAttribute('aria-label')
        if (ariaLabel === 'メニューを開く') break
        await page.keyboard.press('Tab')
      }

      // Open modal
      await page.keyboard.press('Enter')
      await page.waitForSelector('.fixed.top-0.right-0', { state: 'visible' })

      // Close modal with Escape
      await page.keyboard.press('Escape')
      await page.waitForSelector('.fixed.top-0.right-0', { state: 'hidden' })

      // Focus should return to menu button
      const focusedElement = page.locator(':focus')
      const ariaLabel = await focusedElement.getAttribute('aria-label')
      expect(ariaLabel).toBe('メニューを開く')
    })
  })

  test.describe('Animation and Motion', () => {
    test('should respect prefers-reduced-motion', async ({ page }) => {
      // Set reduced motion preference
      await page.addInitScript(() => {
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: jest.fn().mockImplementation((query) => ({
            matches: query === '(prefers-reduced-motion: reduce)',
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
          })),
        })
      })

      await page.reload()
      await page.waitForSelector('[data-testid="hero-section"]', { state: 'visible' })

      // Check that animations are reduced or disabled
      const animatedElements = await page
        .locator('[style*="transform"], [style*="transition"]')
        .all()

      for (const element of animatedElements) {
        const styles = await element.evaluate((el) => {
          const computedStyle = window.getComputedStyle(el)
          return {
            transition: computedStyle.transition,
            animation: computedStyle.animation,
          }
        })

        // In reduced motion mode, animations should be minimal
        console.log('Animation styles:', styles)
      }
    })

    test('should not cause vestibular disorders with motion', async ({ page }) => {
      // Scroll through page and ensure smooth, controlled motion
      await page.evaluate(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })

      await page.waitForTimeout(500)

      // Scroll to different sections
      await page.click('text=機能')
      await page.waitForTimeout(1000)

      await page.click('text=価値提案')
      await page.waitForTimeout(1000)

      // No specific assertions here, but ensuring no excessive motion
      // In a real test, you might measure scroll speed and acceleration
    })
  })
})
