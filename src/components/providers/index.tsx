'use client'
import { type ReactNode, useEffect, useState } from 'react'
import { NuqsProvider } from '~/components/providers/nuqs-provider'

export function Providers({ children }: Record<'children', ReactNode>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <NuqsProvider>{children}</NuqsProvider>
}
