import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { ReactNode } from 'react'

export function NuqsProvider({ children }: Record<'children', ReactNode>) {
  return <NuqsAdapter>{children}</NuqsAdapter>
}
