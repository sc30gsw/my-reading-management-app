import { redirect } from 'next/navigation'
import { getServerSession } from '~/lib/get-server-session'
import type { NextLayoutProps } from '~/types/next'

export default async function AuthLayout({ children }: NextLayoutProps) {
  const session = await getServerSession()

  if (session) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">{children}</div>
    </div>
  )
}
