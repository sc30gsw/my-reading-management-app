import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { useToggle } from 'react-use'
import { toast } from 'sonner'
import { TOAST_COLOR } from '~/constants/toast'
import { signInAction } from '~/features/auth/actions/sign-in-action'
import { ERROR_MESSAGE } from '~/features/auth/constants/validation'
import { type SignInSchema, signInSchema } from '~/features/auth/types/schemas/sign-in-schema'
import { withCallbacks } from '~/utils/with-callback'

export function useSignIn() {
  const router = useRouter()

  const [lastResult, action, isPending] = useActionState(
    withCallbacks(signInAction, {
      onSuccess: () => {
        toast.success('ログインに成功しました。', {
          style: TOAST_COLOR.SUCCESS,
          position: 'top-center',
        })
        router.push('/')
      },
      onError: (result) => {
        toast.error(result.error?.message ?? ERROR_MESSAGE.FAILED_SIGN_IN, {
          style: TOAST_COLOR.ERROR,
          position: 'top-center',
        })
      },
    }),
    null,
  )
  const [showPassword, toggle] = useToggle(false)

  const [form, fields] = useForm<SignInSchema>({
    lastResult,
    constraint: getZodConstraint(signInSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signInSchema })
    },
    defaultValue: {
      email: '',
      password: '',
    },
  })

  return { action, form, fields, isPending, showPassword, toggle, lastResult } as const
}
