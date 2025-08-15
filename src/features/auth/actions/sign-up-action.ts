'use server'

import { parseWithZod } from '@conform-to/zod/v4'
import { ERROR_MESSAGE } from '~/features/auth/constants/validation'
import { AuthService, AuthServiceError } from '~/features/auth/services/auth-service'
import { signUpSchema } from '~/features/auth/types/schemas/sign-up-schema'

const authService = new AuthService()

export async function signUpAction(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: signUpSchema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    await authService.signUp(
      submission.value.email,
      submission.value.name,
      submission.value.password,
    )

    return submission.reply()
  } catch (error) {
    if (error instanceof AuthServiceError) {
      return submission.reply({
        fieldErrors: {
          message: [error.message],
        },
      })
    }

    return submission.reply({
      fieldErrors: {
        message: [ERROR_MESSAGE.SERVER_ERROR],
      },
    })
  }
}
