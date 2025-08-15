'use client'

import { getInputProps } from '@conform-to/react'
import { AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '~/components/ui/shadcn/alert'
import { Button } from '~/components/ui/shadcn/button'
import { Input } from '~/components/ui/shadcn/input'
import { Label } from '~/components/ui/shadcn/label'
import { useSignUp } from '~/features/auth/hooks/use-sign-up'
import type { SignUpSchema } from '~/features/auth/types/schemas/sign-up-schema'

function PasswordStrengthIndicator({ password }: Record<'password', SignUpSchema['password']>) {
  const getStrength = (password: string) => {
    if (password.length < 8) {
      return { level: 0, text: '弱い' } as const satisfies { level: number; text: string }
    }

    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { level: 2, text: '強い' } as const satisfies { level: number; text: string }
    }

    return { level: 1, text: '普通' } as const satisfies { level: number; text: string }
  }

  const strength = getStrength(password)
  const colors = [
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
  ] as const satisfies readonly string[]

  if (!password) {
    return null
  }

  return (
    <div className="mt-2">
      <div className="mb-1 flex space-x-1">
        {[0, 1, 2].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded ${
              level <= strength.level ? colors[strength.level] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-xs">
        パスワード強度:{' '}
        <span
          className={`font-medium ${
            strength.level === 0
              ? 'text-red-600'
              : strength.level === 1
                ? 'text-yellow-600'
                : 'text-green-600'
          }`}
        >
          {strength.text}
        </span>
      </p>
    </div>
  )
}

export function SignUpForm() {
  const { lastResult, action, isPending, showPassword, toggle, form, fields, password } =
    useSignUp()

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      role="form"
      aria-labelledby="sign-up-title"
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
        <Label htmlFor={fields.name.id}>ユーザー名</Label>
        <Input
          {...getInputProps(fields.name, { type: 'text' })}
          id={fields.name.id}
          placeholder="ユーザー名を入力してください"
          autoComplete="name"
          aria-describedby="name-error name-hint"
          aria-invalid={!!fields.name.errors}
          className={fields.name.errors ? 'border-destructive' : ''}
        />
        <div className="sr-only">お名前を入力してください</div>
        {fields.name.errors && (
          <div
            role="alert"
            aria-live="polite"
            className="mt-1 min-h-[1.25rem] text-destructive text-sm"
          >
            {fields.name.errors[0]}
          </div>
        )}
      </div>

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
            value={password.value ?? ''}
            onChange={(e) => password.change(e.target.value)}
            autoComplete="new-password"
            aria-describedby="password-error password-hint password-strength"
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
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <div className="sr-only">8文字以上のパスワードを入力してください</div>
        <div>
          <PasswordStrengthIndicator password={password.value ?? ''} />
        </div>
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
            <span>登録中...</span>
          </>
        ) : (
          'アカウント作成'
        )}
      </Button>
    </form>
  )
}
