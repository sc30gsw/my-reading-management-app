import { z } from 'zod/v4'
import { ERROR_MESSAGE } from '~/features/auth/constants/validation'

export const signInSchema = z.object({
  email: z
    .email({
      error: (issue) =>
        issue.input === undefined ? ERROR_MESSAGE.REQUIRED_EMAIL : ERROR_MESSAGE.INVALID_EMAIL,
    })
    .max(128, { message: ERROR_MESSAGE.TOO_LONG_EMAIL }),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? ERROR_MESSAGE.REQUIRED_PASSWORD
          : ERROR_MESSAGE.INVALID_PASSWORD,
    })
    .min(8, { message: ERROR_MESSAGE.WEAK_PASSWORD })
    .max(128, { message: ERROR_MESSAGE.TOO_LONG_PASSWORD }),
})

export type SignInSchema = z.infer<typeof signInSchema>
