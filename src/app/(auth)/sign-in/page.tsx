import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/shadcn/card'
import { SignInForm } from '~/features/auth/components/sign-in-form'

export const metadata: Metadata = {
  title: 'ログイン',
  description: 'アカウントにログインしてください',
}

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-bold text-3xl text-foreground tracking-tight">ログイン</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          アカウントをお持ちでない方は{' '}
          <Link
            href="/sign-up"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
          >
            アカウント作成
          </Link>
        </p>
      </div>

      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle data-testid="sign-in-title" className="text-center font-bold text-2xl">
            ログイン
          </CardTitle>
          <CardDescription className="text-center">
            メールアドレスとパスワードを入力してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  )
}
