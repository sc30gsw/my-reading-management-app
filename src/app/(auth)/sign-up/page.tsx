import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/shadcn/card'
import { SignUpForm } from '~/features/auth/components/sign-up-form'

export const metadata: Metadata = {
  title: 'アカウント作成',
  description: '新しいアカウントを作成してください',
}

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-bold text-3xl text-foreground tracking-tight">アカウント作成</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          既にアカウントをお持ちの方は{' '}
          <Link
            href="/sign-in"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
          >
            ログイン
          </Link>
        </p>
      </div>

      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center font-bold text-2xl">アカウント作成</CardTitle>
          <CardDescription className="text-center">
            新しいアカウントを作成してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  )
}
