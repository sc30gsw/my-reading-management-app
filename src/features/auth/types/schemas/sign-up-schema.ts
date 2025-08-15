import { z } from 'zod/v4'
import { ERROR_MESSAGE } from '~/features/auth/constants/validation'

export const signUpSchema = z.object({
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
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? ERROR_MESSAGE.REQUIRED_USER_NAME
          : ERROR_MESSAGE.INVALID_USER_NAME,
    })
    .min(1, { message: ERROR_MESSAGE.REQUIRED_USER_NAME })
    .max(128, { message: ERROR_MESSAGE.TOO_LONG_USER_NAME }),
})

export type SignUpSchema = z.infer<typeof signUpSchema>
