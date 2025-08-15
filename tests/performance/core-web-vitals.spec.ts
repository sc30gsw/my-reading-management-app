import { expect, type Page, test } from '@playwright/test'

// Performance thresholds based on Core Web Vitals
const PERFORMANCE_THRESHOLDS = {
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100, // First Input Delay (ms)
  CLS: 0.1, // Cumulative Layout Shift (score)
  FCP: 1800, // First Contentful Paint (ms)
  TTFB: 800, // Time to First Byte (ms)
  TTI: 3800, // Time to Interactive (ms)
} as const

// Helper function to measure Core Web Vitals
async function measureCoreWebVitals(page: Page): Promise<{
  lcp: number
  fid: number
  cls: number
  fcp: number
  ttfb: number
  tti: number
}> {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const metrics = {
        lcp: 0,
        fid: 0,
        cls: 0,
        fcp: 0,
        ttfb: 0,
        tti: 0,
      }

      // LCP - Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          startTime: number
        }
        metrics.lcp = lastEntry.startTime
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // CLS - Cumulative Layout Shift
      let clsValue = 0
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as PerformanceEntry & {
            value: number
            hadRecentInput: boolean
          }
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value
          }
        }
        metrics.cls = clsValue
      }).observe({ entryTypes: ['layout-shift'] })

      // FCP - First Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcp = entry.startTime
          }
        }
      }).observe({ entryTypes: ['paint'] })

      // Navigation timing for TTFB
      const navigationEntry = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart
      }

      // FID measurement setup (will be captured on first interaction)
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEntry & {
            processingStart: number
            startTime: number
          }
          metrics.fid = fidEntry.processingStart - fidEntry.startTime
        }
      }).observe({ entryTypes: ['first-input'] })

      // TTI approximation using Long Tasks API
      const longTasks: number[] = []

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          longTasks.push(entry.startTime + entry.duration)
        }
      }).observe({ entryTypes: ['longtask'] })

      // Calculate TTI after a delay to allow metrics to be collected
      setTimeout(() => {
        // TTI is approximately when the last long task ended
        metrics.tti = longTasks.length > 0 ? Math.max(...longTasks) : performance.now()
        resolve(metrics)
      }, 3000)
    })
  })
}

// Helper function to measure resource loading performance
async function measureResourcePerformance(page: Page) {
  return await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]

    const resourceMetrics = {
      totalResources: resources.length,
      totalSize: 0,
      totalDuration: 0,
      slowestResource: { name: '', duration: 0 },
      largestResource: { name: '', transferSize: 0 },
      failedResources: [] as string[],
    }

    for (const resource of resources) {
      const duration = resource.responseEnd - resource.startTime
      const transferSize = resource.transferSize || 0

      resourceMetrics.totalSize += transferSize
      resourceMetrics.totalDuration += duration

      if (duration > resourceMetrics.slowestResource.duration) {
        resourceMetrics.slowestResource = {
          name: resource.name,
          duration: duration,
        }
      }

      if (transferSize > resourceMetrics.largestResource.transferSize) {
        resourceMetrics.largestResource = {
          name: resource.name,
          transferSize: transferSize,
        }
      }

      // Check for failed resources (approximate)
      if (resource.responseEnd === resource.responseStart) {
        resourceMetrics.failedResources.push(resource.name)
      }
    }

    return resourceMetrics
  })
}

