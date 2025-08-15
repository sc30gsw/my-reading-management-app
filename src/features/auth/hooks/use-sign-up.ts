import { useForm, useInputControl } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { useToggle } from 'react-use'
import { toast } from 'sonner'
import { TOAST_COLOR } from '~/constants/toast'
import { signUpAction } from '~/features/auth/actions/sign-up-action'
import { ERROR_MESSAGE } from '~/features/auth/constants/validation'
import { type SignUpSchema, signUpSchema } from '~/features/auth/types/schemas/sign-up-schema'
import { withCallbacks } from '~/utils/with-callback'

export function useSignUp() {
  const router = useRouter()

  const [lastResult, action, isPending] = useActionState(
    withCallbacks(signUpAction, {
      onSuccess: () => {
        toast.success('アカウント作成に成功しました。', {
          style: TOAST_COLOR.SUCCESS,
          position: 'top-center',
        })
        router.push('/')
      },
      onError: (result) => {
        toast.error(result.error?.message ?? ERROR_MESSAGE.FAILED_SIGN_UP, {
          style: TOAST_COLOR.ERROR,
          position: 'top-center',
        })
      },
    }),
    null,
  )

  const [showPassword, toggle] = useToggle(false)

  const [form, fields] = useForm<SignUpSchema>({
    lastResult,
    constraint: getZodConstraint(signUpSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signUpSchema })
    },
    defaultValue: {
      name: '',
      email: '',
      password: '',
    },
  })

  const password = useInputControl(fields.password)

  return {
    lastResult,
    action,
    isPending,
    showPassword,
    toggle,
    form,
    fields,
    password,
  } as const
}
