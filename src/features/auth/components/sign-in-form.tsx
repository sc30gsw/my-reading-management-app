'use client'

import { getInputProps } from '@conform-to/react'
import { AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '~/components/ui/shadcn/alert'
import { Button } from '~/components/ui/shadcn/button'
import { Input } from '~/components/ui/shadcn/input'
import { Label } from '~/components/ui/shadcn/label'
import { useSignIn } from '~/features/auth/hooks/use-sign-in'

export function SignInForm() {
  const { action, form, fields, isPending, showPassword, toggle, lastResult } = useSignIn()

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      role="form"
      aria-labelledby="sign-in-title"
      className="space-y-4"
    >
      {lastResult?.error && (
        <Alert variant="destructive" role="alert" aria-live="polite">
          <AlertTriangle />
          <AlertDescription>
            {Array.isArray(lastResult.error.message)
              ? lastResult.error.message.join(', ')
              : lastResult.error.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor={fields.email.id}>メールアドレス</Label>
        <Input
          {...getInputProps(fields.email, { type: 'email' })}
          id={fields.email.id}
          placeholder="example@example.com"
          autoComplete="email"
          aria-describedby="email-error email-hint"
          aria-invalid={!!fields.email.errors}
          className={fields.email.errors ? 'border-destructive' : ''}
        />
        <div className="sr-only">有効なメールアドレスを入力してください</div>
        {fields.email.errors && (
          <div
            role="alert"
            aria-live="polite"
            className="mt-1 min-h-[1.25rem] text-destructive text-sm"
          >
            {fields.email.errors[0]}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={fields.password.id}>パスワード</Label>
        <div className="relative">
          <Input
            {...getInputProps(fields.password, {
              type: showPassword ? 'text' : 'password',
            })}
            id={fields.password.id}
            placeholder="8文字以上のパスワード"
            autoComplete="current-password"
            aria-describedby="password-error password-hint"
            aria-invalid={!!fields.password.errors}
            className={`pr-10 ${fields.password.errors ? 'border-destructive' : ''}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => toggle(!showPassword)}
            aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
            tabIndex={0}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
        <div className="sr-only">8文字以上のパスワードを入力してください</div>
        {fields.password.errors && (
          <div
            role="alert"
            aria-live="polite"
            className="mt-1 min-h-[1.25rem] text-destructive text-sm"
          >
            {fields.password.errors[0]}
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer disabled:cursor-not-allowed"
        disabled={isPending}
        aria-describedby={isPending ? 'loading-state' : undefined}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>ログイン中...</span>
          </>
        ) : (
          'ログイン'
        )}
      </Button>
    </form>
  )
}