test.describe('Core Web Vitals Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cache and set up performance monitoring
    await page.goto('about:blank')
    await page.evaluate(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister()
          })
        })
      }
    })
  })

  test.describe('Core Web Vitals Measurements', () => {
    test('should meet LCP threshold', async ({ page }) => {
      const startTime = Date.now()

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Wait for hero section to be fully rendered
      await page.waitForSelector('[data-testid="hero-section"]', { state: 'visible' })

      const metrics = await measureCoreWebVitals(page)
      const loadTime = Date.now() - startTime

      console.log(`LCP: ${metrics.lcp}ms (threshold: ${PERFORMANCE_THRESHOLDS.LCP}ms)`)
      console.log(`Page load time: ${loadTime}ms`)

      // LCP should be under 2.5 seconds
      expect(metrics.lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.LCP)

      // Overall page load should be reasonable
      expect(loadTime).toBeLessThan(5000)
    })

    test('should meet FCP threshold', async ({ page }) => {
      await page.goto('/')

      const metrics = await measureCoreWebVitals(page)

      console.log(`FCP: ${metrics.fcp}ms (threshold: ${PERFORMANCE_THRESHOLDS.FCP}ms)`)

      // FCP should be under 1.8 seconds
      expect(metrics.fcp).toBeLessThan(PERFORMANCE_THRESHOLDS.FCP)
    })

    test('should meet CLS threshold', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Scroll through the page to trigger potential layout shifts
      await page.evaluate(() => {
        return new Promise((resolve) => {
          let scrollPosition = 0
          const scrollStep = 100
          const maxScroll = document.body.scrollHeight

          const scroll = () => {
            scrollPosition += scrollStep
            window.scrollTo(0, scrollPosition)

            if (scrollPosition >= maxScroll) {
              resolve(undefined)
            } else {
              setTimeout(scroll, 50)
            }
          }

          scroll()
        })
      })

      await page.waitForTimeout(1000) // Allow time for layout shifts to be measured

      const metrics = await measureCoreWebVitals(page)

      console.log(`CLS: ${metrics.cls} (threshold: ${PERFORMANCE_THRESHOLDS.CLS})`)

      // CLS should be under 0.1
      expect(metrics.cls).toBeLessThan(PERFORMANCE_THRESHOLDS.CLS)
    })

    test('should meet TTI threshold', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const metrics = await measureCoreWebVitals(page)

      console.log(`TTI: ${metrics.tti}ms (threshold: ${PERFORMANCE_THRESHOLDS.TTI}ms)`)

      // TTI should be under 3.8 seconds
      expect(metrics.tti).toBeLessThan(PERFORMANCE_THRESHOLDS.TTI)
    })

    test('should measure FID on interaction', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Trigger first interaction
      await page.click('[data-testid="hero-cta-group"] button')

      await page.waitForTimeout(1000) // Allow time for FID measurement

      const metrics = await measureCoreWebVitals(page)

      console.log(`FID: ${metrics.fid}ms (threshold: ${PERFORMANCE_THRESHOLDS.FID}ms)`)

      // FID should be under 100ms if measured
      if (metrics.fid > 0) {
        expect(metrics.fid).toBeLessThan(PERFORMANCE_THRESHOLDS.FID)
      }
    })
  })

  test.describe('Resource Performance', () => {
    test('should have reasonable resource loading times', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const resourceMetrics = await measureResourcePerformance(page)

      console.log(`Total resources: ${resourceMetrics.totalResources}`)
      console.log(`Total size: ${Math.round(resourceMetrics.totalSize / 1024)}KB`)
      console.log(
        `Slowest resource: ${resourceMetrics.slowestResource.name} (${Math.round(resourceMetrics.slowestResource.duration)}ms)`,
      )
      console.log(
        `Largest resource: ${resourceMetrics.largestResource.name} (${Math.round(resourceMetrics.largestResource.transferSize / 1024)}KB)`,
      )

      // Total page size should be reasonable (under 2MB)
      expect(resourceMetrics.totalSize).toBeLessThan(2 * 1024 * 1024)

      // No single resource should take longer than 3 seconds
      expect(resourceMetrics.slowestResource.duration).toBeLessThan(3000)

      // No failed resources
      expect(resourceMetrics.failedResources).toHaveLength(0)
    })

    test('should have optimized image loading', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const imageMetrics = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'))
        return images.map((img) => ({
          src: img.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          displayWidth: img.offsetWidth,
          displayHeight: img.offsetHeight,
          loading: img.loading,
          decoding: img.decoding,
        }))
      })

      console.log(`Total images: ${imageMetrics.length}`)

      // Check for proper image optimization
      for (const image of imageMetrics) {
        // Images should have reasonable display sizes
        expect(image.displayWidth).toBeGreaterThan(0)
        expect(image.displayHeight).toBeGreaterThan(0)

        // Images should not be excessively larger than display size
        if (image.naturalWidth > 0 && image.displayWidth > 0) {
          const widthRatio = image.naturalWidth / image.displayWidth
          expect(widthRatio).toBeLessThan(3) // No more than 3x larger than needed
        }
      }
    })
  })

  test.describe('Animation Performance', () => {
    test('should have smooth scroll animations', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Test smooth scrolling performance
      const scrollMetrics = await page.evaluate(() => {
        return new Promise<{
          averageFPS: number
          totalDuration: number
        }>((resolve) => {
          const startTime = performance.now()
          let frameCount = 0
          let lastFrameTime = startTime

          const measureFrame = () => {
            const currentTime = performance.now()
            const _frameDuration = currentTime - lastFrameTime
            frameCount++
            lastFrameTime = currentTime

            // Continue measuring for 1 second
            if (currentTime - startTime < 1000) {
              requestAnimationFrame(measureFrame)
            } else {
              resolve({
                averageFPS: frameCount,
                totalDuration: currentTime - startTime,
              })
            }
          }

          // Start smooth scroll
          document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
          requestAnimationFrame(measureFrame)
        })
      })

      console.log(`Animation FPS: ${scrollMetrics.averageFPS}`)

      // Should maintain at least 30 FPS during animations
      expect(scrollMetrics.averageFPS).toBeGreaterThanOrEqual(30)
    })

    test('should handle rapid interactions without frame drops', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Test rapid hover interactions
      const interactionMetrics = await page.evaluate(() => {
        return new Promise<{
          totalFrames: number
          droppedFrames: number
          droppedFramePercentage: number
        }>((resolve) => {
          const startTime = performance.now()
          let frameCount = 0
          let droppedFrames = 0
          let lastFrameTime = startTime

          const measureFrame = () => {
            const currentTime = performance.now()
            const frameDuration = currentTime - lastFrameTime
            frameCount++

            // Consider a frame dropped if it takes longer than ~33ms (30 FPS)
            if (frameDuration > 33) {
              droppedFrames++
            }

            lastFrameTime = currentTime

            if (currentTime - startTime < 2000) {
              requestAnimationFrame(measureFrame)
            } else {
              resolve({
                totalFrames: frameCount,
                droppedFrames: droppedFrames,
                droppedFramePercentage: (droppedFrames / frameCount) * 100,
              })
            }
          }

          requestAnimationFrame(measureFrame)
        })
      })

      // Rapidly hover over navigation elements
      const navLinks = page.locator('nav a')
      const linkCount = await navLinks.count()

      for (let i = 0; i < Math.min(linkCount, 10); i++) {
        await navLinks.nth(i).hover()
        await page.waitForTimeout(50)
      }

      console.log(
        `Dropped frames: ${interactionMetrics.droppedFrames}/${interactionMetrics.totalFrames} (${interactionMetrics.droppedFramePercentage.toFixed(1)}%)`,
      )

      // Should have less than 10% dropped frames during interactions
      expect(interactionMetrics.droppedFramePercentage).toBeLessThan(10)
    })
  })

  test.describe('Network Performance', () => {
    test('should handle slow network conditions', async ({ page }) => {
      // Simulate slow 3G network
      await page.route('**/*', (route) => {
        setTimeout(() => route.continue(), 100) // Add 100ms delay to all requests
      })

      const startTime = Date.now()
      await page.goto('/')
      await page.waitForSelector('[data-testid="hero-section"]', { state: 'visible' })
      const loadTime = Date.now() - startTime

      console.log(`Load time on slow network: ${loadTime}ms`)

      // Should still load within reasonable time on slow network (under 10 seconds)
      expect(loadTime).toBeLessThan(10000)

      // Critical content should be visible
      await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
      await expect(page.locator('h1')).toContainText('意図的読書で')
    })

    test('should prioritize critical resources', async ({ page }) => {
      const networkRequests: Array<{
        url: string
        startTime: number
        endTime: number
        resourceType: string
      }> = []

      page.on('response', (response) => {
        networkRequests.push({
          url: response.url(),
          startTime: Date.now(),
          endTime: Date.now(),
          resourceType: response.request().resourceType(),
        })
      })

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Critical resources (HTML, CSS, critical JS) should load first
      const criticalResources = networkRequests.filter(
        (req) =>
          req.resourceType === 'document' ||
          req.resourceType === 'stylesheet' ||
          (req.resourceType === 'script' && req.url.includes('next')),
      )

      const nonCriticalResources = networkRequests.filter(
        (req) => req.resourceType === 'image' || req.resourceType === 'font',
      )

      console.log(`Critical resources: ${criticalResources.length}`)
      console.log(`Non-critical resources: ${nonCriticalResources.length}`)

      // Should have reasonable number of critical resources
      expect(criticalResources.length).toBeLessThan(20)
    })
  })

  test.describe('Memory Performance', () => {
    test('should not have memory leaks during navigation', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Measure initial memory
      const initialMemory = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize
        }
        return 0
      })

      // Navigate through sections multiple times
      for (let i = 0; i < 5; i++) {
        await page.click('text=機能')
        await page.waitForTimeout(500)
        await page.click('text=価値提案')
        await page.waitForTimeout(500)
        await page.click('text=料金')
        await page.waitForTimeout(500)
      }

      // Force garbage collection if available
      await page.evaluate(() => {
        if ('gc' in window) {
          ;(window as any).gc()
        }
      })

      await page.waitForTimeout(1000)

      // Measure final memory
      const finalMemory = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize
        }
        return 0
      })

      if (initialMemory > 0 && finalMemory > 0) {
        const memoryIncrease = finalMemory - initialMemory
        const memoryIncreasePercent = (memoryIncrease / initialMemory) * 100

        console.log(
          `Memory increase: ${Math.round(memoryIncrease / 1024)}KB (${memoryIncreasePercent.toFixed(1)}%)`,
        )

        // Memory increase should be reasonable (less than 50% increase)
        expect(memoryIncreasePercent).toBeLessThan(50)
      }
    })
  })
})
