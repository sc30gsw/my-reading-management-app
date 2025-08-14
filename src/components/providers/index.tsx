import type { ReactNode } from 'react'
import { NuqsProvider } from '~/components/providers/nuqs-provider'

export function Providers({ children }: Record<'children', ReactNode>) {
  return <NuqsProvider>{children}</NuqsProvider>
}
