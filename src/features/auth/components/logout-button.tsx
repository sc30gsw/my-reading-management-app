'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '~/components/ui/shadcn/button'
import { useLogout } from '~/features/auth/hooks/use-logout'

export function LogoutButton() {
  const { isPending, handleLogout } = useLogout()
  return (
    <Button
      type="button"
      disabled={isPending}
      variant="outline"
      onClick={handleLogout}
      className="cursor-pointer disabled:cursor-not-allowed"
      data-testid="logout-button"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>ログアウト中...</span>
        </>
      ) : (
        'ログアウト'
      )}
    </Button>
  )
}
