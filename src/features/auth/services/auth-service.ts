import { db } from '~/db'
import { ERROR_MESSAGE } from '~/features/auth/constants/validation'
import type { SignInSchema } from '~/features/auth/types/schemas/sign-in-schema'
import type { SignUpSchema } from '~/features/auth/types/schemas/sign-up-schema'
import { auth } from '~/lib/auth'

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown,
  ) {
    super(message)
    this.name = 'AuthServiceError'
  }
}

export class AuthService {
  async signUp(
    email: SignUpSchema['email'],
    name: SignUpSchema['name'],
    password: SignUpSchema['password'],
  ) {
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq, or }) => or(eq(users.email, email), eq(users.name, name)),
    })

    if (existingUser) {
      throw new AuthServiceError(ERROR_MESSAGE.ALREADY_EXISTS_USER, 'ALREADY_EXISTS_USER')
    }

    try {
      await auth.api.signUpEmail({
        body: {
          name,
          email,
          password,
        },
      })
    } catch (error) {
      throw new AuthServiceError(ERROR_MESSAGE.FAILED_SIGN_UP, 'FAILED_SIGN_UP', error)
    }
  }

  async signIn(email: SignInSchema['email'], password: SignInSchema['password']) {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    })

    if (!user) {
      throw new AuthServiceError(ERROR_MESSAGE.UNAUTHORIZED, 'UNAUTHORIZED')
    }

    try {
      await auth.api.signInEmail({
        body: {
          email,
          password,
        },
      })
    } catch (error) {
      throw new AuthServiceError(ERROR_MESSAGE.FAILED_SIGN_IN, 'FAILED_SIGN_IN', error)
    }
  }
}
