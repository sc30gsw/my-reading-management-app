import { ShieldX } from 'lucide-react'
import Link from 'next/link'
import { Button } from '~/components/ui/shadcn/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/shadcn/card'

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <ShieldX className="h-8 w-8 text-red-600" aria-hidden="true" />
            </div>
            <CardTitle className="font-bold text-2xl text-gray-900">
              アクセスが拒否されました
            </CardTitle>
            <CardDescription className="text-gray-600">
              このページにアクセスする権限がありません。ログインが必要です。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <Button asChild className="w-full">
                <Link href="/sign-in">ログイン</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">ホームに戻る</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
