import { useEffect } from 'react'
import { Button } from '~/components/ui/shadcn/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/shadcn/card'
import type { NextErrorProps } from '~/types/next'

export function ErrorBoundary({ error, reset }: NextErrorProps) {
  useEffect(() => {
    console.error('Error boundary caught:', error)
  }, [error])

  const isAuthError = error.message.includes('認証') || error.message.includes('未認証')
  const isNetworkError = error.message.includes('fetch') || error.message.includes('network')

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-destructive">
            {isAuthError && '認証エラー'}
            {isNetworkError && 'ネットワークエラー'}
            {!isAuthError && !isNetworkError && 'エラーが発生しました'}
          </CardTitle>
          <CardDescription>
            {isAuthError && '認証に失敗しました。再度ログインしてください。'}
            {isNetworkError && 'ネットワーク接続を確認してください。'}
            {!isAuthError && !isNetworkError && '予期しないエラーが発生しました。'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={reset} className="w-full cursor-pointer">
            再試行
          </Button>
          {isAuthError && (
            <Button variant="outline" asChild className="w-full cursor-pointer">
              <a href="/sign-in">ログインページへ</a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
