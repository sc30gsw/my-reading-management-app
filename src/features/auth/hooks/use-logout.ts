import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { TOAST_COLOR } from '~/constants/toast'
import { authClient } from '~/lib/auth-client'

export function useLogout() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('ログアウトしました。', {
              style: TOAST_COLOR.SUCCESS,
              position: 'top-center',
            })
            router.push('/sign-in')
          },
          onError: () => {
            toast.error('ログアウトに失敗しました。', {
              style: TOAST_COLOR.ERROR,
              position: 'top-center',
            })
          },
        },
      })
    })
  }

  return { isPending, handleLogout } as const
}
