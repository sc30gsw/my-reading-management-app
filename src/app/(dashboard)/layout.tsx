import { unauthorized } from 'next/navigation'
import { getServerSession } from '~/lib/get-server-session'
import type { NextLayoutProps } from '~/types/next'

export default async function DashboardLayout({ children }: NextLayoutProps) {
  const session = await getServerSession()

  if (!session) {
    unauthorized()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="font-semibold text-xl">読書管理アプリ</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">
              こんにちは、{session.user.name}さん
            </span>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
