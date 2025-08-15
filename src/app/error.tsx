'use client'

import { ErrorBoundary } from '~/components/error-boundary'
import type { NextErrorProps } from '~/types/next'

export default function ErrorPage({ error, reset }: NextErrorProps) {
  return <ErrorBoundary error={error} reset={reset} />
}
