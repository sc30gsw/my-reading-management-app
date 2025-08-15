import { unauthorized } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/shadcn/card'
import { LogoutButton } from '~/features/auth/components/logout-button'
import { getServerSession } from '~/lib/get-server-session'

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    unauthorized()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="font-bold text-2xl">ダッシュボード</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2" data-testid="user-menu-trigger">
              <span className="text-muted-foreground text-sm">{session.user.email}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>ようこそ！</CardTitle>
              <CardDescription>ログインに成功しました</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">メールアドレス: {session.user.email}</p>
              <p className="text-muted-foreground text-sm">名前: {session.user.name || '未設定'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>読書管理</CardTitle>
              <CardDescription>読書リストを管理できます</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">機能は今後実装予定です</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>統計</CardTitle>
              <CardDescription>読書の進捗を確認できます</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">機能は今後実装予定です</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
